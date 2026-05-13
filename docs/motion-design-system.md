# GangaCruise Cinematic Luxury Motion Design System

This document defines the production motion language for GangaCruise. It is designed for Next.js 15 App Router with Framer Motion for UI choreography and GSAP ScrollTrigger for cinematic scroll scenes.

Motion should feel like a private river voyage: calm, precise, atmospheric, and expensive. Nothing should bounce, wiggle, spin gratuitously, or feel like a generic template animation.

## Motion Philosophy

### Brand Feeling

The motion language should express:

- Stillness before movement.
- Slow reveal instead of loud entrance.
- Weight, polish, and restraint.
- River-like continuity between sections.
- Haptic confidence in booking and payment states.
- Editorial pacing for storytelling pages.
- Operational clarity in admin and agent surfaces.

### Motion Keywords

- Cinematic
- Slow burn
- Tidal
- Glass
- Ember
- Ritual
- Precision
- Weightless but grounded

### Anti-Patterns

Avoid:

- Bouncy spring defaults.
- Cartoon easing.
- Continuous attention-seeking loops.
- Excessive particle density.
- Large blur filters on scrolling containers.
- Animating `top`, `left`, `width`, `height`, `box-shadow`, or layout-affecting properties.
- Animations that delay booking completion.
- Repeating the same fade-up on every element without hierarchy.
- Parallax that fights readability.

## Library Responsibilities

### Framer Motion

Use Framer Motion for:

- Page transitions.
- Section reveals.
- Staggered text and card reveals.
- Hover/tap microinteractions.
- Mobile drawer/menu choreography.
- Booking flow transitions.
- Payment and ticket state transitions.
- Admin/agent UI state transitions.
- Accessible reduced-motion variants.

### GSAP and ScrollTrigger

Use GSAP for:

- Hero image scale and cinematic scroll scenes.
- Parallax media layers.
- Scroll-pinned storytelling chapters.
- Gallery rail movement.
- Timeline-controlled atmospheric gradients.
- Cross-section scroll progress effects.

GSAP should be client-only and dynamically loaded. Use `gsap.context()` for cleanup and `ScrollTrigger.matchMedia()` for responsive behavior.

## Motion File Architecture

```txt
src/design/
  motion.ts
  motion-presets.ts

src/components/luxury/
  route-transition.tsx
  reveal.tsx
  stagger.tsx
  motion-heading.tsx
  parallax-media.tsx
  scroll-chapter.tsx
  magnetic.tsx
  animated-counter.tsx
  ambient-background.tsx

src/hooks/
  use-prefers-reduced-motion.ts
  use-gsap.ts
  use-scroll-progress.ts
  use-reduced-gsap.ts

src/features/booking/components/
  hold-timer-motion.tsx
  seat-state-motion.tsx
  booking-stage-transition.tsx
  payment-status-motion.tsx

src/features/marketing/components/
  hero-scroll-scene.tsx
  story-scroll-scene.tsx
  gallery-rail-motion.tsx
```

## Motion Tokens

Motion tokens should live in `src/design/motion.ts`.

```ts
export const motionDurations = {
  instant: 0.12,
  fast: 0.22,
  base: 0.42,
  slow: 0.72,
  cinematic: 1.15,
  chapter: 1.6,
} as const

export const motionEasings = {
  silk: [0.16, 1, 0.3, 1],
  river: [0.22, 1, 0.36, 1],
  glass: [0.32, 0.72, 0, 1],
  ember: [0.2, 0.8, 0.2, 1],
  entrance: [0.19, 1, 0.22, 1],
  exit: [0.7, 0, 0.84, 0],
} as const

export const motionSprings = {
  soft: { type: "spring", stiffness: 120, damping: 24, mass: 0.9 },
  weighted: { type: "spring", stiffness: 90, damping: 28, mass: 1.2 },
  precise: { type: "spring", stiffness: 260, damping: 32, mass: 0.8 },
  magnetic: { type: "spring", stiffness: 180, damping: 20, mass: 0.6 },
} as const

export const motionStaggers = {
  tight: 0.045,
  base: 0.075,
  editorial: 0.12,
  cinematic: 0.18,
} as const

export const motionDistances = {
  micro: 4,
  control: 8,
  card: 18,
  section: 48,
  hero: 72,
} as const
```

## Core Framer Motion Presets

### Page Transition

Purpose: Make route changes feel like entering the next chapter, not like a hard browser jump.

Behavior:

- Incoming page: soft opacity, vertical drift, tiny blur resolving.
- Outgoing page: short fade, no dramatic slide.
- Booking and admin routes use faster transitions than marketing pages.

```ts
export const pageTransition = {
  initial: { opacity: 0, y: 18, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: {
      duration: 0.28,
      ease: [0.7, 0, 0.84, 0],
    },
  },
}
```

Reduced motion:

- Remove `y` and `filter`.
- Keep opacity transition under `0.18s`.

### Section Reveal

Purpose: Reveal content with expensive restraint.

```ts
export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 48,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
```

Usage:

- Use once per section container.
- Do not attach to every child unless hierarchy requires it.
- Use `viewport={{ once: true, margin: "-12% 0px" }}`.

### Stagger Group

Purpose: Reveal groups with editorial pacing.

```ts
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
}

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
```

### Text Reveal

Purpose: Make headings feel typeset and cinematic.

Rules:

- Split by lines for hero headings.
- Split by words for short labels only.
- Avoid character-by-character animation for body copy.
- Body text should fade in after the heading, not perform elaborate choreography.

```ts
export const headingLineReveal = {
  hidden: {
    y: "110%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.92,
      ease: [0.19, 1, 0.22, 1],
    },
  },
}
```

Implementation note:

- Wrap each line in an overflow-hidden mask.
- Never mask text in a way that clips descenders at rest.

### Luxury Button

Purpose: Make CTAs feel tactile without feeling playful.

States:

- Hover: slight inward pressure and inner icon drift.
- Tap: small scale down.
- Disabled: no motion, reduced opacity.
- Loading: slow shimmer or progress trace, not a spinner explosion.

```ts
export const luxuryButtonMotion = {
  rest: { scale: 1 },
  hover: {
    scale: 0.985,
    transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.12 },
  },
}

export const luxuryButtonIconMotion = {
  rest: { x: 0, y: 0, scale: 1 },
  hover: {
    x: 3,
    y: -1,
    scale: 1.06,
    transition: { type: "spring", stiffness: 180, damping: 20, mass: 0.6 },
  },
}
```

### Glass Panel

Purpose: Add premium depth with subtle physicality.

Motion:

- Entry: opacity + y + very slight scale from `0.985`.
- Hover: translate up `-3px`; never rotate operational cards.
- Press: settle down `1px`.
- Active/selected: faint glow trace and border luminance.

```ts
export const glassPanelMotion = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    y: -3,
    transition: { duration: 0.36, ease: [0.32, 0.72, 0, 1] },
  },
}
```

## GSAP Scroll System

### GSAP Loading Rule

GSAP must be loaded only in client components.

```ts
useEffect(() => {
  let ctx: gsap.Context | undefined

  async function run() {
    const gsapModule = await import("gsap")
    const scrollTriggerModule = await import("gsap/ScrollTrigger")
    const gsap = gsapModule.gsap
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger

    gsap.registerPlugin(ScrollTrigger)

    ctx = gsap.context(() => {
      // animations
    }, rootRef)
  }

  run()

  return () => ctx?.revert()
}, [])
```

### ScrollTrigger Defaults

```ts
const scrollDefaults = {
  scrub: 0.8,
  ease: "none",
  invalidateOnRefresh: true,
}
```

Use:

- `scrub: 0.6-1.2` for cinematic media.
- `scrub: true` only for direct scroll-coupled values.
- `pin` sparingly.
- `markers: false` always in production.

### Responsive ScrollTrigger

Use `matchMedia`:

```ts
ScrollTrigger.matchMedia({
  "(min-width: 1024px)": () => {
    // full cinematic scenes
  },
  "(max-width: 1023px)": () => {
    // lighter transform-only movement
  },
})
```

Mobile rules:

- Avoid pinned chapters on small screens.
- Reduce image scale deltas.
- Avoid horizontal scroll hijacking.
- Keep booking UI stable.

## Cinematic Scene Recipes

### Hero Dawn Scene

Use on homepage and cruise detail heroes.

Elements:

- Background river/ghat media.
- Foreground soft gradient layer.
- Hero heading.
- Availability dock.
- Navigation.

Choreography:

1. Background media starts at `scale: 1.08`.
2. Heading lines reveal after `180ms`.
3. Body copy fades after heading.
4. Availability dock rises last with glass-panel reveal.
5. On scroll, media scales from `1.08` to `1.0`, foreground haze drifts slightly, text fades out by `35%` progress.

GSAP:

```ts
gsap.timeline({
  scrollTrigger: {
    trigger: hero,
    start: "top top",
    end: "bottom top",
    scrub: 0.9,
  },
})
.to(media, { scale: 1, yPercent: 8 }, 0)
.to(haze, { yPercent: 18, opacity: 0.55 }, 0)
.to(copy, { yPercent: -18, opacity: 0 }, 0)
```

### Story Chapter Scene

Use for editorial river/cruise storytelling sections.

Elements:

- Fixed or semi-pinned media frame on desktop.
- Text chapters scrolling beside it.
- Subtle progress line.

Choreography:

- Each chapter changes media opacity and scale.
- Text reveals as the media reaches visual focus.
- Progress line fills using scaleX.

Rules:

- Desktop only for pinned behavior.
- Mobile becomes stacked chapters with Framer reveals.
- Do not animate large blur during scroll.

### Gallery Rail Scene

Use on homepage and gallery prelude.

Choreography:

- Horizontal rail moves gently with vertical scroll on desktop.
- Images scale from `0.96` to `1` as they enter center.
- Hover opens subtle media inspection state.

Rules:

- Use transform-based movement.
- Keep native scroll for gallery page filtering.
- Use lightbox for intentional image inspection.

### Availability Dock Entrance

Use in hero and booking search pages.

Choreography:

- Dock enters after hero copy.
- Fields reveal in a tight stagger.
- Active field gets a gold hairline trace.
- Search action has magnetic button motion.

Rules:

- Never delay field usability for animation.
- On mobile, dock should feel like a bottom sheet, not a floating desktop card compressed into a phone.

## Booking Motion System

Booking motion must prioritize trust. It should be premium, but never theatrical enough to make payment feel uncertain.

### Booking Stage Transition

Stages:

1. Sailing selection.
2. Seat selection.
3. Guest details.
4. Checkout.
5. Confirmation.

Motion:

- Forward: current stage fades left slightly, next stage enters from right with low distance.
- Back: reverse direction.
- Preserve scroll position intentionally.
- Use `AnimatePresence mode="wait"` only when it does not create frustrating pauses.

```ts
export const bookingStageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -18 : 18,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] },
  }),
}
```

### Seat State Motion

Seat states:

- Available.
- Hovered.
- Selected.
- Held by current booking.
- Held by another customer.
- Confirmed.
- Blocked.

Motion:

- Available to selected: soft scale `1 -> 1.08 -> 1`.
- Realtime held by another customer: fade to disabled state, no jump.
- Confirmed: settle into final dark/gold state.
- Blocked: no pulse; operationally quiet.

Accessibility:

- Seat buttons require text labels.
- Realtime updates should not steal focus.
- Announce selected seat count in a polite live region.

### Hold Timer

Motion:

- Progress ring or bar scales with time.
- Above 2 minutes: calm gold.
- Under 2 minutes: warmer ember.
- Under 30 seconds: gentle pulse, not alarm.
- Expired: clear transition to expired state with action to restart.

Rules:

- Timer must update text once per second.
- Progress animation should not drift from real expiry time.
- Avoid red panic states until actual failure.

### Payment State

States:

- Ready.
- Opening Razorpay.
- Processing.
- Verified.
- Failed.
- Expired.

Motion:

- Processing: restrained progress trace.
- Verified: one confident completion sweep, QR reveal.
- Failed: calm error panel, no shake.
- Expired: fade booking summary into recovery action.

## Navigation Motion

### Floating Luxury Nav

Behavior:

- Starts transparent over hero.
- Gains glass opacity after first scroll threshold.
- Condenses slightly on scroll down.
- Expands on scroll up.
- Mobile opens full-screen glass menu.

Motion:

- Nav shell uses Framer layout animation.
- Mobile links reveal with stagger.
- Hamburger morphs into a precise X.

Rules:

- Nav remains keyboard accessible.
- Do not use aggressive sticky top bars.
- Backdrop blur only on fixed nav and overlays.

## Card and Media Motion

### Cruise Card

Default:

- Media frame static.
- Text clear and readable.

Hover:

- Image scale `1 -> 1.045`.
- Overlay opacity increases subtly.
- CTA icon moves `3px`.
- Card lifts `-4px`.

Reduced motion:

- Remove image scale.
- Keep color/opacity change.

### Media Frame

Entrance:

- Image appears through mask reveal.
- Optional scale settles from `1.04` to `1`.

Hover:

- Use small scale only.
- Do not animate crop in a way that hides useful visual detail.

### Testimonial

Motion:

- Desktop: staggered reveal only.
- Mobile: gentle carousel if needed.
- Avoid auto-advancing text too quickly.

## Admin and Agent Motion

Admin and agent interfaces should feel premium but operational.

Use:

- Short opacity/transform reveals.
- Smooth table row insertion/removal.
- Sheet/dialog transitions through shadcn primitives.
- Chart draw-in after data loads.
- Command menu fade/scale.

Avoid:

- Cinematic scroll effects.
- Heavy parallax.
- Slow route transitions.
- Decorative particles.
- Excessive hover motion on dense tables.

Admin timings:

- Route transition: `0.18-0.28s`.
- Sheet transition: `0.22-0.32s`.
- Table row reveal: `0.18s`.
- Chart reveal: `0.5-0.7s`.

## Ambient Effects

Ambient effects must be subtle and inexpensive.

Allowed:

- Fixed noise overlay at very low opacity.
- Slow radial gradient movement with CSS transform.
- Tiny particle field only on public hero, capped and disabled on reduced motion.
- Gold highlight trace on selected/active UI.

Not allowed:

- Dense particles over the whole site.
- Large animated blur layers in scroll containers.
- Canvas effects on booking checkout.
- Effects that reduce text contrast.

### Ambient Background Motion

Use CSS keyframes or Framer Motion on fixed elements:

```ts
export const ambientDrift = {
  animate: {
    x: [0, 18, -12, 0],
    y: [0, -12, 10, 0],
    opacity: [0.55, 0.72, 0.48, 0.55],
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: "linear",
    },
  },
}
```

Exception:

- Linear is acceptable only for invisible ambient loops where constant velocity prevents noticeable easing artifacts. Do not use linear for visible UI transitions.

## Page Choreography

### Homepage

1. Hero media preloads and enters already alive.
2. Nav floats in softly.
3. H1 lines reveal.
4. Supporting copy appears.
5. Availability dock enters last.
6. Scroll moves hero media and haze.
7. Featured cruises reveal with stagger.
8. Story chapters use GSAP on desktop and Framer reveals on mobile.
9. Gallery rail moves slowly with scroll.
10. Group booking CTA lands calmly, no aggressive sales motion.

### Cruise Listing

1. Header enters with compact reveal.
2. Filters appear as stable controls.
3. Cruise cards stagger in.
4. Filter changes crossfade card results.
5. Empty state fades in with clear recovery action.

### Cruise Detail

1. Hero media scales down with scroll.
2. Essentials bar settles into sticky context.
3. Itinerary timeline reveals by chapter.
4. Sailing selector uses immediate interaction with soft selected state.
5. Sticky booking panel should not jump on viewport changes.

### Booking Flow

1. Booking shell appears quickly.
2. Seat map loads with skeleton, then seats reveal by deck/row.
3. Selected seats update summary with layout animation.
4. Hold timer starts without fanfare.
5. Checkout transition is short and reassuring.
6. Payment confirmation reveals QR ticket with one confident sweep.

### Admin

1. Shell loads instantly.
2. Metrics fade in.
3. Tables render stable rows.
4. Sheets/dialogs use standard shadcn transitions with premium timing.
5. Realtime updates highlight rows briefly, then settle.

## Component Contracts

### `Reveal`

Props:

- `children`
- `delay`
- `duration`
- `distance`
- `once`
- `as`

Responsibilities:

- Uses Framer Motion.
- Reads reduced motion.
- Applies default section reveal.
- Does not impose layout styles.

### `Stagger`

Props:

- `children`
- `stagger`
- `delay`
- `itemVariant`

Responsibilities:

- Reveals child groups.
- Keeps animation hierarchy centralized.
- Does not wrap every tiny text node unnecessarily.

### `MotionHeading`

Props:

- `children`
- `level`
- `split`
- `delay`

Responsibilities:

- Masks line or word reveals.
- Preserves semantic heading level.
- Avoids character animation by default.

### `ParallaxMedia`

Props:

- `src`
- `alt`
- `speed`
- `scaleRange`
- `priority`
- `desktopOnly`

Responsibilities:

- Uses GSAP ScrollTrigger client-side.
- Falls back to static media on reduced motion/mobile.
- Cleans up animations on unmount.

### `ScrollChapter`

Props:

- `chapters`
- `media`
- `pin`
- `progress`

Responsibilities:

- Builds cinematic editorial sections.
- Uses GSAP only on desktop.
- Falls back to stacked Framer reveals on mobile.

### `Magnetic`

Props:

- `children`
- `strength`
- `disabled`

Responsibilities:

- Adds pointer-follow micro motion for premium CTAs.
- Must disable on touch devices and reduced motion.
- Movement must be subtle.

## Framer Motion Provider

Use a provider around the app to centralize reduced-motion behavior.

```tsx
<MotionConfig
  reducedMotion="user"
  transition={{
    duration: 0.42,
    ease: [0.16, 1, 0.3, 1],
  }}
>
  {children}
</MotionConfig>
```

Use `LazyMotion` if bundle size becomes a concern:

```tsx
const loadFeatures = () => import("./framer-features").then((res) => res.default)
```

## Performance Rules

- Animate only `transform`, `opacity`, and small controlled filter reveals.
- Do not animate layout dimensions.
- Do not run GSAP on the server.
- Use `gsap.context()` and cleanup.
- Use `ScrollTrigger.matchMedia()`.
- Disable heavy scenes for reduced motion.
- Reduce or remove pinned scroll scenes on mobile.
- Do not animate hundreds of DOM nodes.
- Virtualize long admin tables.
- Prefer CSS transitions for simple hover states.
- Do not block route transitions waiting for non-critical animations.

## Accessibility Rules

- Respect `prefers-reduced-motion`.
- Do not convey important state by animation alone.
- Provide text labels for seat state changes.
- Use polite live regions for hold expiry and selected seat count.
- Keep focus visible during animated transitions.
- Do not move focused elements unexpectedly.
- Ensure drawers/dialogs trap focus through accessible primitives.
- Keep contrast stable during overlays and animated gradients.

## Reduced Motion Specification

When reduced motion is active:

- Replace parallax with static images.
- Replace scroll-pinned scenes with normal stacked content.
- Remove blur reveals.
- Keep short opacity transitions under `0.18s`.
- Disable particles and ambient drift.
- Disable magnetic pointer movement.
- Keep booking and payment state changes clear with text and color.

## QA Checklist

### Visual Motion QA

- Page transitions feel calm and expensive.
- Hero animation does not obscure text.
- Section reveals are not repetitive or excessive.
- Hover states feel tactile but not playful.
- Booking state changes feel trustworthy.
- Admin remains fast and operational.

### Performance QA

- No animation causes layout shift.
- No large scroll container has animated backdrop blur.
- GSAP scenes clean up after route changes.
- Mobile scroll remains smooth.
- Lighthouse performance is not materially harmed by motion.
- Chrome Performance trace shows no avoidable layout thrashing.

### Accessibility QA

- Reduced-motion mode is respected.
- Keyboard focus remains stable.
- Seat updates are understandable without motion.
- Payment success/failure is announced through visible text.
- Text contrast remains readable throughout animation.

## Implementation Priority

1. Add `src/design/motion.ts` tokens.
2. Add `MotionConfigProvider`.
3. Build `Reveal`, `Stagger`, `MotionHeading`, and `RouteTransition`.
4. Build `LuxuryButton` and `GlassPanel` motion states.
5. Build `ParallaxMedia` and GSAP hook.
6. Build homepage hero motion.
7. Build booking motion states.
8. Build admin reduced motion layer.
9. Add reduced-motion QA.
10. Tune timings after real browser testing.

## Final Standard

The platform should not feel animated for decoration. It should feel composed, responsive, and alive. Motion exists to reveal hierarchy, deepen atmosphere, reassure during transactions, and make the cruise experience feel cinematic before the user ever steps onto the boat.
