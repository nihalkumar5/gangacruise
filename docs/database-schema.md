# GangaCruise Database Schema

This schema is designed for Supabase/Postgres with transaction-safe booking, realtime seat updates, Razorpay payment verification, admin operations, and agent attribution.

Implementation migration: [`supabase/migrations/0001_initial_schema.sql`](../supabase/migrations/0001_initial_schema.sql)

## Domain Modules

### Identity and Access

- `profiles`: Supabase auth user profile and application role.
- `agents`: agent application, approval, referral code, and commission rate.
- Role model: `customer`, `agent`, `staff`, `admin`.
- RLS helpers: `current_app_role()`, `is_staff()`, `is_admin()`.
- Role escalation is blocked by trigger unless the actor is admin or service-role infrastructure.

### Cruise Catalog

- `cruise_products`: public cruise products, editorial content, SEO, inclusions, highlights.
- `cruise_routes`: ordered route/story points for ghats and itinerary storytelling.
- `gallery_assets`: Cloudinary-backed image/video/poster assets.
- `testimonials`: moderated public testimonials.
- `content_pages`: legal and editorial pages.

### Inventory

- `vessels`: boats with capacity and deck metadata.
- `seats`: physical seats on a vessel, with category, accessibility, deck, and map coordinates.
- `sailings`: scheduled cruise instances for a vessel and cruise product.
- `pricing_tiers`: default and sailing-specific pricing by category or guest range.

### Booking

- `bookings`: customer booking shell, hold token, status, totals, customer contact, agent attribution.
- `seat_reservations`: private source of truth for held, confirmed, expired, cancelled, and blocked seats.
- `seat_inventory`: public-safe realtime projection of seat state only.
- `booking_guests`: passenger details and optional assigned seat.
- `tickets`: QR ticket metadata using a stored hash, not a raw QR token.

### Payments and Notifications

- `payments`: Razorpay order/payment state, signature, amount, and raw payload.
- `payment_events`: idempotency table for webhook event processing.
- `notification_events`: email/WhatsApp/SMS delivery queue, retries, provider ids, and failures.

### Operations

- `group_enquiries`: private or group event lead capture.
- `agent_commissions`: booking-linked commission ledger.
- `audit_logs`: staff/admin mutation history.
- `analytics_events`: funnel and behavior events.

## Critical Constraints

- `seat_reservations_active_unique_idx` prevents more than one active reservation for the same `sailing_id + seat_id` when status is `held`, `confirmed`, or `blocked`.
- `bookings_idempotency_key_idx` prevents duplicate booking creation from retrying clients.
- `payments.provider_order_id` and `payments.provider_payment_id` are unique for payment idempotency.
- `payment_events.provider_event_id` is unique so Razorpay webhooks can be replayed safely.
- `tickets.qr_token_hash` is unique and stores no raw QR secret.
- Booking totals are checked so `total = subtotal + tax + fee - discount`.
- Held seats require `booking_id`, `hold_token`, and `expires_at`.
- Confirmed reservations require a `booking_id`.
- Blocked seats require a reason.

## Transactional Booking Flow

1. Client calls `create_seat_hold(...)`.
2. Function takes an advisory transaction lock per sailing.
3. Function expires stale holds.
4. Function validates sailing, vessel, and active seats.
5. Function creates a draft booking with a 10-minute hold.
6. Function inserts held `seat_reservations`.
7. Partial unique index rejects race-condition double holds.
8. Trigger updates `seat_inventory`.
9. Client creates a Razorpay order from server code.
10. Webhook verifies signature and idempotency.
11. Server calls `confirm_paid_booking(...)`.
12. Reservations become `confirmed`; booking becomes `paid`; ticket is issued by app service.

## Realtime Architecture

Realtime should never expose sensitive booking or customer data.

Published tables:

- `seat_inventory`: public seat state projection for live seat maps.
- `sailings`: public/admin live sailing status changes.
- `bookings`: admin dashboard updates only through RLS-filtered subscriptions.

Recommended client channels:

- Public seat map: `seat_inventory:sailing_id=eq.<id>`
- Cruise listing availability: `sailings:starts_at` filters plus server queries.
- Admin operations: `bookings`, `sailings`, `seat_inventory`.

`seat_reservations` stays private and is not published. It contains internal booking references and hold data.

## Expiry Model

- Holds expire after 10 minutes.
- `expire_stale_holds()` marks expired reservations and draft/awaiting-payment bookings as expired.
- It is called inside `create_seat_hold(...)` and should also run on a scheduled job every minute.
- Any update to `seat_reservations` recomputes `seat_inventory`, so clients see seats become available again.

## RLS Model

- Public users can read published catalog content, active seats, bookable sailings, active pricing, and public-safe seat inventory.
- Customers can read their own profile, bookings, guests, and tickets when authenticated.
- Agents can read their own agent record, attributed bookings, and commissions.
- Staff/admin can manage catalog, inventory, bookings, payments, tickets, commissions, media, and content.
- Anonymous users can submit group enquiries and create booking holds through the RPC only.
- Payment confirmation and hold expiry functions are not executable by anon/authenticated users.

## Application Responsibilities

The database owns consistency. The app still owns:

- Zod validation before RPC calls.
- Razorpay signature verification before payment confirmation.
- Price calculation before payment order creation.
- Ticket QR token generation and hashing.
- Resend and WhatsApp notification dispatch.
- Audit-log insertion for staff/admin mutations.
- Rate limiting around hold, payment, enquiry, and auth endpoints.
