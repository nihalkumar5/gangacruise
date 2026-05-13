# Production Readiness Checklist

## Current Build Scope

The repository now contains a complete premium web app shell:

- Cinematic homepage with hero, cruise storytelling, gallery, testimonials, CTA, and footer.
- Cruise listing and detail pages.
- Booking selection, seat hold UI, guest capture, mocked checkout, and QR-style ticket confirmation.
- Agent registration surface.
- Admin dashboard surface for realtime operations, revenue, bookings, and controls.
- API contracts for availability, seat holds, releases, order creation, and Razorpay webhook handling.
- Supabase/PostgreSQL schema blueprint and migration.
- Provider adapters for Razorpay and notification services.

## Required Production Wiring

- Replace mocked provider adapters in `src/lib/providers` with live Razorpay and Resend calls.
- Move seat locking from client state into the Supabase RPC described in `supabase/migrations/0001_initial_schema.sql`.
- Enable Supabase Realtime publications for sailings, bookings, and seat holds.
- Add authenticated admin and agent role gates before exposing operational data.
- Replace the CSS QR placeholder with `qrcode` output generated from signed ticket tokens.
- Connect Cloudinary upload and image delivery for cruise galleries.

## Security Checklist

- Enforce RLS on every Supabase table.
- Never trust selected seats from the client; re-check availability inside a transaction.
- Verify Razorpay webhooks with `RAZORPAY_WEBHOOK_SECRET`.
- Confirm bookings idempotently by payment id.
- Rate-limit hold, order, and webhook endpoints.
- Validate all API payloads with Zod or equivalent schema validation.
- Keep service-role Supabase keys server-only.
- Use signed ticket tokens for QR validation.

## Performance Checklist

- Keep hero media optimized and served through Next/Image or Cloudinary.
- Lazy-load below-the-fold imagery and admin-only client bundles.
- Respect `prefers-reduced-motion`.
- Avoid animation on layout-changing properties where possible.
- Use route-level loading states for booking and admin pages.
- Cache public availability reads with short revalidation once connected to Supabase.

## Deployment Plan

- Configure Vercel environment variables from `.env.example`.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` in CI.
- Apply Supabase migrations before promoting production.
- Add Vercel Analytics or equivalent monitoring.
- Configure uptime checks for `/api/availability`.
- Add error tracking before real payments go live.
