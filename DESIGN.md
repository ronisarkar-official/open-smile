---
version: alpha
name: shadcn-ui-design-analysis
description: An inspired interpretation of shadcn/ui's design language — a component-system brand whose surface is a neutral, near-monochrome canvas governed entirely by CSS-variable tokens, with zero decorative chrome of its own. Identity comes from restraint — Radix-primitive accessibility, a single configurable radius token, and a typographic voice borrowed wholesale from the host app's sans stack (Geist/Inter by convention) rather than a proprietary face.

colors:
  background: "#ffffff"
  foreground: "#0a0a0a"
  card: "#ffffff"
  card-foreground: "#0a0a0a"
  popover: "#ffffff"
  popover-foreground: "#0a0a0a"
  primary: "#171717"
  primary-foreground: "#fafafa"
  secondary: "#f5f5f5"
  secondary-foreground: "#171717"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  accent: "#f5f5f5"
  accent-foreground: "#171717"
  destructive: "#e7000b"
  destructive-foreground: "#fafafa"
  border: "#e5e5e5"
  input: "#e5e5e5"
  ring: "#a1a1a1"
  chart-1: "#f54a00"
  chart-2: "#009689"
  chart-3: "#104e64"
  chart-4: "#ffba00"
  chart-5: "#fe9a00"
  sidebar: "#fafafa"
  sidebar-foreground: "#0a0a0a"
  sidebar-primary: "#171717"
  sidebar-primary-foreground: "#fafafa"
  sidebar-accent: "#f5f5f5"
  sidebar-accent-foreground: "#171717"
  sidebar-border: "#e5e5e5"
  sidebar-ring: "#a1a1a1"
  dark-background: "#0a0a0a"
  dark-foreground: "#fafafa"
  dark-card: "#171717"
  dark-card-foreground: "#fafafa"
  dark-popover: "#262626"
  dark-popover-foreground: "#fafafa"
  dark-primary: "#e5e5e5"
  dark-primary-foreground: "#171717"
  dark-secondary: "#262626"
  dark-secondary-foreground: "#fafafa"
  dark-muted: "#262626"
  dark-muted-foreground: "#a1a1a1"
  dark-accent: "#404040"
  dark-accent-foreground: "#fafafa"
  dark-destructive: "#ff6467"
  dark-destructive-foreground: "#fafafa"
  dark-border: "rgba(255,255,255,0.1)"
  dark-input: "rgba(255,255,255,0.15)"
  dark-ring: "#737373"

typography:
  h1:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 36px
    fontWeight: 800
    lineHeight: 40px
    letterSpacing: -0.9px
  h2:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 30px
    fontWeight: 600
    lineHeight: 36px
    letterSpacing: -0.45px
  h3:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.36px
  h4:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.2px
  p:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 28px
  lead:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 32px
  large:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
  small:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 14px
  muted:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 14px
  button:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  code:
    fontFamily: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  table-header:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  blockquote:
    fontFamily: var(--font-sans), ui-sans-serif, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 28px

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 10px
  base: var(--radius)
  full: 9999px

spacing:
  px-0-5: 2px
  px-1: 4px
  px-1-5: 6px
  px-2: 8px
  px-2-5: 10px
  px-3: 12px
  px-4: 16px
  px-5: 20px
  px-6: 24px
  px-8: 32px
  px-10: 40px
  px-12: 48px
  px-16: 64px
  px-20: 80px
  px-24: 96px

components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-4} {spacing.px-4}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-4} {spacing.px-4}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-4} {spacing.px-4}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-4} {spacing.px-4}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-4} {spacing.px-4}"
  button-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    decoration: underline-on-hover
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.full}"
    padding: "{spacing.px-2} {spacing.px-0-5}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.full}"
    padding: "{spacing.px-2} {spacing.px-0-5}"
  badge-outline:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    typography: "{typography.small}"
    rounded: "{rounded.full}"
    padding: "{spacing.px-2} {spacing.px-0-5}"
  badge-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.full}"
    padding: "{spacing.px-2} {spacing.px-0-5}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    borderColor: "{colors.border}"
    typography: "{typography.p}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-6}"
    gap: "{spacing.px-6}"
  card-header:
    padding: "{spacing.px-6} {spacing.px-6} 0px"
    gap: "{spacing.px-1-5}"
  card-footer:
    padding: "0px {spacing.px-6} {spacing.px-6}"
  input:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    typography: "{typography.p}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-3} {spacing.px-1}"
  textarea:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    typography: "{typography.p}"
    rounded: "{rounded.md}"
    padding: "{spacing.px-3} {spacing.px-2}"
  select-trigger:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    typography: "{typography.p}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "{spacing.px-3}"
  checkbox:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.input}"
    rounded: "{rounded.sm}"
    size: 16px
  switch:
    backgroundColor-off: "{colors.input}"
    backgroundColor-on: "{colors.primary}"
    rounded: "{rounded.full}"
    width: 32px
    height: 18px
  avatar:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.full}"
    size: 40px
  tooltip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "{spacing.px-3} {spacing.px-1-5}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
  dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-6}"
    gap: "{spacing.px-4}"
  dropdown-menu:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    borderColor: "{colors.border}"
    typography: "{typography.p}"
    rounded: "{rounded.md}"
    padding: "{spacing.px-1}"
  table-header-cell:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.table-header}"
    padding: "{spacing.px-2}"
    rowBorder: "{colors.border}"
  table-cell:
    textColor: "{colors.foreground}"
    typography: "{typography.p}"
    padding: "{spacing.px-2}"
    rowBorder: "{colors.border}"
  alert:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    borderColor: "{colors.border}"
    typography: "{typography.p}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
  alert-destructive:
    backgroundColor: "{colors.card}"
    textColor: "{colors.destructive}"
    borderColor: "{colors.destructive}"
    typography: "{typography.p}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    borderColor: "{colors.sidebar-border}"
    typography: "{typography.small}"
    width: 256px
    padding: "{spacing.px-2}"
  sidebar-menu-item-active:
    backgroundColor: "{colors.sidebar-accent}"
    textColor: "{colors.sidebar-accent-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.px-2}"
  skeleton:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.md}"
    animation: pulse
  separator:
    backgroundColor: "{colors.border}"
    thickness: 1px

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: "Default tier card. Mirrors `card` chrome on the background surface with a hairline border."
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-6}"
  ex-pricing-tier-featured:
    description: "Featured tier — polarity-flipped to primary fill with primary-foreground text and an inverted CTA."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-6}"
  ex-product-selector:
    description: "Combobox + card list summarizing selected items — repurposed `popover` + `card` chrome, NOT a literal product gallery."
    backgroundColor: "{colors.popover}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
  ex-cart-drawer:
    description: "Sheet (slide-over) summary — line items per entry, divided by `separator` (NOT a literal e-commerce cart)."
    backgroundColor: "{colors.background}"
    rounded: "{rounded.none}"
    padding: "{spacing.px-6}"
    item-divider: "{colors.border}"
  ex-app-shell-row:
    description: "Sidebar menu-button row. Active state uses `sidebar-accent` as a filled pill, not a left-edge bar."
    backgroundColor: "{colors.sidebar}"
    activeIndicator: "{colors.sidebar-accent}"
    rounded: "{rounded.md}"
    padding: "{spacing.px-2}"
  ex-data-table-cell:
    description: "Default `table` chrome. Header uses medium-weight small type; body uses default paragraph type at 14px."
    headerBackground: transparent
    headerTypography: "{typography.table-header}"
    bodyTypography: "{typography.p}"
    cellPadding: "{spacing.px-2}"
    rowBorder: "{colors.border}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Mirrors `card` chrome with `input` + `button` primitives inside."
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-6}"
  ex-modal-card:
    description: "Dialog surface — same chrome as `card` with the Level 4 modal shadow and a centered-overlay backdrop."
    backgroundColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-6}"
  ex-empty-state-card:
    description: "Empty-state illustration frame. Generous padding on the muted surface."
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.xl}"
    padding: "{spacing.px-12}"
    captionTypography: "{typography.muted}"
  ex-toast:
    description: "Toast (sonner) notification surface — `card` chrome at a tighter radius with Level 3 shadow."
    backgroundColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "{spacing.px-4}"
    typography: "{typography.p}"

---


## Overview

shadcn/ui isn't a brand in the way Vercel or Stripe is a brand — it's a copy-paste component system, and that fact is the design language. There is no proprietary typeface, no signature gradient, no illustration style to extract. The entire visual identity lives in a short list of CSS variables (`--background`, `--foreground`, `--primary`, `--border`, `--ring`, `--radius`) that every component references instead of hard-coded values, plus a commitment to Radix UI primitives underneath for accessibility. The "look" people associate with shadcn/ui — the near-black-on-near-white neutral palette, the tight 6px-to-10px corner family, the 36px-tall control row — is really just the *default* token values the CLI scaffolds in, and the entire point of the system is that those defaults are meant to be overwritten.

Two style presets ship from the CLI: **"new-york"** (denser, smaller shadows, tighter spacing — closer to the original Vercel/Geist aesthetic) and **"default"** (slightly more generous padding, more visible borders). Both share the same token names; they differ only in the values assigned to `rounded`, `spacing`, and `shadow` inside `components.json`. As of the modern CLI, color tokens are emitted in **OKLCH** rather than hex, which is why the palette below is recorded as hex-equivalent approximations for portability — the source of truth in a real project is always the OKLCH value sitting in `app/globals.css`.

Type is borrowed, not owned. Project READMEs and demo sites overwhelmingly pair shadcn/ui with **Geist** (its sibling-by-convention, since both come out of the Vercel ecosystem) or **Inter** as the sans, and **Geist Mono** or **JetBrains Mono** for code. But nothing in the component source enforces this — every component sets `font-family: inherit` and trusts the consuming app's `<body>` to have already loaded a sans stack. This is the single biggest divergence from a brand system like Vercel's: there is no `{typography.display-xl}` token baked into a component; headline scale comes entirely from Tailwind's `text-4xl font-bold tracking-tight` utility classes applied ad hoc in the page, with the Typography component (`components/ui/typography`) offering only a loose convention (`h1`–`h4`, `p`, `lead`, `large`, `small`, `muted`) rather than a locked type ramp.

**Key Characteristics:**
- Every visual property — fill, text, border, ring — resolves through a CSS variable, never a literal Tailwind color class. This is the system's one hard rule: components reference `bg-primary` (which maps to `var(--primary)`), never `bg-neutral-900`.
- A single `--radius` token (default `0.625rem` / 10px) drives every rounded corner across the entire kit via `calc()` offsets (`rounded-md` = `--radius - 2px`, `rounded-lg` = `--radius`, `rounded-sm` = `--radius - 4px`). Changing one variable reshapes every button, card, and input simultaneously.
- No proprietary decoration exists. Where Vercel has a mesh gradient, shadcn/ui has nothing — flat fills and 1px borders are the entire vocabulary. Visual interest is the consuming app's job.
- Dark mode is a first-class second token set (`.dark { --background: ... }`), not an afterthought — every component author is expected to test both palettes before shipping.
- Built on Radix UI primitives (Dialog, Popover, DropdownMenu, Select, Tooltip, Switch, etc.), so focus rings, keyboard nav, and ARIA wiring come for free and are *not* themeable away — the `ring` token exists specifically to keep focus-visible states consistent.
- Components are vendored into the consuming repo via the CLI (`npx shadcn@latest add button`), not installed as an opaque npm dependency — so "the design system" is really "a starting point you immediately own and are expected to edit."

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — `#171717`): The single primary-action color — solid buttons, active switch fill, primary badges. In the default light theme this resolves to a near-black neutral, not a hue; shadcn/ui ships with no "brand color" out of the box, and teams are expected to repoint this variable to their own accent.
- **Ring** (`{colors.ring}` — `#a1a1a1`): The universal focus-visible color, applied as a 3px ring with ~50% opacity around any focused interactive element. Inherited from Radix's accessibility requirements rather than chosen for branding.
- **Destructive** (`{colors.destructive}` — `#e7000b`): The one fixed-hue token in the system — a true red reserved for delete buttons, destructive alert variants, and form-validation error text.

### Surface
- **Background** (`{colors.background}` — `#ffffff`): The page-level base surface — pure white in light mode.
- **Card** (`{colors.card}` — `#ffffff`): The elevated-surface token. Identical to background in light mode, but diverges in dark mode (`#171717` vs `#0a0a0a` background) — this is the system's one explicit "this floats slightly above the page" signal.
- **Popover** (`{colors.popover}` — `#ffffff`): Dropdown, tooltip, and context-menu surface. In dark mode this lifts even further from card (`#262626`) to stay legible over busy backgrounds.
- **Muted** (`{colors.muted}` — `#f5f5f5`): The soft inset surface — skeleton loaders, disabled-field backgrounds, the calmer half of a two-tone empty state.
- **Secondary** (`{colors.secondary}` — `#f5f5f5`): Shares the muted value in light mode but is a semantically distinct token — secondary buttons and secondary badges key off this rather than `muted`, so a theme can diverge them later.
- **Border** (`{colors.border}` — `#e5e5e5`): 1px dividers — card outlines, table rows, input borders. In dark mode this becomes a translucent white (`rgba(255,255,255,0.1)`) rather than a flat gray, so it adapts cleanly over any dark background.

### Text
- **Foreground** (`{colors.foreground}` — `#0a0a0a`): Default body and heading text on `background`/`card` surfaces.
- **Muted Foreground** (`{colors.muted-foreground}` — `#737373`): Secondary text — descriptions, placeholder copy, table captions, the `<Muted>` typography variant.
- **Primary Foreground** (`{colors.primary-foreground}` — `#fafafa`): Text/icon color on any `primary`-filled surface.
- **Destructive Foreground** (`{colors.destructive-foreground}` — `#fafafa`): Text on destructive-filled buttons and badges.

### Semantic
- **Accent** (`{colors.accent}` — `#f5f5f5`): The hover/highlighted state for menu items, command-palette rows, and ghost buttons — visually identical to `muted` in light mode but kept as its own token so interactive states can diverge from static muted surfaces.
- **Input** (`{colors.input}` — `#e5e5e5`): Border color specifically for form controls — separated from the generic `border` token so form chrome can be restyled independently of card/table borders.
- **Chart 1–5** (`{colors.chart-1}` through `{colors.chart-5}`): A five-step categorical palette (burnt orange, teal, deep navy, gold, amber) shipped specifically for the `chart` component family — the only place the system pre-supplies actual hue variety, since data visualization needs to distinguish series at a glance.
- **Sidebar tokens**: A parallel mini-palette (`sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring`) exists so a dashboard's sidebar can run a subtly different tone (slightly off-white at `#fafafa`) from the main canvas without a one-off override.

### No Brand Gradient
Unlike Vercel, shadcn/ui has no signature gradient, no atmospheric decoration, no hero-scale color moment. This is deliberate: the kit is consumed by thousands of unrelated products, and a gradient would read as "this is clearly a shadcn site" — the opposite of what a component library wants. Decoration is entirely the consuming app's responsibility; shadcn/ui supplies structure, contrast, and accessibility only.

## Typography

### Font Family
shadcn/ui ships **zero** proprietary or bundled fonts. Every component declares `font-family: inherit` (via Tailwind's default sans stack unless overridden) and trusts the app shell to load real fonts upstream — almost always via `next/font` in a Next.js project.

1. **Sans** — convention, not requirement. The official docs site and the overwhelming majority of demos pair the kit with **Geist Sans** (Vercel's geometric sans) or **Inter**. Weights 400 / 500 / 600 / 700 all appear, unlike Vercel's strict 600-ceiling rule — shadcn/ui's own `<h1>` convention reaches all the way to `font-extrabold` (800) for page-level headings.
2. **Mono** — also convention. **Geist Mono** or **JetBrains Mono** at 14px (`text-sm`) carries inline code (`<code>`), the `kbd` component, and table-cell numeric alignment in data-heavy admin templates.

### Hierarchy

The kit's own `components/ui/typography` reference (a documentation convention, not an enforced primitive) suggests this ramp:

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.h1}` | 36px | 800 | 40px | -0.9px | Page-level heading, used once per view. |
| `{typography.h2}` | 30px | 600 | 36px | -0.45px | Section heading, often paired with a bottom border in docs layouts. |
| `{typography.h3}` | 24px | 600 | 32px | -0.36px | Card-cluster / sub-section heading. |
| `{typography.h4}` | 20px | 600 | 28px | -0.2px | Inline sub-heading inside a card. |
| `{typography.lead}` | 20px | 400 | 32px | 0 | Intro paragraph directly under an `h1`. |
| `{typography.p}` | 16px | 400 | 28px | 0 | Default body paragraph; generous 1.75 line-height. |
| `{typography.large}` | 18px | 600 | 28px | 0 | Emphasized inline statement, dialog titles. |
| `{typography.small}` | 14px | 500 | 14px | 0 | Form labels, badge text, button labels, tight UI chrome. |
| `{typography.muted}` | 14px | 400 | 20px | 0 | Captions, helper text under form fields, secondary descriptions. |
| `{typography.label}` | 14px | 500 | 14px | 0 | Form-field labels specifically (shares values with `small`). |
| `{typography.button}` | 14px | 500 | 20px | 0 | All button-size labels — there is only one button type scale, unlike Vercel's md/lg split. |
| `{typography.code}` | 14px | 600 | 20px | 0 | Inline `<code>` — bumped to semibold and wrapped in a muted pill background. |
| `{typography.table-header}` | 14px | 500 | 20px | 0 | `<TableHead>` cells. |
| `{typography.blockquote}` | 16px | 400 (italic) | 28px | 0 | Blockquote convention — italic body size with a left border accent. |

### Principles
- **There is no locked display scale.** Unlike a brand system, `h1`–`h4` are documentation suggestions implemented as plain Tailwind utility stacks (`text-4xl font-extrabold tracking-tight`), not as a component anyone imports. A consuming app is expected to override every size.
- **One button type size, not two.** Every `Button` variant and `size` prop shares the same 14px/500 label type — there's no marketing-scale vs nav-scale split the way Vercel separates `button-md` from `button-lg`. Size variants (`sm`/`default`/`lg`/`icon`) change height and padding only, never the type scale.
- **Negative tracking is light, not aggressive.** Headings carry a gentle `tracking-tight` (roughly -2.5% of font-size) — nowhere near Vercel's -2.4px-at-48px aggression. The voice is calmer because the kit assumes it's living inside someone else's brand voice, not asserting its own.
- **Mono is opt-in, not load-bearing.** Code, `kbd`, and numeric table columns are the only places mono appears, and even those are a convention from the docs site rather than a hardcoded primitive.

### Note on Font Substitutes
Because no font is bundled, "substitution" is really "first choice":
- **Sans** — **Geist** (if the project already sits in the Vercel ecosystem) or **Inter** (the safer, more universally available default) cover the convention. Either pairs cleanly with the kit's 400/500/600/700 weight usage.
- **Mono** — **Geist Mono** or **JetBrains Mono** at 14px match the `<code>` and `<kbd>` treatment without any visual compromise.

## Layout

### Spacing System
- **Base unit**: 4px, inherited directly from Tailwind's default spacing scale (`spacing-1` = 0.25rem = 4px) — shadcn/ui adds no spacing tokens of its own, it consumes Tailwind's scale as-is.
- **Tokens used inside components**: `{spacing.px-1}` 4px · `{spacing.px-1-5}` 6px · `{spacing.px-2}` 8px · `{spacing.px-2-5}` 10px · `{spacing.px-3}` 12px · `{spacing.px-4}` 16px · `{spacing.px-5}` 20px · `{spacing.px-6}` 24px · `{spacing.px-8}` 32px · `{spacing.px-10}` 40px · `{spacing.px-12}` 48px · `{spacing.px-16}` 64px · `{spacing.px-20}` 80px · `{spacing.px-24}` 96px.
- **Control height rhythm**: the default `Button`, `Input`, and `Select` trigger all land on exactly 36px (`h-9`) — this single shared height is what makes a form row built from mixed shadcn components line up without manual adjustment. Small variants drop to 32px (`h-8`), large to 40px (`h-10`).
- **Card interior padding**: `{spacing.px-6}` 24px on all sides is the default `Card` padding, with header/footer slicing that same 24px horizontal rhythm and zeroing out the vertical edge they don't own (header has no top gap removed, footer has no bottom gap removed).
- **Inline gap**: `gap-2` (8px) is the default flex-gap inside buttons-with-icon and badge rows; `gap-4` (16px) is the more common gap between sibling form fields or card sections.

### Grid & Container
- **Max width**: not opinionated. Unlike a marketing brand, shadcn/ui ships no page-container component — max-width, gutters, and breakpoint container queries are entirely left to the consuming Tailwind config (`container` plugin or manual `max-w-7xl mx-auto px-4` patterns).
- **Column patterns** (convention, drawn from the official examples/dashboard-01 template):
  - Stat-card row: 4-up at desktop, 2-up at tablet, 1-up at mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
  - Dashboard split: a fixed-width `Sidebar` (256px) plus a fluid main content area.
  - Data-table page: full-width `Table` inside a `Card`, with a toolbar row (`Input` + `DropdownMenu` filters) above it.
  - Settings forms: single-column max-width-md stack, label-above-input throughout (no inline label/input row).

### Whitespace Philosophy
Because the kit has no decorative system to give the eye somewhere to rest, whitespace and border contrast do that job instead. The look reads as "structured density" rather than "generous breathing room" — `Card` padding sits at a businesslike 24px, not Vercel's 32px marketing-card padding, and section gaps in dashboard templates favor 16–24px over the 64–96px bands a marketing brand would use. The system optimizes for *information density per screen* (admin panels, dashboards, forms) rather than *narrative pacing* (landing pages) — though nothing stops a team from stretching the same tokens into a looser marketing layout.

### Responsive Strategy

#### Breakpoints
shadcn/ui inherits Tailwind's default breakpoint scale wholesale — there is no custom breakpoint set:

| Name | Width | Key Changes |
|---|---|---|
| Default (mobile-first) | < 640px | Sidebar collapses to an off-canvas `Sheet`; stat-grids drop to 1-up; dialogs go full-width with safe-area padding. |
| `sm` | ≥ 640px | Stat-grids reach 2-up; dialog width caps at `max-w-sm` to `max-w-lg` depending on content. |
| `md` | ≥ 768px | Sidebar becomes a persistent rail; forms switch from stacked to label-beside-input in some templates. |
| `lg` | ≥ 1024px | Stat-grids reach full 4-up; data tables show all columns instead of a condensed subset. |
| `xl` / `2xl` | ≥ 1280px / 1536px | Layout width caps applied by the consuming app; the kit itself adds no new behavior past `lg`. |

#### Touch Targets
The default 36px (`h-9`) control height sits just under the 44×44px WCAG-recommended floor; the kit compensates by keeping generous horizontal click/tap padding (`px-4` minimum) and relying on the `size="lg"` (40px) or custom overrides for primary mobile CTAs. `IconButton`-style icon-only buttons default to a 36×36px square, which teams commonly bump to 40–44px for touch-primary surfaces.

#### Collapsing Strategy
- **Sidebar**: persistent rail at `md`+ via the `Sidebar` component's own `useSidebar` state; collapses into a `Sheet` (slide-over) overlay below `md`, triggered by a `SidebarTrigger` hamburger icon.
- **Dialog**: centered modal at all breakpoints above `sm`; many teams swap `Dialog` for `Drawer` (a bottom-sheet variant) specifically on mobile breakpoints since shadcn/ui ships both and treats them as interchangeable patterns.
- **Data table**: no built-in responsive collapsing — teams either horizontally scroll the table or hide lower-priority columns via Tailwind's `hidden md:table-cell` utilities column-by-column.
- **Stat-card grid**: 4-up → 2-up → 1-up at the breakpoints above; each `Card` keeps its `{rounded.xl}` shape and 24px padding across all viewports.

#### Image Behavior
shadcn/ui has no native image/media component — `Avatar` (with Radix's `AvatarFallback` for initials) is the only image-adjacent primitive shipped. Aspect-ratio-locked imagery, lazy-loading, and placeholder states are left to `next/image` or a manual `AspectRatio` primitive (also Radix-backed) wrapping a plain `<img>`.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Full-bleed page background; the base `background` surface itself. |
| Level 1 — Hairline Only | `1px solid var(--border)`, no shadow. | Default `Card`, `Table`, and `Separator` chrome — the system's single most common "you can see this region" cue. |
| Level 2 — Subtle (`shadow-xs`) | `0 1px 2px 0 rgb(0 0 0 / 0.05)`. | `Button`, `Input`, and `Select` trigger resting state — barely perceptible, mostly present to read as "interactive." |
| Level 3 — Popover (`shadow-md`) | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`. | `Popover`, `DropdownMenu`, `Select` content, `Tooltip` — floating UI that needs to read clearly above the page. |
| Level 4 — Dialog (`shadow-lg`) | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`. | `Dialog`, `AlertDialog`, `Sheet` — the highest elevation in the default kit, reserved for content that blocks the page. |
| Level 5 — Toast (`shadow-md` + border) | Same as Level 3, paired with a full `1px solid var(--border)` ring. | `Sonner` toast notifications — needs both the floating shadow and a crisp edge since it often sits over busy page content. |

Unlike Vercel's multi-stop stacked shadow recipe, shadcn/ui's default shadow scale is Tailwind's stock `shadow-xs` through `shadow-lg` utilities — single-pass, not layered. The system leans on the 1px `border` token far more than on shadow to communicate "this is a distinct region," which is part of why the overall surface reads flatter and more utilitarian than a marketing brand's card system.

### Decorative Depth
- **No atmospheric effect of any kind.** There is no gradient, no blur, no glow anywhere in the default kit — depth is communicated exclusively through the border + shadow combination above.
- **Border-first elevation cue.** Where Vercel uses a polarity-flip (light band → dark band) as its primary depth signal, shadcn/ui uses the `card`-vs-`background` token split — a one-step lightness shift plus a hairline border — as its only "this sits above the page" cue in light mode.
- **Dark mode inverts the relationship.** In dark mode, `card` (`#171717`) sits *lighter* than `background` (`#0a0a0a`), which is the opposite lightness direction from light mode's card-equals-background — a detail easy to miss when porting a light-mode-only theme to dark.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed sheets, table containers that span edge-to-edge inside a card. |
| `{rounded.sm}` | 4px (`--radius - 4px`) | `Checkbox`, small inline chips, the tightest corner in the default scale. |
| `{rounded.md}` | 6px (`--radius - 2px`) | `Button`, `Input`, `Select` trigger, `Badge` (square variant) — the default control radius. |
| `{rounded.lg}` | 8px (`--radius`) | `Dialog`, `Popover`, `DropdownMenu`, `Alert` — the default container radius. |
| `{rounded.xl}` | 10px (`--radius + 2px`) | `Card` — deliberately one step rounder than the dialogs and menus that appear on top of it. |
| `{rounded.full}` | 9999px | `Avatar`, `Switch` track, pill-style `Badge` (the default badge shape), `Button` with `rounded-full` override. |

### The `--radius` Cascade
Every value above is *derived*, not independently set. The project defines exactly one variable — `--radius` (default `0.625rem` / 10px) — and every component radius is a `calc()` offset from it: `--radius-sm: calc(var(--radius) - 4px)`, `--radius-md: calc(var(--radius) - 2px)`, `--radius-lg: var(--radius)`, `--radius-xl: calc(var(--radius) + 4px)`. Changing the single root variable reshapes the entire kit's corner language in one edit — this is the system's signature mechanism and has no equivalent in a brand system like Vercel's, where radius values are hand-picked per component rather than computed.

### Photography Geometry
shadcn/ui has no photography or illustration convention of its own — no hero imagery, no showcase chrome, no aspect-ratio recommendations baked into a component beyond the generic `AspectRatio` primitive (which accepts any ratio the consumer specifies, with no default). Any image treatment in a shadcn-based product is entirely the product's own design decision.

## Components

### Buttons

**`button`** — the canonical solid primary action.
- Background `{colors.primary}`, text `{colors.primary-foreground}`, label set in `{typography.button}`, height 36px, padding `0px {spacing.px-4}`, shape `{rounded.md}`. Carries Level 2 (`shadow-xs`) resting elevation.

**`button-secondary`** — the low-emphasis alternative paired beside a primary button.
- Background `{colors.secondary}`, text `{colors.secondary-foreground}`, same typography/height/shape as `button`. No shadow.

**`button-destructive`** — the delete/remove action variant.
- Background `{colors.destructive}`, text `{colors.destructive-foreground}`, same typography/height/shape as `button`. The only place the fixed red token appears as a fill.

**`button-outline`** — the bordered, transparent-fill variant.
- Background `{colors.background}`, text `{colors.foreground}`, 1px solid `{colors.input}` border, same typography/height/shape as `button`.

**`button-ghost`** — the borderless, backgroundless variant that only reveals `{colors.accent}` on hover.
- Transparent at rest, text `{colors.foreground}`, same typography/height/shape as `button`. Used for toolbar icon-buttons and low-priority row actions.

**`button-link`** — the inline-text-styled variant.
- No background, text `{colors.primary}`, underline appears on hover only. Functionally a styled `<a>`/`<button>`, used when a button needs to read as a hyperlink.

**Size variants** (apply uniformly across all six variants above): `sm` (32px height, `{spacing.px-3}` padding), `default` (36px), `lg` (40px, `{spacing.px-6}` padding), `icon` (36×36px square, no horizontal padding).

### Cards & Containers

**`card`** — the canonical content container.
- Background `{colors.card}`, text `{colors.card-foreground}`, 1px solid `{colors.border}`, padding `{spacing.px-6}` 24px, internal `gap` `{spacing.px-6}`, shape `{rounded.xl}` 10px. No shadow by default in the current kit version (older versions shipped `shadow-sm`).

**`card-header` / `card-footer`** — the top/bottom slices of a `card`, sharing its horizontal 24px padding but zeroing their own outer vertical edge so they sit flush with the card boundary.

**`alert`** — the inline, non-dismissible callout.
- Background `{colors.card}`, text `{colors.card-foreground}`, 1px solid `{colors.border}`, padding `{spacing.px-4}` 16px, shape `{rounded.lg}` 8px. Hosts an icon-left layout with title + description stacked.

**`alert-destructive`** — the error-state variant of `alert`.
- Same chrome as `alert` but border and heading text recolor to `{colors.destructive}`.

**`skeleton`** — the loading-placeholder block.
- Background `{colors.muted}`, shape `{rounded.md}`, animated via a `pulse` opacity keyframe. Sized per-instance to match the content it's standing in for.

### Inputs & Forms

**`input`** — the canonical text field.
- Transparent background, text `{colors.foreground}`, 1px solid `{colors.input}` border, body in `{typography.p}` (16px, dropping to 14px at `text-sm` in dense forms), height 36px, padding `{spacing.px-3}` horizontal, shape `{rounded.md}`. Focus state adds a 3px `{colors.ring}` ring at ~50% opacity — this ring, not a border-color change, is the primary focus signal.

**`textarea`** — the multi-line variant of `input`, same border/radius/focus-ring treatment, with a `min-height` instead of a fixed height.

**`select-trigger`** — the dropdown-button face of the `Select` primitive.
- Same chrome as `input`, height 36px, with a chevron icon right-aligned. Opens a `popover`-elevation content panel.

**`checkbox`** — the canonical checkbox.
- Background `{colors.background}` unchecked, fills to `{colors.primary}` when checked, 1px solid `{colors.input}` border, shape `{rounded.sm}` 4px, fixed 16×16px size.

**`switch`** — the canonical toggle.
- Track fills `{colors.input}` off / `{colors.primary}` on, shape `{rounded.full}`, 32×18px track with a sliding circular thumb.

**`label`** — the form-field label.
- Text `{colors.foreground}`, set in `{typography.label}` (14px/500), no background or border — paired directly above its input with a 8px (`gap-2`) vertical gap by convention.

### Navigation

**`sidebar`** — the persistent dashboard rail.
- Background `{colors.sidebar}`, text `{colors.sidebar-foreground}`, 1px solid `{colors.sidebar-border}` edge, fixed width 256px, padding `{spacing.px-2}` 8px. Collapses into an off-canvas `Sheet` below the `md` breakpoint via the `SidebarProvider`/`SidebarTrigger` pair.

**`sidebar-menu-item-active`** — the highlighted state of a sidebar nav row.
- Background `{colors.sidebar-accent}`, text `{colors.sidebar-accent-foreground}`, shape `{rounded.md}`, padding `{spacing.px-2}`. Unlike Vercel's left-edge-bar indicator, the active cue here is a full filled pill behind the row, not an accent stripe.

**`dropdown-menu`** — the canonical floating menu.
- Background `{colors.popover}`, text `{colors.popover-foreground}`, 1px solid `{colors.border}`, padding `{spacing.px-1}` around a stack of menu-item rows, shape `{rounded.md}`. Carries Level 3 popover shadow.

**`tooltip`** — the hover-triggered micro-label.
- Background `{colors.primary}` (inverted relative to most surfaces — tooltips are deliberately high-contrast), text `{colors.primary-foreground}`, set in `{typography.small}`, padding `{spacing.px-3} {spacing.px-1-5}`, shape `{rounded.md}`.

### Signature Components

**`dialog`** — the centered modal.
- Background `{colors.background}`, text `{colors.foreground}`, padding `{spacing.px-6}` 24px, internal `gap` `{spacing.px-4}`, shape `{rounded.lg}` 8px. Sits over a semi-transparent dark overlay; carries Level 4 dialog shadow. Built on Radix `Dialog`, so focus-trap and escape-to-close are automatic, not opt-in.

**`sheet`** — the slide-over panel (Dialog's edge-anchored sibling).
- Same background/text/padding as `dialog` but `{rounded.none}` on the edge it's flush against, sliding in from `top`/`right`/`bottom`/`left` per the `side` prop. The standard mobile substitute for `sidebar` and `dialog` alike.

**`popover`** — the click-triggered floating panel (heavier than `tooltip`, lighter than `dialog`).
- Background `{colors.popover}`, text `{colors.popover-foreground}`, 1px solid `{colors.border}`, padding `{spacing.px-4}` 16px, shape `{rounded.lg}` 8px. Used for date-pickers, color-pickers, and any "click to reveal a small form" pattern.

**`avatar`** — the user-image / initials chip.
- Background `{colors.muted}` (fallback state), shape `{rounded.full}`, default 40×40px. Radix-backed `AvatarFallback` renders initials text when the image source fails to load — this graceful-degradation behavior is part of the primitive, not bolted on.

**`badge`** — the small inline status/metadata pill.
- Background `{colors.primary}`, text `{colors.primary-foreground}`, body in `{typography.small}`, padding `{spacing.px-2} {spacing.px-0-5}`, shape `{rounded.full}`. Secondary/outline/destructive variants follow the same pattern as the button family.

**`table`** — the data-grid primitive.
- Header cells in `{typography.table-header}` (14px/500), body cells in `{typography.p}` at the 14px (`text-sm`) reading, both with `{spacing.px-2}` cell padding and a `{colors.border}` row divider. No header background fill by default — the type-weight contrast alone signals "this is a header row."

### Examples (illustrative)

> Auto-derived kit-mirror demonstration surfaces (`scripts/derive-examples-block.mjs`). Each `ex-*` entry references shadcn-native primitives so downstream consumers (`/preview-design`, `/generate-kit`) re-skin the same 10 surfaces consistently. `TO_FILL` markers indicate missing primitives — resolve in the LLM judgment pass.

**`ex-pricing-tier`** — Default pricing tier card. Re-uses `card` chrome.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** — Featured/highlighted tier — polarity-flipped surface (`primary` fill + `primary-foreground` text).
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-product-selector`** — Selection summary panel — re-purposed `popover` + `card` chrome (NOT a literal product gallery).
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-cart-drawer`** — Line-item summary — re-purposed `sheet` chrome (NOT a literal e-commerce cart).
- Properties: `backgroundColor`, `rounded`, `padding`, `item-divider`

**`ex-app-shell-row`** — Sidebar nav row inside the App Shell example. Active state uses `sidebar-accent` as a filled-pill indicator.
- Properties: `backgroundColor`, `activeIndicator`, `rounded`, `padding`

**`ex-data-table-cell`** — Default `table` th + td chrome. Header uses medium-weight small type; body uses 14px paragraph type.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** — Sign-in / sign-up card. Re-uses `card` chrome with `input`/`button` primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** — Modal dialog surface — same chrome as `card` with Level 4 shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** — Empty-state illustration frame.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** — Toast notification surface — `card` chrome + border + Level 3 shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do's and Don'ts

### Do
- Always reference color via the CSS variable (`bg-primary`, `text-muted-foreground`, `border-border`) — never drop in a literal Tailwind palette class like `bg-neutral-900`. The moment a literal color class appears, theming and dark mode silently break for that one component.
- Treat `--radius` as the single dial for the entire kit's corner language. If a design needs sharper or rounder corners, change the root variable once rather than overriding `rounded-*` per component.
- Keep the 36px (`h-9`) control-height rhythm consistent across `Button`, `Input`, and `Select` in the same row — this shared height is what makes mixed-component form rows align without manual tweaking.
- Use the `ring` token, untouched, for focus-visible states. It's inherited from Radix's accessibility contract, not a stylistic choice — stripping it breaks keyboard navigation for sighted and screen-reader users alike.
- Pick **one** style preset (`new-york` or `default`) per project and stay there; the two presets differ in spacing/shadow density and mixing components scaffolded under different presets produces visibly inconsistent density.
- Load a real font stack (Geist, Inter, or equivalent) at the app-shell level before relying on any shadcn component's typography — the kit assumes `font-family: inherit` resolves to something intentional, not the browser default.
- Test every themed surface in both light and dark mode before shipping — remember that `card` and `background` swap their relative lightness direction between the two modes.

### Don't
- Don't hard-code a hex value anywhere a token exists. Even "just this once" literal colors are the single most common way a shadcn-based theme drifts out of sync with its own dark mode.
- Don't expect a built-in display type scale. There is no `{typography.display-xl}` equivalent shipped as an importable primitive — page-level headline sizing is the consuming app's job, every time.
- Don't add decorative chrome (gradients, glows, illustration) and call it "shadcn style." The system's entire identity is the *absence* of a decorative signature — any gradient you add is your brand's, not the kit's.
- Don't override Radix's built-in focus-trap, escape-to-close, or ARIA roles on `Dialog`/`Popover`/`DropdownMenu` to "simplify" the markup. These behaviors are the actual value of building on Radix rather than from scratch.
- Don't assume `card` background equals `background` in dark mode. They diverge specifically in dark mode (card is lighter), and a component built only against light-mode assumptions will look inverted when the theme flips.
- Don't stack shadows the way a marketing brand does. The kit's elevation scale is single-pass Tailwind shadow utilities plus a 1px border — layering multiple custom shadow offsets fights the system's flatter, more utilitarian read.
- Don't treat the vendored component source as untouchable. Unlike an npm-installed library, shadcn/ui components live directly in the consumer's repo specifically so they can — and should — be edited.
