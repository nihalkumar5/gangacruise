# GangaCruise Frontend Page Hierarchy and Component Architecture

This document defines the production frontend architecture for the GangaCruise luxury booking platform. It assumes Next.js 15 App Router, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, GSAP, Supabase, Razorpay, Resend, Cloudinary, and Vercel.

The frontend should feel cinematic and luxurious, but the implementation must stay operationally clean: thin route files, reusable premium primitives, feature-owned business UI, server-first data access, and isolated client islands for motion, realtime, forms, and payment.

## Architecture Principles

- `app/` owns routing, layouts, metadata, loading, errors, and page composition.
- `features/` owns product domains: cruises, availability, booking, payments, notifications, admin, agents, analytics.
- `components/ui/` is only shadcn/ui source components.
- `components/luxury/` owns bespoke visual primitives used across the public experience.
- `components/layout/` owns shells, navigation, footers, and route-frame components.
- `components/shared/` owns generic app primitives that are not visually opinionated.
- Route components should fetch data server-side where possible and pass typed props into feature components.
- Client components should be small, purposeful islands for interactivity, animation, realtime updates, forms, and checkout.
- Motion must be elegant, transform/opacity-based, and reduced when `prefers-reduced-motion` is active.

## Route Groups and Page Hierarchy

```txt
src/app/
  layout.tsx
  template.tsx
  global-error.tsx
  not-found.tsx
  sitemap.ts
  robots.ts

  (site)/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx

    cruises/
      page.tsx
      loading.tsx
      error.tsx
      [slug]/
        page.tsx
        loading.tsx
        error.tsx

    gallery/
      page.tsx
      loading.tsx

    testimonials/
      page.tsx
      loading.tsx

    group-booking/
      page.tsx
      loading.tsx

    agents/
      page.tsx

    legal/
      layout.tsx
      terms/
        page.tsx
      privacy/
        page.tsx
      refunds/
        page.tsx
      cancellation/
        page.tsx

  (booking)/
    layout.tsx
    book/
      page.tsx
      loading.tsx
    book/[sailingId]/
      page.tsx
      loading.tsx
      error.tsx
    checkout/[bookingId]/
      page.tsx
      loading.tsx
      error.tsx
    payment/
      success/
        page.tsx
      failed/
        page.tsx
    ticket/[token]/
      page.tsx
      loading.tsx
      not-found.tsx

  (admin)/
    admin/
      layout.tsx
      page.tsx
      loading.tsx
      dashboard/
        page.tsx
      bookings/
        page.tsx
        [bookingId]/
          page.tsx
      cruises/
        page.tsx
        new/
          page.tsx
        [cruiseId]/
          page.tsx
      sailings/
        page.tsx
        new/
          page.tsx
        [sailingId]/
          page.tsx
      vessels/
        page.tsx
        [vesselId]/
          page.tsx
      agents/
        page.tsx
        [agentId]/
          page.tsx
      media/
        page.tsx
      testimonials/
        page.tsx
      enquiries/
        page.tsx
      analytics/
        page.tsx
      settings/
        page.tsx

  (agent)/
    agent/
      layout.tsx
      register/
        page.tsx
      dashboard/
        page.tsx
      bookings/
        page.tsx
      commissions/
        page.tsx
      profile/
        page.tsx

  api/
    availability/
      route.ts
    booking/
      hold/
        route.ts
      release/
        route.ts
      create-order/
        route.ts
    razorpay/
      webhook/
        route.ts
    tickets/
      [token]/
        route.ts
    notifications/
      route.ts
```

## Page Responsibility Matrix

| Page | Primary Components | Data Source | Client Islands |
|---|---|---|---|
| Home | `CinematicHero`, `AvailabilityDock`, `FeaturedCruiseRail`, `StoryChapter`, `GalleryPrelude`, `TestimonialReel` | cruises, gallery, testimonials, sailings | hero motion, availability form, scroll scenes |
| Cruises | `CruiseCatalogHeader`, `CruiseFilterBar`, `CruiseListingGrid`, `AvailabilitySummary` | cruise products, sailings, pricing | filters, date picker, mobile drawer |
| Cruise Detail | `CruiseDetailHero`, `ItineraryTimeline`, `VesselPreview`, `SailingSelector`, `StickyBookingPanel` | cruise, routes, gallery, sailings | sailing selector, image zoom, sticky booking panel |
| Gallery | `GalleryMosaic`, `MediaLightbox`, `GalleryFilters` | Cloudinary assets | lightbox, filters |
| Testimonials | `TestimonialWall`, `ReviewFeature`, `TrustSignals` | testimonials | animated carousel on mobile only |
| Group Booking | `GroupBookingHero`, `EventUseCases`, `GroupEnquiryForm` | static copy, enquiry action | form |
| Book | `BookingSearch`, `SailingResults`, `BookingProgress` | sailings, availability | search controls |
| Book Sailing | `SeatSelectionStage`, `SeatMap`, `HoldTimer`, `GuestDetailsForm`, `BookingSummary` | availability RPC, seat inventory realtime | realtime, forms, seat selection |
| Checkout | `CheckoutSummary`, `RazorpayCheckout`, `PaymentAssurancePanel` | booking, payment order | Razorpay script, payment state |
| Ticket | `TicketHero`, `QRCodePanel`, `GuestManifest`, `JourneyDetails` | ticket, booking, sailing | print/download controls |
| Admin Dashboard | `AdminMetricGrid`, `OccupancyChart`, `UpcomingSailings`, `RecentBookings` | admin queries | charts, realtime updates |
| Admin Bookings | `BookingsDataTable`, `BookingFilters`, `BookingDetailSheet` | bookings, payments, tickets | table state, sheet |
| Admin Cruises | `CruiseAdminTable`, `CruiseEditorForm`, `MediaPicker` | cruises, assets | forms, media picker |
| Admin Sailings | `SailingCalendar`, `SailingInventoryPanel`, `SeatBlocker` | sailings, seats, reservations | calendar, seat map |
| Agent Dashboard | `AgentMetricStrip`, `ReferralLinkCard`, `AttributedBookingsTable` | agent bookings, commissions | copy referral link |

## Layout Architecture

```txt
RootLayout
  Providers
    ThemeProvider
    AnalyticsProvider
    MotionConfigProvider
    ToastProvider
  body
    GlobalNoise
    RouteTransition
    Slot

SiteLayout
  LuxuryNav
  main
  LuxuryFooter

BookingLayout
  BookingNav
  BookingProgressShell
  main

AdminLayout
  AdminAuthGate
  AdminSidebar
  AdminTopbar
  main

AgentLayout
  AgentAuthGate
  AgentShell
  main
```

### Root Layout

- Loads global fonts and design tokens.
- Sets metadata defaults.
- Mounts `Toaster`.
- Mounts route transition wrapper.
- Adds ambient fixed noise and gradient layers.
- Does not fetch business data.

### Site Layout

- Public cinematic shell.
- Floating glass nav detached from viewport top.
- Footer with editorial/legal structure.
- Dark luxury background system.

### Booking Layout

- Reduced nav to avoid checkout distraction.
- Shows secure booking context, progress, and support affordance.
- Keeps payment and hold states visible on mobile.

### Admin Layout

- Operational, dense, restrained dashboard UI.
- Sidebar, topbar, breadcrumbs, search/command palette.
- No cinematic marketing motion.

### Agent Layout

- Similar to admin but simpler.
- Focuses on referrals, attributed bookings, and commissions.

## Component Directory Architecture

```txt
src/components/
  ui/
    accordion.tsx
    alert.tsx
    avatar.tsx
    badge.tsx
    button.tsx
    calendar.tsx
    card.tsx
    chart.tsx
    checkbox.tsx
    command.tsx
    dialog.tsx
    drawer.tsx
    dropdown-menu.tsx
    empty.tsx
    field.tsx
    input.tsx
    input-group.tsx
    pagination.tsx
    popover.tsx
    progress.tsx
    radio-group.tsx
    scroll-area.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    skeleton.tsx
    sonner.tsx
    table.tsx
    tabs.tsx
    textarea.tsx
    toggle-group.tsx
    tooltip.tsx

  luxury/
    ambient-background.tsx
    cinematic-mask.tsx
    glass-panel.tsx
    gradient-orchestrator.tsx
    luxury-button.tsx
    luxury-card.tsx
    luxury-container.tsx
    magnetic-link.tsx
    media-frame.tsx
    motion-heading.tsx
    parallax-media.tsx
    reveal.tsx
    scroll-chapter.tsx
    split-panel.tsx
    status-glow.tsx

  layout/
    luxury-nav.tsx
    mobile-menu.tsx
    luxury-footer.tsx
    booking-nav.tsx
    booking-progress-shell.tsx
    admin-sidebar.tsx
    admin-topbar.tsx
    admin-command-menu.tsx
    agent-shell.tsx

  shared/
    app-logo.tsx
    async-boundary.tsx
    cloudinary-image.tsx
    copy-button.tsx
    date-range-picker.tsx
    error-panel.tsx
    loading-state.tsx
    money.tsx
    page-header.tsx
    qr-code.tsx
    responsive-dialog.tsx
    section-header.tsx
    status-badge.tsx
```

## Feature Component Architecture

```txt
src/features/
  cruises/
    components/
      cruise-card.tsx
      cruise-catalog-header.tsx
      cruise-detail-hero.tsx
      cruise-filter-bar.tsx
      cruise-listing-grid.tsx
      itinerary-timeline.tsx
      vessel-preview.tsx
    queries.ts
    actions.ts
    schemas.ts
    types.ts

  availability/
    components/
      availability-dock.tsx
      availability-summary.tsx
      sailing-card.tsx
      sailing-selector.tsx
      seat-availability-chip.tsx
    queries.ts
    realtime.ts
    schemas.ts
    types.ts

  booking/
    components/
      booking-progress.tsx
      booking-summary.tsx
      guest-details-form.tsx
      hold-timer.tsx
      seat-button.tsx
      seat-legend.tsx
      seat-map.tsx
      seat-selection-stage.tsx
      ticket-panel.tsx
    actions.ts
    queries.ts
    hold-service.ts
    ticket-service.ts
    schemas.ts
    types.ts

  payments/
    components/
      checkout-summary.tsx
      payment-assurance-panel.tsx
      razorpay-checkout.tsx
      payment-status-view.tsx
    razorpay.ts
    verify-payment.ts
    webhook-handler.ts
    schemas.ts
    types.ts

  marketing/
    components/
      cinematic-hero.tsx
      featured-cruise-rail.tsx
      gallery-prelude.tsx
      group-booking-cta.tsx
      story-chapter.tsx
      testimonial-reel.tsx
      trust-signals.tsx

  gallery/
    components/
      gallery-filters.tsx
      gallery-mosaic.tsx
      media-lightbox.tsx
    queries.ts
    types.ts

  admin/
    components/
      admin-metric-grid.tsx
      bookings-data-table.tsx
      booking-detail-sheet.tsx
      cruise-editor-form.tsx
      media-manager.tsx
      sailing-calendar.tsx
      sailing-inventory-panel.tsx
      seat-blocker.tsx
      agent-approval-queue.tsx
    actions.ts
    queries.ts
    permissions.ts
    schemas.ts
    types.ts

  agents/
    components/
      agent-registration-form.tsx
      agent-metric-strip.tsx
      attributed-bookings-table.tsx
      commission-ledger.tsx
      referral-link-card.tsx
    actions.ts
    commission-service.ts
    queries.ts
    schemas.ts
    types.ts

  analytics/
    components/
      funnel-chart.tsx
      occupancy-chart.tsx
      revenue-chart.tsx
    events.ts
    queries.ts
    types.ts
```

## Design System Component Layers

### Layer 1: shadcn/ui Primitives

Use shadcn for accessible primitives and form/table/overlay behavior:

- Forms: `FieldGroup`, `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`, `ToggleGroup`.
- Data: `Table`, `Badge`, `Card`, `Chart`, `Pagination`.
- Feedback: `Skeleton`, `Empty`, `Alert`, `Progress`, `sonner`.
- Overlays: `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`.
- Navigation: `Tabs`, `NavigationMenu`, `Command`.

Rules:

- Do not put custom luxury components in `components/ui`.
- Do not override primitive colors ad hoc; map them to semantic tokens in global CSS.
- Forms must use shadcn field composition, not loose labels and inputs.
- Dialog, Sheet, and Drawer require accessible titles.
- Use `Skeleton` and `Empty` components instead of custom loading/empty markup.

### Layer 2: Luxury Primitives

These components encode the premium visual language.

| Component | Purpose |
|---|---|
| `LuxuryContainer` | Standard page width, section padding, responsive gutters |
| `GlassPanel` | Double-bezel glass/surface container |
| `LuxuryButton` | Premium CTA wrapper around shadcn `Button` |
| `MediaFrame` | Cloudinary image/video frame with masks, radius, shadow |
| `Reveal` | Framer Motion reveal primitive with reduced-motion handling |
| `ParallaxMedia` | GSAP/ScrollTrigger media movement, dynamically imported |
| `MotionHeading` | Editorial heading reveal with split-line support |
| `AmbientBackground` | Fixed ambient light/noise system |
| `ScrollChapter` | Storytelling section scaffold |
| `StatusGlow` | Subtle state light for availability and payment states |

### Layer 3: Feature Components

These components know domain concepts such as cruise, sailing, booking, seat, ticket, agent, and commission.

Examples:

- `CruiseCard` knows cruise imagery, duration, price teaser, and next availability.
- `SeatMap` knows vessel seats, selection state, realtime inventory state, and accessibility labels.
- `BookingSummary` knows selected sailing, seats, fees, taxes, discounts, and hold expiry.
- `BookingsDataTable` knows admin booking columns, filters, and bulk actions.

### Layer 4: Page Sections

Page sections combine feature components and luxury primitives.

Examples:

- `CinematicHero = LuxuryContainer + ParallaxMedia + MotionHeading + AvailabilityDock`
- `CruiseStorySection = ScrollChapter + MediaFrame + editorial copy`
- `SeatSelectionStage = BookingProgress + SeatMap + BookingSummary + HoldTimer`

## Server and Client Component Boundaries

### Server Components By Default

Use server components for:

- Page shells.
- Metadata generation.
- Cruise catalog fetching.
- Cruise detail fetching.
- Initial sailing availability.
- Admin table initial data.
- Ticket page fetching.
- Legal/content pages.

### Client Components Only Where Needed

Use `"use client"` for:

- Framer Motion components.
- GSAP/ScrollTrigger scenes.
- Seat map selection.
- Supabase realtime subscriptions.
- Forms with client validation/optimistic UX.
- Razorpay checkout.
- Mobile drawers and interactive filters.
- Admin tables with local sorting/filtering.
- Toast-driven mutation feedback.

### Recommended Pattern

```txt
page.tsx                    Server component
  get data from queries.ts
  render section components

feature-section.tsx          Server component when possible
  compose content

interactive-widget.tsx       Client component
  owns browser APIs, animation, realtime, local state
```

## State Management

### URL State

Use URL search params for:

- Cruise listing filters.
- Date selection.
- Guest count.
- Admin table filters.
- Pagination.

### Local State

Use local React state for:

- Seat hover and selected seats.
- Mobile menu state.
- Lightbox state.
- Active gallery filter before URL commit.

### Server State

Use server queries/actions for:

- Cruise and sailing data.
- Booking creation.
- Payment order creation.
- Admin mutations.
- Agent registration.

### Realtime State

Use Supabase Realtime for:

- `seat_inventory` by sailing id.
- Admin booking status updates.
- Sailing status changes.

Realtime should patch client state; the database remains the source of truth.

## Booking Flow Component Tree

```txt
BookingSailingPage
  BookingProgress
  SeatSelectionStage
    SailingContextPanel
    SeatMapClient
      SeatDeckTabs
      SeatSection
      SeatButton
      SeatLegend
    BookingSummaryClient
      SelectedSeatsList
      PriceBreakdown
      HoldTimer
      ContinueButton
  GuestDetailsStage
    GuestDetailsForm
    ContactDetailsForm
    BookingSummary
  CheckoutLinkPanel
```

## Checkout Component Tree

```txt
CheckoutPage
  CheckoutShell
    CheckoutSummary
      JourneyDetails
      GuestManifest
      PriceBreakdown
    PaymentAssurancePanel
    RazorpayCheckoutClient
      PaymentButton
      PaymentErrorState
      PaymentProcessingState
```

## Admin Component Tree

```txt
AdminLayout
  AdminSidebar
  AdminTopbar
  AdminCommandMenu
  AdminContentFrame

AdminDashboardPage
  AdminMetricGrid
  OccupancyChart
  RevenueChart
  UpcomingSailings
  RecentBookings
  AgentApprovalQueue

AdminBookingsPage
  PageHeader
  BookingFilters
  BookingsDataTable
  BookingDetailSheet

AdminSailingPage
  SailingEditorForm
  SailingInventoryPanel
    SeatMap
    SeatBlocker
    ReservationList
```

## Agent Component Tree

```txt
AgentDashboardPage
  AgentMetricStrip
  ReferralLinkCard
  AttributedBookingsTable
  CommissionLedger
  AgentPayoutNotice
```

## Public Site Sections

### Homepage

```txt
HomePage
  CinematicHero
    HeroMedia
    HeroCopy
    AvailabilityDock
  FeaturedCruiseRail
  StoryChapter: Dawn
  StoryChapter: Aarti
  StoryChapter: Private Celebrations
  LiveAvailabilityPreview
  GalleryPrelude
  TestimonialReel
  GroupBookingCTA
```

### Cruise Detail

```txt
CruiseDetailPage
  CruiseDetailHero
  CruiseEssentialsBar
  EditorialStoryBlock
  ItineraryTimeline
  VesselPreview
  IncludedMoments
  GalleryStrip
  SailingSelector
  StickyBookingPanel
  FAQAccordion
```

### Cruise Listing

```txt
CruiseListingPage
  CruiseCatalogHeader
  CruiseFilterBar
  AvailabilitySummary
  CruiseListingGrid
  EmptyCruiseState
```

## Page State Requirements

Every major page needs these states:

- Loading: shadcn `Skeleton` plus luxury shimmer where appropriate.
- Empty: shadcn `Empty` with domain-specific copy.
- Error: `ErrorPanel` with retry affordance.
- Unauthorized: auth-aware gate for admin and agent pages.
- Not found: cinematic but clear 404 for public pages; plain operational 404 for admin.

Booking-specific states:

- Seat available.
- Seat selected.
- Seat held by current booking.
- Seat held by someone else.
- Seat confirmed/sold.
- Seat blocked.
- Hold expired.
- Payment processing.
- Payment failed.
- Payment confirmed.

## Motion Architecture

Detailed motion standards live in [`motion-design-system.md`](./motion-design-system.md).

```txt
src/design/
  motion.ts

src/components/luxury/
  reveal.tsx
  parallax-media.tsx
  route-transition.tsx
  motion-heading.tsx

src/hooks/
  use-prefers-reduced-motion.ts
  use-gsap-scroll-trigger.ts
```

Motion rules:

- Framer Motion handles entry, hover, modal, and page transitions.
- GSAP handles scroll storytelling, parallax media, and timeline scenes.
- Animate only `transform`, `opacity`, and controlled filter reveals.
- Use reduced-motion fallbacks.
- Keep admin motion minimal and functional.
- Do not attach heavy blur to scrolling content.

## Responsive Architecture

Breakpoints:

- `xs`: 360px baseline for compact phones.
- `sm`: 640px.
- `md`: 768px.
- `lg`: 1024px.
- `xl`: 1280px.
- `2xl`: 1536px.

Rules:

- Mobile booking is the priority path.
- Avoid `h-screen`; use `min-h-[100dvh]`.
- Public cinematic sections can be expansive on desktop but must collapse to clear vertical storytelling on mobile.
- Seat map should switch from spatial layout to deck/section grouped selection if the vessel map becomes too dense.
- Booking summary becomes sticky bottom sheet on mobile and side rail on desktop.
- Admin tables use horizontal scroll, column visibility controls, and detail sheets on mobile.

## Accessibility Architecture

- Every interactive control must be keyboard accessible.
- Seat buttons need `aria-label` with seat label, category, and state.
- Realtime seat changes should update visible state without stealing focus.
- Hold expiry should use polite live region updates.
- Motion respects `prefers-reduced-motion`.
- Color contrast must pass WCAG AA.
- Dialogs, sheets, drawers, and command menus require titles.
- Forms use semantic labels, descriptions, and validation messages.
- Ticket QR page includes a text fallback ticket code.

## SEO and Metadata Components

```txt
src/features/seo/
  metadata.ts
  structured-data.tsx
  open-graph.ts
  breadcrumbs.ts
```

SEO responsibilities:

- `generateMetadata` per route.
- Structured data for `LocalBusiness`, `TouristTrip`, `Product`, `Offer`, `Review`, `FAQPage`, and `BreadcrumbList`.
- Canonical URLs.
- Cloudinary OpenGraph images.
- Crawlable public pages with server-rendered content.

## Naming Conventions

- Page-level components: `HomePage`, `CruiseDetailPage`, `AdminBookingsPage`.
- Section components: `CinematicHero`, `FeaturedCruiseRail`, `ItineraryTimeline`.
- Feature components: `SeatMap`, `BookingSummary`, `CruiseCard`.
- Client components: suffix with `Client` only when a server/client pair exists, such as `SeatMapClient`.
- Server queries: `getCruiseBySlug`, `getUpcomingSailings`, `getAdminBookings`.
- Server actions: `createBookingHoldAction`, `releaseBookingHoldAction`, `approveAgentAction`.
- Schemas: `bookingHoldSchema`, `guestDetailsSchema`, `agentRegistrationSchema`.

## Import Boundaries

Allowed:

```txt
app -> features, components, lib, design
features -> components, lib, design, types
components -> components/ui, design, hooks
lib -> types, config
```

Avoid:

```txt
components -> app
lib -> features
features/admin -> features/booking internals, except through exported services
client components -> server-only modules
```

## Implementation Order

1. Create global design tokens and base layout.
2. Add shadcn primitives.
3. Build luxury primitives.
4. Build public layout and homepage sections.
5. Build cruise listing and detail pages.
6. Build availability and booking components with mock data.
7. Connect Supabase queries and realtime.
8. Build checkout and ticket pages.
9. Build admin shell and dashboards.
10. Build agent shell and workflows.
11. Add loading, empty, error, and unauthorized states across all routes.
12. Run accessibility, responsive, performance, and visual QA.

## Completion Criteria

- Route tree implemented with loading, error, and not-found states.
- Public pages are server-rendered and SEO-ready.
- Booking flow works as a mobile-first transactional experience.
- Realtime seat updates are isolated to booking components.
- Admin and agent pages are operational rather than decorative.
- shadcn components are used for accessible primitives.
- Luxury primitives keep the visual language consistent.
- Motion is centralized, restrained, and performance-safe.
- No page owns business logic that belongs in `features/`.
