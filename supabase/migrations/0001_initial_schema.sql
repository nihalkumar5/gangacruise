-- GangaCruise production schema for Supabase/Postgres.
-- Booking integrity is enforced with transactional RPCs, partial unique indexes,
-- idempotent payment records, and a public-safe realtime seat inventory table.

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$ begin create type public.app_role as enum ('customer', 'agent', 'staff', 'admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.content_status as enum ('draft', 'published', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.agent_status as enum ('pending', 'approved', 'suspended', 'rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type public.sailing_status as enum ('draft', 'scheduled', 'boarding', 'departed', 'completed', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.seat_category as enum ('standard', 'premium', 'front_row', 'private_deck', 'crew'); exception when duplicate_object then null; end $$;
do $$ begin create type public.reservation_status as enum ('held', 'confirmed', 'expired', 'cancelled', 'blocked'); exception when duplicate_object then null; end $$;
do $$ begin create type public.inventory_state as enum ('available', 'held', 'confirmed', 'blocked'); exception when duplicate_object then null; end $$;
do $$ begin create type public.booking_status as enum ('draft', 'awaiting_payment', 'paid', 'cancelled', 'refunded', 'expired', 'failed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_provider as enum ('razorpay'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type public.ticket_status as enum ('issued', 'checked_in', 'cancelled', 'refunded'); exception when duplicate_object then null; end $$;
do $$ begin create type public.media_kind as enum ('image', 'video', 'poster'); exception when duplicate_object then null; end $$;
do $$ begin create type public.notification_channel as enum ('email', 'whatsapp', 'sms'); exception when duplicate_object then null; end $$;
do $$ begin create type public.notification_status as enum ('queued', 'sent', 'failed', 'cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type public.commission_status as enum ('pending', 'approved', 'paid', 'void'); exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  full_name text,
  email citext,
  phone text,
  avatar_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role
    and not public.is_admin()
    and current_user not in ('postgres', 'service_role', 'supabase_admin')
  then
    raise exception 'Only admins can change profile roles';
  end if;

  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'customer'::public.app_role);
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('staff', 'admin');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'admin';
$$;

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  status public.agent_status not null default 'pending',
  agency_name text,
  referral_code text not null unique,
  commission_bps integer not null default 0 check (commission_bps between 0 and 10000),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger agents_set_updated_at
before update on public.agents
for each row execute function public.set_updated_at();

create table if not exists public.vessels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.content_status not null default 'draft',
  capacity integer not null check (capacity > 0),
  description text,
  deck_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger vessels_set_updated_at
before update on public.vessels
for each row execute function public.set_updated_at();

create table if not exists public.seats (
  id uuid primary key default gen_random_uuid(),
  vessel_id uuid not null references public.vessels(id) on delete cascade,
  deck_name text not null default 'main',
  section_name text,
  row_label text,
  seat_number text not null,
  seat_label text not null,
  category public.seat_category not null default 'standard',
  sort_order integer not null default 0,
  coordinates jsonb not null default '{}'::jsonb,
  is_accessible boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vessel_id, seat_label)
);

create index if not exists seats_vessel_active_idx on public.seats (vessel_id, is_active, category);
create trigger seats_set_updated_at
before update on public.seats
for each row execute function public.set_updated_at();

create table if not exists public.cruise_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  story text,
  duration_minutes integer not null check (duration_minutes > 0),
  embarkation_ghat text not null,
  disembarkation_ghat text,
  inclusions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cruise_products_status_idx on public.cruise_products (status, published_at desc);
create trigger cruise_products_set_updated_at
before update on public.cruise_products
for each row execute function public.set_updated_at();

create table if not exists public.gallery_assets (
  id uuid primary key default gen_random_uuid(),
  cruise_id uuid references public.cruise_products(id) on delete set null,
  kind public.media_kind not null default 'image',
  cloudinary_public_id text not null unique,
  secure_url text not null,
  alt_text text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  dominant_color text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_assets_cruise_status_idx on public.gallery_assets (cruise_id, status, sort_order);
create trigger gallery_assets_set_updated_at
before update on public.gallery_assets
for each row execute function public.set_updated_at();

create table if not exists public.cruise_routes (
  id uuid primary key default gen_random_uuid(),
  cruise_id uuid not null references public.cruise_products(id) on delete cascade,
  sequence integer not null,
  title text not null,
  ghat_name text,
  description text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  offset_minutes integer check (offset_minutes is null or offset_minutes >= 0),
  created_at timestamptz not null default now(),
  unique (cruise_id, sequence)
);

create index if not exists cruise_routes_cruise_sequence_idx on public.cruise_routes (cruise_id, sequence);

create table if not exists public.sailings (
  id uuid primary key default gen_random_uuid(),
  cruise_id uuid not null references public.cruise_products(id) on delete restrict,
  vessel_id uuid not null references public.vessels(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Asia/Kolkata',
  status public.sailing_status not null default 'scheduled',
  total_capacity integer not null check (total_capacity > 0),
  base_price_paise integer not null default 0 check (base_price_paise >= 0),
  currency char(3) not null default 'INR',
  booking_opens_at timestamptz,
  booking_cutoff_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (vessel_id, starts_at)
);

create index if not exists sailings_cruise_starts_idx on public.sailings (cruise_id, starts_at);
create index if not exists sailings_status_starts_idx on public.sailings (status, starts_at);
create trigger sailings_set_updated_at
before update on public.sailings
for each row execute function public.set_updated_at();

create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  cruise_id uuid not null references public.cruise_products(id) on delete cascade,
  sailing_id uuid references public.sailings(id) on delete cascade,
  seat_category public.seat_category,
  name text not null,
  currency char(3) not null default 'INR',
  amount_paise integer not null check (amount_paise >= 0),
  compare_at_paise integer check (compare_at_paise is null or compare_at_paise >= amount_paise),
  min_guests integer not null default 1 check (min_guests > 0),
  max_guests integer check (max_guests is null or max_guests >= min_guests),
  is_active boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_until is null or valid_from is null or valid_until > valid_from)
);

create index if not exists pricing_tiers_lookup_idx on public.pricing_tiers (cruise_id, sailing_id, seat_category, is_active);
create trigger pricing_tiers_set_updated_at
before update on public.pricing_tiers
for each row execute function public.set_updated_at();

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique default ('GC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  profile_id uuid references public.profiles(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  sailing_id uuid not null references public.sailings(id) on delete restrict,
  status public.booking_status not null default 'draft',
  hold_token uuid not null default gen_random_uuid(),
  hold_expires_at timestamptz,
  guest_count integer not null check (guest_count > 0),
  customer_name text not null,
  customer_email citext not null,
  customer_phone text not null,
  currency char(3) not null default 'INR',
  subtotal_paise integer not null default 0 check (subtotal_paise >= 0),
  tax_paise integer not null default 0 check (tax_paise >= 0),
  fee_paise integer not null default 0 check (fee_paise >= 0),
  discount_paise integer not null default 0 check (discount_paise >= 0),
  total_paise integer not null default 0 check (total_paise >= 0),
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_paise = greatest(subtotal_paise + tax_paise + fee_paise - discount_paise, 0))
);

create unique index if not exists bookings_idempotency_key_idx on public.bookings (idempotency_key) where idempotency_key is not null;
create index if not exists bookings_sailing_status_idx on public.bookings (sailing_id, status, created_at desc);
create index if not exists bookings_customer_email_idx on public.bookings (customer_email, created_at desc);
create index if not exists bookings_agent_idx on public.bookings (agent_id, created_at desc) where agent_id is not null;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create table if not exists public.seat_reservations (
  id uuid primary key default gen_random_uuid(),
  sailing_id uuid not null references public.sailings(id) on delete cascade,
  seat_id uuid not null references public.seats(id) on delete restrict,
  booking_id uuid references public.bookings(id) on delete cascade,
  status public.reservation_status not null,
  hold_token uuid,
  expires_at timestamptz,
  blocked_reason text,
  created_by uuid references public.profiles(id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status <> 'held') or (expires_at is not null and hold_token is not null and booking_id is not null)),
  check ((status <> 'confirmed') or (booking_id is not null)),
  check ((status <> 'blocked') or (blocked_reason is not null))
);

create unique index if not exists seat_reservations_active_unique_idx
  on public.seat_reservations (sailing_id, seat_id)
  where status in ('held', 'confirmed', 'blocked');

create index if not exists seat_reservations_expiry_idx
  on public.seat_reservations (expires_at)
  where status = 'held';

create index if not exists seat_reservations_booking_idx on public.seat_reservations (booking_id);
create trigger seat_reservations_set_updated_at
before update on public.seat_reservations
for each row execute function public.set_updated_at();

create table if not exists public.seat_inventory (
  sailing_id uuid not null references public.sailings(id) on delete cascade,
  seat_id uuid not null references public.seats(id) on delete cascade,
  state public.inventory_state not null default 'available',
  expires_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (sailing_id, seat_id)
);

create index if not exists seat_inventory_sailing_state_idx on public.seat_inventory (sailing_id, state);

create or replace function public.recompute_seat_inventory(p_sailing_id uuid, p_seat_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_state public.inventory_state;
  v_expires_at timestamptz;
begin
  select r.status::text::public.inventory_state, r.expires_at
    into v_state, v_expires_at
  from public.seat_reservations r
  where r.sailing_id = p_sailing_id
    and r.seat_id = p_seat_id
    and r.status in ('held', 'confirmed', 'blocked')
  order by case r.status when 'confirmed' then 1 when 'blocked' then 2 when 'held' then 3 else 4 end
  limit 1;

  insert into public.seat_inventory (sailing_id, seat_id, state, expires_at, updated_at)
  values (p_sailing_id, p_seat_id, coalesce(v_state, 'available'::public.inventory_state), v_expires_at, now())
  on conflict (sailing_id, seat_id)
  do update set state = excluded.state, expires_at = excluded.expires_at, updated_at = excluded.updated_at;
end;
$$;

create or replace function public.sync_seat_inventory()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform public.recompute_seat_inventory(old.sailing_id, old.seat_id);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    perform public.recompute_seat_inventory(new.sailing_id, new.seat_id);
    return new;
  end if;

  return old;
end;
$$;

drop trigger if exists seat_reservations_sync_inventory on public.seat_reservations;
create trigger seat_reservations_sync_inventory
after insert or update or delete on public.seat_reservations
for each row execute function public.sync_seat_inventory();

create table if not exists public.booking_guests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  seat_id uuid references public.seats(id) on delete set null,
  sort_order integer not null default 0,
  full_name text not null,
  age integer check (age is null or age between 0 and 120),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (booking_id, sort_order)
);

create unique index if not exists booking_guests_booking_seat_idx on public.booking_guests (booking_id, seat_id) where seat_id is not null;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  provider public.payment_provider not null default 'razorpay',
  provider_order_id text not null unique,
  provider_payment_id text unique,
  provider_signature text,
  status public.payment_status not null default 'created',
  currency char(3) not null default 'INR',
  amount_paise integer not null check (amount_paise >= 0),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_booking_idx on public.payments (booking_id, created_at desc);
create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null default 'razorpay',
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  ticket_code text not null unique,
  qr_token_hash text not null unique,
  status public.ticket_status not null default 'issued',
  issued_at timestamptz not null default now(),
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger tickets_set_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

create table if not exists public.agent_commissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  commission_bps integer not null check (commission_bps between 0 and 10000),
  commission_amount_paise integer not null check (commission_amount_paise >= 0),
  status public.commission_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agent_commissions_agent_status_idx on public.agent_commissions (agent_id, status, created_at desc);
create trigger agent_commissions_set_updated_at
before update on public.agent_commissions
for each row execute function public.set_updated_at();

create table if not exists public.group_enquiries (
  id uuid primary key default gen_random_uuid(),
  event_type text,
  preferred_date date,
  guest_count integer check (guest_count is null or guest_count > 0),
  customer_name text not null,
  customer_email citext not null,
  customer_phone text not null,
  budget_paise integer check (budget_paise is null or budget_paise >= 0),
  message text,
  status text not null default 'new',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists group_enquiries_status_date_idx on public.group_enquiries (status, created_at desc);
create trigger group_enquiries_set_updated_at
before update on public.group_enquiries
for each row execute function public.set_updated_at();

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  customer_name text not null,
  customer_location text,
  rating integer not null check (rating between 1 and 5),
  quote text not null,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_status_idx on public.testimonials (status, published_at desc);
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body_md text not null,
  seo jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_pages_status_idx on public.content_pages (status, slug);
create trigger content_pages_set_updated_at
before update on public.content_pages
for each row execute function public.set_updated_at();

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  channel public.notification_channel not null,
  recipient text not null,
  template_key text not null,
  status public.notification_status not null default 'queued',
  provider_message_id text,
  payload jsonb not null default '{}'::jsonb,
  error text,
  attempts integer not null default 0 check (attempts >= 0),
  next_retry_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notification_events_retry_idx on public.notification_events (status, next_retry_at) where status in ('queued', 'failed');
create index if not exists notification_events_booking_idx on public.notification_events (booking_id, created_at desc);
create trigger notification_events_set_updated_at
before update on public.notification_events
for each row execute function public.set_updated_at();

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on public.audit_logs (entity_table, entity_id, created_at desc);
create index if not exists audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  session_id text,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_time_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id, created_at desc);

create or replace function public.expire_stale_holds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.seat_reservations
  set status = 'expired', updated_at = now()
  where status = 'held'
    and expires_at <= now();

  get diagnostics v_count = row_count;

  update public.bookings
  set status = 'expired', updated_at = now()
  where status in ('draft', 'awaiting_payment')
    and hold_expires_at <= now();

  return v_count;
end;
$$;

create or replace function public.create_seat_hold(
  p_sailing_id uuid,
  p_seat_ids uuid[],
  p_customer_name text,
  p_customer_email citext,
  p_customer_phone text,
  p_agent_referral_code text default null
)
returns table (
  booking_id uuid,
  booking_reference text,
  hold_token uuid,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sailing public.sailings%rowtype;
  v_booking public.bookings%rowtype;
  v_expires_at timestamptz := now() + interval '10 minutes';
  v_valid_seats integer;
  v_agent_id uuid;
begin
  if p_seat_ids is null or cardinality(p_seat_ids) = 0 then
    raise exception 'At least one seat is required';
  end if;

  if (select count(distinct x.seat_id) from unnest(p_seat_ids) as x(seat_id)) <> cardinality(p_seat_ids) then
    raise exception 'Duplicate seats are not allowed';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_sailing_id::text));
  perform public.expire_stale_holds();

  select * into v_sailing
  from public.sailings
  where id = p_sailing_id
  for update;

  if not found then
    raise exception 'Sailing not found';
  end if;

  if v_sailing.status <> 'scheduled' or v_sailing.starts_at <= now() then
    raise exception 'Sailing is not bookable';
  end if;

  if v_sailing.booking_opens_at is not null and now() < v_sailing.booking_opens_at then
    raise exception 'Booking has not opened for this sailing';
  end if;

  if v_sailing.booking_cutoff_at is not null and now() > v_sailing.booking_cutoff_at then
    raise exception 'Booking has closed for this sailing';
  end if;

  select count(*) into v_valid_seats
  from public.seats s
  where s.id = any(p_seat_ids)
    and s.vessel_id = v_sailing.vessel_id
    and s.is_active = true
    and s.category <> 'crew';

  if v_valid_seats <> cardinality(p_seat_ids) then
    raise exception 'One or more seats are invalid for this sailing';
  end if;

  select a.id into v_agent_id
  from public.agents a
  where a.referral_code = p_agent_referral_code
    and a.status = 'approved';

  insert into public.bookings (
    agent_id,
    sailing_id,
    status,
    hold_expires_at,
    guest_count,
    customer_name,
    customer_email,
    customer_phone
  )
  values (
    v_agent_id,
    p_sailing_id,
    'draft',
    v_expires_at,
    cardinality(p_seat_ids),
    p_customer_name,
    p_customer_email,
    p_customer_phone
  )
  returning * into v_booking;

  insert into public.seat_reservations (
    sailing_id,
    seat_id,
    booking_id,
    status,
    hold_token,
    expires_at
  )
  select
    p_sailing_id,
    x.seat_id,
    v_booking.id,
    'held'::public.reservation_status,
    v_booking.hold_token,
    v_expires_at
  from unnest(p_seat_ids) as x(seat_id);

  return query select v_booking.id, v_booking.booking_reference, v_booking.hold_token, v_expires_at;
exception
  when unique_violation then
    raise exception 'One or more seats are no longer available';
end;
$$;

create or replace function public.release_booking_hold(p_booking_id uuid, p_hold_token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.seat_reservations
  set status = 'cancelled', updated_at = now()
  where booking_id = p_booking_id
    and hold_token = p_hold_token
    and status = 'held';

  update public.bookings
  set status = 'cancelled', cancelled_at = now(), updated_at = now()
  where id = p_booking_id
    and hold_token = p_hold_token
    and status in ('draft', 'awaiting_payment');
end;
$$;

create or replace function public.confirm_paid_booking(
  p_booking_id uuid,
  p_provider_payment_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext(p_booking_id::text));

  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.status = 'paid' then
    return;
  end if;

  if v_booking.hold_expires_at <= now() then
    raise exception 'Booking hold has expired';
  end if;

  update public.bookings
  set status = 'paid', confirmed_at = now(), updated_at = now()
  where id = p_booking_id;

  update public.seat_reservations
  set status = 'confirmed', confirmed_at = now(), updated_at = now()
  where booking_id = p_booking_id
    and status = 'held';

  update public.payments
  set status = 'captured', provider_payment_id = coalesce(provider_payment_id, p_provider_payment_id), updated_at = now()
  where booking_id = p_booking_id
    and provider_payment_id is null;
end;
$$;

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.vessels enable row level security;
alter table public.seats enable row level security;
alter table public.cruise_products enable row level security;
alter table public.gallery_assets enable row level security;
alter table public.cruise_routes enable row level security;
alter table public.sailings enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.bookings enable row level security;
alter table public.seat_reservations enable row level security;
alter table public.seat_inventory enable row level security;
alter table public.booking_guests enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.tickets enable row level security;
alter table public.agent_commissions enable row level security;
alter table public.group_enquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.content_pages enable row level security;
alter table public.notification_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.analytics_events enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profiles own update" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "public read published cruises" on public.cruise_products for select using (status = 'published' or public.is_staff());
create policy "public read published gallery" on public.gallery_assets for select using (status = 'published' or public.is_staff());
create policy "public read published testimonials" on public.testimonials for select using (status = 'published' or public.is_staff());
create policy "public read published content pages" on public.content_pages for select using (status = 'published' or public.is_staff());
create policy "public read cruise routes" on public.cruise_routes for select using (
  public.is_staff()
  or exists (
    select 1 from public.cruise_products c
    where c.id = cruise_routes.cruise_id
      and c.status = 'published'
  )
);
create policy "public read active vessels" on public.vessels for select using (status = 'published' or public.is_staff());
create policy "public read active seats" on public.seats for select using (is_active = true or public.is_staff());
create policy "public read bookable sailings" on public.sailings for select using (status in ('scheduled', 'boarding') or public.is_staff());
create policy "public read active pricing" on public.pricing_tiers for select using (is_active = true or public.is_staff());
create policy "public read seat inventory" on public.seat_inventory for select using (true);

create policy "staff manage vessels" on public.vessels for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage seats" on public.seats for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage cruises" on public.cruise_products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage gallery" on public.gallery_assets for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage routes" on public.cruise_routes for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage sailings" on public.sailings for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage pricing" on public.pricing_tiers for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage testimonials" on public.testimonials for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage content pages" on public.content_pages for all using (public.is_staff()) with check (public.is_staff());

create policy "agents own read" on public.agents for select using (profile_id = auth.uid() or public.is_staff());
create policy "agents register own" on public.agents for insert with check (profile_id = auth.uid());
create policy "staff manage agents" on public.agents for all using (public.is_staff()) with check (public.is_staff());

create policy "staff read bookings" on public.bookings for select using (public.is_staff());
create policy "customers read own bookings" on public.bookings for select using (profile_id = auth.uid());
create policy "agents read attributed bookings" on public.bookings for select using (
  exists (
    select 1 from public.agents a
    where a.id = bookings.agent_id
      and a.profile_id = auth.uid()
  )
);
create policy "staff manage bookings" on public.bookings for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage reservations" on public.seat_reservations for all using (public.is_staff()) with check (public.is_staff());
create policy "staff read guests" on public.booking_guests for select using (public.is_staff());
create policy "customers read own guests" on public.booking_guests for select using (
  exists (select 1 from public.bookings b where b.id = booking_guests.booking_id and b.profile_id = auth.uid())
);
create policy "staff manage guests" on public.booking_guests for all using (public.is_staff()) with check (public.is_staff());

create policy "staff read payments" on public.payments for select using (public.is_staff());
create policy "staff manage payments" on public.payments for all using (public.is_staff()) with check (public.is_staff());
create policy "staff read payment events" on public.payment_events for select using (public.is_staff());
create policy "staff manage payment events" on public.payment_events for all using (public.is_staff()) with check (public.is_staff());

create policy "staff read tickets" on public.tickets for select using (public.is_staff());
create policy "customers read own tickets" on public.tickets for select using (
  exists (select 1 from public.bookings b where b.id = tickets.booking_id and b.profile_id = auth.uid())
);
create policy "staff manage tickets" on public.tickets for all using (public.is_staff()) with check (public.is_staff());

create policy "agents read own commissions" on public.agent_commissions for select using (
  exists (select 1 from public.agents a where a.id = agent_commissions.agent_id and a.profile_id = auth.uid())
  or public.is_staff()
);
create policy "staff manage commissions" on public.agent_commissions for all using (public.is_staff()) with check (public.is_staff());

create policy "public insert group enquiries" on public.group_enquiries for insert with check (true);
create policy "staff manage group enquiries" on public.group_enquiries for all using (public.is_staff()) with check (public.is_staff());

create policy "staff read notifications" on public.notification_events for select using (public.is_staff());
create policy "staff manage notifications" on public.notification_events for all using (public.is_staff()) with check (public.is_staff());
create policy "staff read audit logs" on public.audit_logs for select using (public.is_staff());
create policy "staff insert audit logs" on public.audit_logs for insert with check (public.is_staff());
create policy "analytics insert events" on public.analytics_events for insert with check (true);
create policy "staff read analytics" on public.analytics_events for select using (public.is_staff());

alter table public.seat_inventory replica identity full;
alter table public.sailings replica identity full;
alter table public.bookings replica identity full;

alter publication supabase_realtime add table public.seat_inventory;
alter publication supabase_realtime add table public.sailings;
alter publication supabase_realtime add table public.bookings;

revoke execute on function public.expire_stale_holds() from public, anon, authenticated;
revoke execute on function public.confirm_paid_booking(uuid, text) from public, anon, authenticated;
revoke execute on function public.create_seat_hold(uuid, uuid[], text, citext, text, text) from public;
revoke execute on function public.release_booking_hold(uuid, uuid) from public;
grant execute on function public.create_seat_hold(uuid, uuid[], text, citext, text, text) to anon, authenticated;
grant execute on function public.release_booking_hold(uuid, uuid) to anon, authenticated;
grant execute on function public.expire_stale_holds() to service_role;
grant execute on function public.confirm_paid_booking(uuid, text) to service_role;
