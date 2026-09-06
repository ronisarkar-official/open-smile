---
version: "beta"
name: "Neubrutalism"
description: "Soft neubrutalist interface for Open Smile. Crisp outlines, hard offset brutal shadows, flat high-contrast neon accents, 7px base radius, and full dark-mode support."
colors:
  primary: "#FF2D78"
  secondary: "#7B61FF"
  accent: "#C6F135"
  neutral: "#0f0f0f"
typography:
  display:
    fontFamily: Sora
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
    fontWeight: 700
components:
  button-primary:
    backgroundColor: "var(--primary)"
    textColor: "var(--primary-foreground)"
    border: "var(--border-width) solid var(--outline)"
    boxShadow: "var(--brutal-shadow-md)"
    borderRadius: "var(--radius)"
    padding: "12px 24px"
---

## Overview

Open Smile uses a refined, modern **Neubrutalism** design system: high-contrast color pops, conspicuous outline structures, hard directional offset shadows with zero blur, and a distinctive tactile feel. Unlike rigid, harsh brutalism with zero radius and overly heavy borders, Open Smile embraces a calibrated **soft neubrutalism** featuring:
- A signature **7px base corner radius** (`--radius: 7px`) scaled across UI surfaces.
- Crisp, intentional **outline widths** (`1px` default, `1.5px` sm, `2px` lg).
- Hard **directional drop shadows** rendered with zero blur using `var(--outline)`.
- High-energy saturated accents: **Hot Pink** (`#FF2D78`), **Electric Purple** (`#7B61FF`), and **Electric Lime** (`#C6F135`).
- Complete, native **Light & Dark mode** architecture with automated theme inversion.

Its core philosophy: explicitness over subtlety, personality over SaaS blandness, memorable gamified structure over invisible polish.

- **Density:** 5/10 — Balanced
- **Variance:** 6/10 — Bold and energetic but mechanically structured
- **Motion:** 5/10 — Physical, tactile, and punchy (`.brutal-lift`, `.reveal-in`)
- **Style:** Bold, High-Contrast, Playful, Tactile Neubrutalism
- **Keywords:** Hard offset shadows, crisp borders, 7px corner radius, neon flat accents, balanced type, zero blur, visible structure, interactive physics, dark mode
- **Light/Dark:** Full Light (`#faf8f5`) / Full Dark (`#121014`)

---

## Color Palette & Theme Tokens

Neubrutalist color is categorical and purposeful. Colors carve surfaces into clear, identifiable objects (capture buttons, streak badges, coin rewards, podium ranks). Gradients are strictly avoided in favor of flat, high-contrast fills.

### Light Mode (`:root`)
- **Base Background:** `--background: #faf8f5` (Warm cream off-white base)
- **Foreground / Text:** `--foreground: #0f0f0f` (Deep obsidian black for primary text & outlines)
- **Card & Popover:** `--card: #ffffff`, `--popover: #ffffff`
- **Primary:** `--primary: #FF2D78` | Foreground: `--primary-foreground: #ffffff` (Hot Pink — primary CTAs, capture action, key branding)
- **Secondary:** `--secondary: #7B61FF` | Foreground: `--secondary-foreground: #ffffff` (Electric Purple — secondary actions, focus rings, stats)
- **Accent:** `--accent: #C6F135` | Foreground: `--accent-foreground: #0f0f0f` (Electric Lime / Chartreuse — streak highlights, badges, high-energy callouts)
- **Muted Surface:** `--muted: #f0ece7` | Text: `--muted-foreground: #57534e`
- **Status Colors:**
  - **Success:** `--success: #22C55E` (`--success-foreground: #0f0f0f`) — Positive scores, completed captures, wins
  - **Warning:** `--warning: #FBBF24` (`--warning-foreground: #0f0f0f`) — Streak warnings, coins, pending verification
  - **Destructive:** `--destructive: #EF4444` (`--destructive-foreground: #ffffff`) — Errors, streak expiration, dangerous actions
  - **Info:** `--info: #38BDF8` (`--info-foreground: #0f0f0f`) — Notifications, neutral informational chips
- **Podium & Leaderboard:**
  - **Rank 1 (Gold):** `--rank-1: #F59E0B`
  - **Rank 2 (Silver):** `--rank-2: #94A3B8`
  - **Rank 3 (Bronze):** `--rank-3: #D97706`
- **Sidebar Tokens:**
  - `--sidebar: #FDF8D4` (Pastel butter yellow)
  - `--sidebar-primary: #ffffff` with `--sidebar-primary-foreground: #FF2D78`
  - `--sidebar-border: #0f0f0f`
- **Structure & Rings:**
  - `--border: #0f0f0f` | `--outline: #0f0f0f` | `--input: #0f0f0f`
  - `--ring: #7B61FF`

### Dark Mode (`.dark`)
- **Base Background:** `--background: #121014` (Deep obsidian plum)
- **Foreground / Text:** `--foreground: #f5f3f0` (Crisp bone white)
- **Card & Popover:** `--card: #1c1921`, `--popover: #1c1921`
- **Primary:** `--primary: #FF4D8E` (Vivid neon pink tuned for dark backgrounds)
- **Secondary:** `--secondary: #9B85FF` (Luminous lavender)
- **Accent:** `--accent: #D4FF50` (Luminous electric lime)
- **Muted Surface:** `--muted: #2a2630` | Text: `--muted-foreground: #a8a0b5`
- **Status Colors:**
  - **Success:** `--success: #4ADE80`
  - **Warning:** `--warning: #FCD34D`
  - **Destructive:** `--destructive: #F87171`
  - **Info:** `--info: #7DD3FC`
- **Podium & Leaderboard:**
  - **Rank 1:** `--rank-1: #FBBF24`
  - **Rank 2:** `--rank-2: #CBD5E1`
  - **Rank 3:** `--rank-3: #F59E0B`
- **Structure & Rings:**
  - `--border: #f5f3f0` | `--outline: #f5f3f0` | `--input: #f5f3f0`
  - `--ring: #9B85FF`
  - Automatic dark-mode remaps: `.dark .border-black` automatically maps to `var(--outline)`, ensuring high contrast.

---

## Typography

Open Smile pairs energetic display typography with mechanical Grotesk titles and a clean sans-serif body:

1. **Display / Impact (`--font-impact` / `.font-display`):** **Sora** (`var(--font-sora)`), weight 700–800
   - Used for big score reveals ("94!"), hero stat callouts, coin milestones, and expressive headline moments.
2. **Headings / Titles (`--font-title` / `--font-heading`):** **Space Grotesk** (`var(--font-space-grotesk)`), weight 700–900
   - Used for section titles, modal headers, card titles, and uppercase button labels. Applied with `text-wrap: balance`.
3. **Body / Sans (`--font-body` / `--font-sans`):** **Inter** (`var(--font-inter)`), weight 400–600
   - Calm, legible, optimized for reading. Applied with `text-wrap: pretty`.
4. **Code / Mono (`--font-code` / `--font-mono`):** **Space Mono** (`var(--font-space-mono)`), weight 400 & 700
   - Coin counts, streak tallies, ledger transactions, timestamps, and badge chips.

### Type Scale
- **Hero / Display:** `clamp(2.5rem, 5vw, 4rem)` (Sora, weight 800)
- **H1:** `2.25rem` (Space Grotesk, bold)
- **H2:** `1.5rem` (Space Grotesk, bold)
- **H3:** `1.125rem` to `1.25rem` (Space Grotesk, bold)
- **Body:** `1rem` (line-height 1.6, Inter)
- **Small / Label:** `0.875rem` / `0.75rem` (Space Mono or Inter)

---

## Border & Radius System

Rather than 0px razor-sharp corners everywhere, Open Smile utilizes a **calibrated corner radius system** anchored to `--radius: 7px`:

```css
--radius: 7px;
--radius-sm: calc(var(--radius) - 4px); /* 3px */
--radius-md: calc(var(--radius) - 2px); /* 5px */
--radius-lg: var(--radius);             /* 7px */
--radius-xl: calc(var(--radius) + 4px); /* 11px */
--radius-2xl: calc(var(--radius) + 8px);/* 15px */
--radius-3xl: calc(var(--radius) + 12px);/* 19px */
--radius-4xl: calc(var(--radius) + 16px);/* 23px */
```

### Border Widths
- **Default:** `--border-width: 1px`
- **Medium / Sm:** `--border-width-sm: 1.5px`
- **Thick / Heavy:** `--border-width-lg: 2px`

### Border Utilities
- `.brutal-border`: `border: var(--border-width) solid var(--outline)`
- Directional variants: `.brutal-border-t`, `.brutal-border-b`, `.brutal-border-l`, `.brutal-border-r`, `.brutal-border-x`, `.brutal-border-y`
- Images: `outline: 1px solid rgba(0, 0, 0, 0.1); outline-offset: -1px;` (in dark: `rgba(255, 255, 255, 0.1)`)

---

## Elevation, Depth & Shadow System

Depth in Open Smile is strictly anti-naturalistic: **zero-blur, directional offset drop shadows** bound to `var(--outline)`:

| Token / Class | Value | Usage |
|---|---|---|
| `--shadow-brutal-xs` / `.brutal-shadow-xs` | `1.5px 1.5px 0 0 var(--outline)` | Badges, tags, micro chips, status pills |
| `--shadow-brutal-sm` / `.brutal-shadow-sm` | `2px 2px 0 0 var(--outline)` | Inputs, small buttons, sub-cards |
| `--shadow-brutal-md` / `.brutal-shadow-md` / `.brutal-shadow` | `2px 3px 0 0 var(--outline)` | Standard cards, default buttons, surfaces |
| `--shadow-brutal-lg` / `.brutal-shadow-lg` | `2px 2px 0 0 var(--outline)` | Dialogs, modals, hover states, #1 podium card |
| `--shadow-brutal-xl` / `.brutal-shadow-xl` | `2px 2px 0 0 var(--outline)` | Hero containers, prominent capture viewport |

---

## Physics, Motion & Interactions

### The Tactile Lift (`.brutal-lift`)
Interactive elements (buttons, selectable cards, clickable chips) use the `.brutal-lift` physics utility:
- **Base:** standard position and shadow.
- **Hover:** `transform: translate(-2px, -2px); box-shadow: var(--brutal-shadow-lg);` (element lifts towards the viewer).
- **Active / Press:** `transform: translate(2px, 2px) scale(0.98); box-shadow: none;` (element mechanically presses into the screen, shadow collapses).
- **Transition:** `background-color, box-shadow, transform 200ms ease-out`.

### Keyframe Animations & Reveal Utilities
- **`rise-in` / `.reveal-in`:** `420ms ease-out both` (opacity 0, translateY(16px) → opacity 1, translateY(0))
  - Stagger delays: `.reveal-delay-1` (80ms), `.reveal-delay-2` (160ms), `.reveal-delay-3` (240ms)
- **`marquee` / `.animate-marquee`:** Smooth horizontal infinite ticker (`32s linear infinite`)
- **`shimmer`:** Linear gradient sweep for skeletons and loading states
- **Reduced Motion Safety:** When `prefers-reduced-motion: reduce` is enabled, all animations and transitions collapse to `0.01ms` with standard scroll behavior.

---

## Component Standards

- **Buttons (`Button`, `buttonVariants`):**
  - Uses `border-[length:var(--border-width)] border-border rounded-lg uppercase tracking-wide font-bold brutal-lift`.
  - Variants: `default` (Primary Pink + brutal-shadow), `secondary` (Electric Purple + brutal-shadow), `accent` (Electric Lime + brutal-shadow), `outline` (Card background + border-border + brutal-shadow), `ghost`, `destructive`, `success`.
  - Focus ring: `focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3`.
  - Minimum height: `44px` (`h-11` default, `h-12` lg, `h-9` sm).
- **Cards (`.brutal-surface`):**
  - `border: var(--border-width) solid var(--outline); box-shadow: var(--brutal-shadow-md); border-radius: var(--radius);` with `bg-card text-card-foreground`.
- **Inputs (`.brutal-input`):**
  - Minimum height: `44px` (`h-11`).
  - Smooth focus-visible transition: `border-color: var(--ring); box-shadow: var(--brutal-shadow-md);`.
- **Badges (`.brutal-badge`):**
  - Compact border, `var(--radius)` (or rounded-md), and `brutal-shadow-xs`.
- **Dialogs / Modals (`.brutal-dialog`):**
  - `border: var(--border-width) solid var(--outline); box-shadow: var(--brutal-shadow-lg); border-radius: var(--radius);`.
- **Switches (`.brutal-switch` & `.brutal-switch-thumb`):**
  - 4px corner radius, `var(--border-width-lg)` outline, clean sliding physical toggle.
- **Toasts (`AlertToast`):**
  - Built with `.brutal-surface`, high-contrast flat fills based on status (`bg-success`, `bg-warning`, `bg-destructive`, `bg-info`), and Space Mono accents.

---

## Where to Apply & Intensity Dial

- **Go Loud (Full Neubrutalism):**
  - Landing page, camera capture viewfinder, score reveal moments ("94!"), scratch card animation, leaderboard podium, streak milestones.
- **Dial It Back (Calm Functional Brutalism):**
  - Auth forms (login, signup, OTP verify), user settings, voucher redemption, wallet ledger. Clean 1px borders, subtle brutal-shadow-xs, zero clutter.

---

## Accessibility Checkpoint

- **Contrast:** Every text pairing must exceed **4.5:1** (WCAG AA). Primary pink and electric lime must use their corresponding foreground tokens (`text-primary-foreground`, `text-accent-foreground`).
- **Touch Targets:** Minimum touch target of **44px** enforced across all buttons, inputs, selects, and textareas (`min-height: 44px;`).
- **Focus Rings:** Never suppress keyboard focus rings. Always use `focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3` so rings stand out clearly beyond the hard drop shadows.
- **Multi-modal Feedback:** Never communicate state via color alone; always combine color with icons (flame, check, alert) and descriptive text.

