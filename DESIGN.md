---
version: "alpha"
name: "Neubrutalism"
description: "Neubrutalist interface for Open Smile. Bold borders, hard offset shadows, flat high-contrast color. AI-ready template."
colors:
  primary: "#FFD23F"
  secondary: "#FF6B6B"
  tertiary: "#74B9FF"
  neutral: "#000000"
typography:
  display:
    fontFamily: Syne
    fontSize: clamp(2.5rem, 5vw, 4rem)
    fontWeight: 800
  h1:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: Space Mono
    fontSize: 0.875rem
    fontWeight: 500
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    border: 3px solid #000
    boxShadow: 5px 5px 0 0 #000
    borderRadius: 0
    padding: 12px 24px
---

## Overview

Neubrutalism is a contemporary web and UI design movement that rejects polished neutrality in favor of graphic bluntness: high-contrast palettes, bold typography, strongly defined shapes, and conspicuous structure — especially outlines and hard shadows. Unlike earlier web brutalism, which was often deliberately raw and anti-conventional, neubrutalism translates that rebellious energy into a repeatable, commercially usable interface grammar.

Its core philosophy: explicitness over subtlety, personality over invisibility, memorable structure over perfect polish. Good neubrutalism is intentionally emphatic, not accidentally clumsy.

For Open Smile, this fits directly: a gamified, high-energy reward loop (smile → score → coins → leaderboard) benefits from an interface that *declares itself* rather than fading into generic SaaS neutrality. The loud, tactile, "impossible to ignore" grammar matches the emotional peaks of the product — capture, reveal, reward — while staying disciplined enough not to fight the user during trust-sensitive moments like auth and voucher redemption.

- Density: 5/10 — Balanced
- Variance: 5/10 — Bold but structured
- Motion: 4/10 — Subtle, physical

- **Style:** Bold, Colorful, Raw, Playful
- **Keywords:** Hard shadows, thick borders, square corners, flat color, bold type, zero blur, visible structure, anti-polish, offset depth, no gradients
- **Era:** 2020s Modern
- **Light/Dark:** ✓ Full / ✓ Full

## Colors

Neubrutalist color is categorical, not ambient. Colors carve surfaces into obvious objects and heighten the sense that the interface is assembled from discrete parts. No gradients — flat fills only. A black-and-white structural base punctuated by saturated accents.

- **#000000** — Black. All borders, all text on light surfaces.
- **#FFFDF5** — Off-white. Base background (not pure white — softer, warmer).
- **#FFD23F** — Bold Yellow. Primary accent: coins, primary CTAs, reward framing.
- **#FF6B6B** — Coral Pink. Streak/urgency elements, at-risk states.
- **#74B9FF** — Sky Blue. Focus states, secondary actions, links.
- **#88D498** — Soft Green. Success states, positive score feedback.

### Do
- Use a structurally simple palette even when it's visually loud — one neutral base + one dark outline color + limited accents.
- Ensure body text hits **4.5:1** contrast ratio (WCAG AA) against its background.
- Use color to carve surfaces into discrete, identifiable objects (a coin badge, a streak flame, a score card).

### Don't
- Use gradients. Flat fills are the grammar.
- Let every component compete at maximum saturation — that collapses hierarchy.
- Assume "loud" means accessible. Yellow-on-white specifically tends to fail contrast — check every pairing (see Accessibility below).
- Rely on color alone to convey state (e.g. don't use color alone to show a streak is about to expire — pair it with the flame icon and copy).

## Typography

Neubrutalist typography is assertive contrast: oversized display headlines, abrupt scale shifts, and a calm operational body copy underneath. The trick is not making every line shout — reserve extreme gestures for headlines, hero moments, and CTAs.

- **Display (hero, big score reveal):** Syne, weight 800 — used for the "94!" score-reveal moment, landing hero, and headline numbers (coin totals, milestone unlocks).
- **Headings:** Space Grotesk, weight 700 — section titles, card headers, leaderboard column headers.
- **Body:** Inter, weight 400 — calm, readable, generous line-height. Don't let body copy shout, or the loud elements lose their impact.
- **Mono (stats/tokens):** Space Mono — coin counts, streak numbers, timestamps, transaction ledger rows. Reinforces the "engineered/gamified" feel.

Scale:
- Hero: `clamp(2.5rem, 5vw, 4rem)`
- H1: `2.25rem`
- H2: `1.5rem`
- Body: `1rem / 1.6`
- Small: `0.875rem`

### Do
- Use the impact face (Syne) for headlines and score reveals — high weight, tight tracking.
- Use the utility face (Inter) for body — highly legible, generous line-height.
- Contrast via scale and weight, not novelty letterforms.

### Don't
- Make the entire typographic system shout at the same volume.
- Sacrifice body readability for aesthetic consistency.
- Use ornate/decorative fonts — the style is loud in scale, not in letterform.

## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered, 1.5rem side padding.
- **Spacing rhythm:** Base unit 0.5rem (8px).
- **Section vertical gaps:** `clamp(4rem, 8vw, 8rem)`.
- **Hero layout:** Split-screen or centered-bold for landing; capture screen is single-focus, camera-centered.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).
- **Structured disruption:** keep navigation and core reading flows predictable; allow local "breaks" (offset cards, the leaderboard podium's staggered heights, the scratch card's tilt) to create energy. Broken but not random — micro-level alignment (labels, fields, buttons) stays mechanically precise even where macro-level layout gets expressive.

## Elevation & Depth

```
border: 3px solid #000;
box-shadow: 5px 5px 0 0 #000;
border-radius: 0;
```

No gradients, no blur, sharp corners, bold typography. Depth is anti-naturalistic: hard, offset shadows with zero blur, not atmospheric elevation.

### The Three-Tier Shadow System
- **Small** — `3px 3px 0 0 #000` — badges, chips, inline actions, coin counter.
- **Medium** — `5px 5px 0 0 #000` — cards, buttons, panels (default).
- **Large** — `8px 8px 0 0 #000` — overlays, hero elements, the #1 leaderboard podium card, reward-unlock moments.

### Physics
- **Hover:** element lifts (`translate(-2px, -2px)`), shadow grows to the next tier.
- **Active/press:** element "presses down" (`translate(3px, 3px)`), shadow disappears entirely. This is the mechanic that should drive the scratch card's press-to-reveal feel and the "cha-ching" coin-reward moment.
- **Duration:** 150–300ms, ease-out. Only `transform` and `box-shadow` animated — no layout-triggering properties.
- **Focus:** never sacrifice the focus ring for the aesthetic — `outline: 3px solid #74B9FF; outline-offset: 3px;` on every interactive element.

## Shapes

Base corner radius: **0**. Square corners are the signature, not an accident. No exceptions across buttons, cards, inputs, badges, or modals.

## Components

- **Primary Button:** `border: 3px solid #000`, flat `#FFD23F` fill, `box-shadow: 5px 5px 0 0 #000`, `border-radius: 0`, weight 700 text. Hover: lift + grow shadow to `7px 7px 0 0 #000`. Active: press to `translate(3px, 3px)`, shadow removed.
- **Secondary / Ghost Button:** Same border/shadow grammar, transparent or off-white fill, colored border for a secondary accent (e.g. sky blue) instead of black where appropriate.
- **Cards:** `border: 3px solid #000`, `box-shadow: 5px 5px 0 0 #000` (medium tier), zero radius. Leaderboard podium top-3 cards scale shadow by rank — #1 gets `8px 8px 0 0 #000`.
- **Inputs:** `border: 3px solid #000`, zero radius, `box-shadow: 3px 3px 0 0 #000` (small tier). Focus: shadow grows to medium tier + `translate(-1px, -1px)` + the sky-blue focus outline. Label above input, error text below in coral/red.
- **Scratch Card:** press/shadow physics doubles as the scratch-reveal cue — hard shadow flattens as the card is "scratched," coin value beneath is already server-locked before render.
- **Toasts / Notifications:** high-contrast flat background per state (yellow/success-green/coral for warning-error), thick border, hard shadow — impossible to miss, matches the milestone/reward-unlock energy.
- **Coin Counter:** flat yellow badge, black border, Space Mono font, small-tier shadow, ticks up with a small bounce on increment (not an instant jump).

## Where to Apply It (and Where to Hold Back)

- **Go loud (full neubrutalism):** landing page, capture screen, score reveal, leaderboard podium, badges/reward-unlock moments, scratch card. These are the emotional peaks — exactly where the grammar earns its keep.
- **Dial it back:** login/signup forms, account settings, voucher-claim confirmation. Keep these functionally calm — loud hero, calmer transactional flows — so users don't feel friction during trust-sensitive actions like claiming a real reward. This mirrors the style's own best-practice guidance: separate expression from interaction.

## Do's and Don'ts

- No pure decoration without function — a border should communicate container, interactive, focus, selected, or error; if it doesn't, remove it.
- No AI copywriting clichés: "Elevate," "Seamless," "Unleash," "Next-Gen."
- No broken external image links.
- No 3-column equal-width feature layouts on marketing surfaces — prefer zig-zag or asymmetric grids.
- No `h-screen` — use `min-h-[100dvh]`.

- Do hard borders (3px canonical, 2px thin / 4px thick for hierarchy).
- Do hard offset shadows, zero blur, always.
- Do high-saturation flat colors, no gradients.
- Do bold typography with a clear display/heading/body/mono role split.
- Do the "ugly-cute" tactile look — punk rock in a good mood, not hostile.

## Accessibility Checkpoint

- Every color pairing must hit **4.5:1** contrast (WCAG AA) before shipping — yellow-on-white and pink-on-orange are common failure points in this palette; test explicitly, don't assume loud means legible.
- Never use color alone to convey state (e.g. a streak-expiring warning needs the flame icon + copy, not just a color shift).
- Thick borders visually imply larger hit areas than the underlying code may provide — verify actual clickable/tap target size meets 24×24px minimum (WCAG 2.5.8), independent of border thickness.
- Decorative hard shadows must never obscure the keyboard focus ring — use `outline-offset` so focus stays visible against the shadow.

## Use Case

Landing page, capture flow, leaderboard, reward system, social feed — Open Smile's full product surface, with intensity dialed per the loud/calm split above.
