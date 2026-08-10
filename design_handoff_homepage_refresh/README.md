# Handoff: Homepage Refresh — Adaptations Denver

## Overview
Updated homepage design applying the brand's graphic flourish system (hairline rule + accent tick, stamped number badges, hazard-stripe divider) plus a custom Sisyphus illustration in the hero. Goal: bring the live staging site's homepage up to this visual bar.

## About the Design Files
`design-reference-homepage.html` is a **design reference built in HTML** — it shows exact layout, spacing, type, and color, but it is not production code to copy verbatim. **Recreate this design inside the staging site's existing codebase/framework**, using its own components, routing, and asset pipeline — don't paste this file in as-is.

## Fidelity
**High-fidelity.** Colors, type, and spacing below are final; implement pixel-close.

## Screens / Views

### Homepage
**Layout:** Single column, 1200px reference width (should go fluid/responsive in implementation — this file is not responsive). Sections stack top to bottom: nav → hero → intro/portrait → "What We Do" (3-col grid) → quote/pillars → hazard-stripe divider → CTA band → footer.

**1. Nav** — flex row, `justify-content: space-between`, padding `24px 56px`, bottom border `1px solid rgba(26,28,30,.12)`. Wordmark left (PP Monument Extended, 900, 18px, uppercase, 0.08em tracking). Right: 5 text links (Space Grotesk 600 14px) + red CTA button (`#C4472A` bg, white text, Space Grotesk 600 13px uppercase, padding `10px 20px`, no border-radius).

**2. Hero** — background `#1A1C1E` (ink), padding `90px 0 0 56px`. Left column (flex:1): eyebrow label "Therapy for men - Denver, CO" (PP Monument Wide, 13px, 0.18em tracking, uppercase, color `#C4472A`) → H1 "Talking with purpose." (PP Monument Extended 900, 52px, line-height 1.0, uppercase, paper color, max-width 760px) → body paragraph (Space Grotesk 500 17px/1.5, `rgba(247,245,242,.85)`, max-width 520px) → two buttons (primary red filled, secondary outlined 1px paper/50%). Sisyphus illustration image absolutely positioned bottom-right of the section, 480px wide, bleeding off the edge.

**3. Intro/portrait section** — padding `64px 56px`, flex row. Left: fixed 280×360 portrait image + name/credential line (Space Grotesk 700 14px) + small red "Meet Brian" tag button. Right: flourish **C** (2px ink top rule + 24px×2px red tick offset -2px) leading into H2 "Not the last resort. The next level." (PP Monument Extended 900 30px uppercase) and supporting paragraph.

**4. What We Do** — same flourish **C** rule with eyebrow "What we do" above a 3-column grid, `gap:20px`. Each card: 26px padding, flourish **G** stamped number badge (40×40px, 2px ink border, offset -14px/-14px top-left, PP Monument Extended 900 16px number) — card 1 & 3 are paper/white with ink border, card 2 (middle) inverts to ink background with red badge, no border. Each card: red eyebrow label (PP Monument Wide 12px), H3 title (PP Monument Extended 900 19px uppercase), body copy (Space Grotesk 500 14px, 70% opacity).

**5. Quote/pillars** — large pull-quote blockquote, left border 4px red, PP Monument Extended 900 28px uppercase. Below: two-column pillar list ("Validated", "Direct"), each using flourish **C** rule treatment at smaller scale. Closing red text link "More on our approach →".

**6. Hazard divider (flourish H)** — full-width 6px repeating 45° diagonal stripe, red/transparent, 6px segments. Used as a section-break rule only — not a full pattern fill.

**7. CTA band** — full-bleed red (`#C4472A`) background, padding 56px, flex row space-between: H2 "Over being overwhelmed?" (white, PP Monument Extended 900 28px uppercase) + paper-colored button with ink text.

**8. Footer** — ink background, padding `40px 56px`, flex row space-between wrap: wordmark (paper, PP Monument Extended 900 uppercase) + contact line (Space Grotesk 13px, paper 85%). Legal disclaimer strip below footer, ink background, Space Grotesk 11px, ink-on-paper faint (`rgba(26,28,30,.4)` — note: this line sits on the dark footer band in the current mock; verify contrast when implementing, may need to switch to a light-on-dark tint).

## Design Flourish System (apply site-wide, not just homepage)
- **Flourish C — Hairline rule + tick:** `border-top: 2px solid #1A1C1E` on a container with `position:relative; padding-top:16-18px`, plus an absolutely positioned `24px × 2px` red (`#C4472A`) tick at `top:-2px; left:0`. Use above section eyebrows/headings as a section-divider marker throughout the site.
- **Flourish G — Stamped number badge:** `40×40px` box, `2px solid #1A1C1E` border (omit border on dark/inverted cards), positioned `absolute; top:-14px; left:-14px` over the parent card's corner, centered number in PP Monument Extended 900 16px. Use for any sequenced/numbered content (steps, services, FAQs).
- **Flourish H — Hazard-stripe rule:** `height:6px`, `background: repeating-linear-gradient(45deg, #C4472A 0 6px, transparent 6px 12px)`. Use sparingly as a full-width divider between major sections or to flag something time-sensitive/urgent — never as a large fill area.

## Interactions & Behavior
Not specified in the mock (static design only) — buttons/links should get standard hover states (e.g., slight opacity or fill shift) consistent with whatever interaction pattern the codebase already uses elsewhere. Nav should be responsive (mobile menu) since this reference is desktop-only at 1200px.

## Design Tokens
```
--color-ink: #1A1C1E
--color-paper: #F7F5F2
--color-accent (red): #C4472A   /* oklch(58% 0.19 25) */
--color-ink-70: color-mix(in oklch, #1A1C1E 70%, #F7F5F2)   /* secondary text on paper */
--color-paper-85 (on ink): rgba(247,245,242,.85)             /* secondary text on ink */

Fonts:
--font-display: 'PP Monument Extended' (weight 900 only) — headlines, H1–H3, badge numbers
--font-wide:    'PP Monument Wide' (weight 400 only) — eyebrows/labels, wide tracking (0.18em)
--font-body:    'Space Grotesk' 400–700 — body copy, nav, buttons
  (Space Grotesk is a stand-in for PP Neue Machina, the intended body font — swap when licensed files are available)

Type sizes used on this page: 52px H1, 30px H2, 28px H2 (CTA/quote), 19-20px H3, 17px lead body, 14-15px body, 13-14px label/nav, 12-13px eyebrow/micro-label.
No border-radius anywhere in this system — all corners are square by design.
```
Full token files included below — these are the canonical source, prefer them over hand-copying values out of this README.

## Assets
- `assets/fonts/PPMonumentExtended-Black.otf`, `assets/fonts/PPMonumentWide-Regular.otf` — licensed display fonts, `@font-face` as shown in `tokens/typography.css`.
- `assets/graphics/sisyphus-full.png` — custom hero illustration (man pushing boulder), flat geometric style, brand red. Final asset, ready to ship.
- `assets/photos/founder-portrait-web.jpg` — placeholder/working portrait of Brian Mulligan; confirm with client whether this is final before shipping.
- Space Grotesk loads from Google Fonts (`@import` in typography.css) — fine for staging, consider self-hosting for production.

## Files
- `design-reference-homepage.html` — the design reference itself, open directly in a browser.
- `tokens/colors.css`, `tokens/typography.css` — canonical design tokens (CSS custom properties), pull these directly into the codebase rather than re-deriving values.
