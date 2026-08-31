# Graph Report - open-smile  (2026-08-31)

## Corpus Check
- 198 files · ~200,531 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2023 nodes · 3170 edges · 162 communities (93 shown, 67 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8960d4b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- mailer/index.ts
- components/radix/sheet.tsx
- radix/sidebar.tsx
- cn
- primitives/animate/tooltip.tsx
- app/layout.tsx
- dashboard/sidebar.tsx
- icons.tsx
- compilerOptions
- devDependencies
- rateLimit
- components.json
- settings-shared.tsx
- auth/index.ts
- app/page.tsx
- profile-content.tsx
- rewards/page.tsx
- leaderboard-card.tsx
- highlight.tsx
- Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)
- getPool
- upload/route.ts
- logo.tsx
- alert-dialog.tsx
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- capture-flow.tsx
- check-credentials/route.ts
- collapsible.tsx
- otp.ts
- verify-otp/page.tsx
- utils.ts
- ExceptionInfo
- ExceptionInfo
- combobox.tsx
- smile-result-screen.tsx
- Optical Alignment
- ios-install-guide.tsx
- 1. Product / Gameplay Rules
- Core Principles
- dependencies
- ui/sheet.tsx
- createLazyFile
- createLazyFile
- AGENTS.md — Open Smile
- Surfaces
- createWasm
- Minimum Hit Area
- DESIGN.md
- badge.tsx
- next.config.ts
- collections.ts
- _client.tsx
- score-reveal.tsx
- makeEntry
- instantiateArrayBuffer
- makeEntry
- makeEntry
- init
- run
- makeBlendState
- makeVertexAttributes
- run
- makeBlendState
- makeVertexAttributes
- init
- run
- makeBlendState
- makeVertexAttributes
- proxy.ts
- getFullscreenElement
- ___syscall_ioctl
- makeColorAttachments
- makeColorAttachments
- getFullscreenElement
- ___syscall_ioctl
- makeColorAttachments
- write
- syncfs
- write
- syncfs
- better-auth
- @better-auth/infra
- class-variance-authority
- clsx
- eslint.config.mjs
- @floating-ui/react
- @imagekit/next
- @imagekit/nodejs
- input-otp
- lucide-react
- @mediapipe/tasks-vision
- motion
- nodemailer
- pg
- radix-ui
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-icons
- @radix-ui/react-label
- @radix-ui/react-navigation-menu
- @radix-ui/react-slot
- react
- shadcn
- tailwind-merge
- tw-animate-css
- @types/nodemailer
- @vercel/analytics
- postcss.config.mjs
- close
- convertReturnValue
- custom_emscripten_dbgn
- EmscriptenEH
- ExitStatus
- fromWireType
- lookupPath
- makeDepthStencilState
- registerType
- statfs
- convertReturnValue
- custom_emscripten_dbgn
- doCallback
- fullscreenChange
- makeDepthStencilState
- registerType
- close
- convertReturnValue
- custom_emscripten_dbgn
- EmscriptenEH
- ExitStatus
- fromWireType
- lookupPath
- makeDepthStencilState
- registerType
- statfs
- sw.js
- {
	signIn,
	signUp,
	signOut,
	useSession,
	changePassword,
	changeEmail,
	deleteUser,
	linkSocial,
	unlinkAccount,
	listAccounts,
	listSessions,
	revokeSession,
	revokeOtherSessions,
	twoFactor,
	organization,
	admin,
	multiSession,
}
- Animations
- Transition Only What Changes
- Typography
- Architecture — Open Smile
- README.md
- Details that make interfaces feel better
- Security — Open Smile
- apply supabase/migrations/001_init.sql against your Supabase Postgres instance
- Shadows Instead of Borders
- Example
- Colors
- Typography
- CLAUDE.md
- copilot-instructions.md
- schema.md
- button.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 211 edges
2. `ModuleFactory()` - 120 edges
3. `Button()` - 37 edges
4. `getPool()` - 27 edges
5. `rateLimit()` - 19 edges
6. `Core Principles` - 17 edges
7. `compilerOptions` - 16 edges
8. `CoinIcon()` - 15 edges
9. `PRD — Open Smile` - 15 edges
10. `sendEmail()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/dashboard/settings/page.tsx → lib/utils.ts
- `NotificationsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/notifications/page.tsx → lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (162 total, 67 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "mailer/index.ts"
Cohesion: 0.13
Nodes (26): POST(), GET(), getPreviewHtml(), POST(), TestMailClient(), auth, sendLoginNotificationEmail(), sendResetPasswordEmail() (+18 more)

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.06
Nodes (45): Sheet(), SheetCloseProps, SheetContent(), SheetContentProps, SheetDescriptionProps, SheetFooter(), SheetFooterProps, SheetHeader() (+37 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.05
Nodes (45): SheetDescription(), SheetTitle(), [LocalSidebarProvider, useSidebar], SidebarContentProps, SidebarContextProps, SidebarFooter(), SidebarFooterProps, SidebarGroupAction() (+37 more)

### Community 6 - "cn"
Cohesion: 0.06
Nodes (45): AccordionContent, AccordionItem, AccordionTrigger, BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+37 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.06
Nodes (43): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+35 more)

### Community 8 - "app/layout.tsx"
Cohesion: 0.06
Nodes (34): inter, metadata, sora, spaceGrotesk, spaceMono, viewport, PwaInstallBanner(), PwaContext (+26 more)

### Community 9 - "dashboard/sidebar.tsx"
Cohesion: 0.07
Nodes (30): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+22 more)

### Community 10 - "icons.tsx"
Cohesion: 0.15
Nodes (17): recentActivity, AppNotification, INITIAL_NOTIFICATIONS, NotificationCategory, NotificationsPage(), RewardsPage(), CoinIconProps, COIN_BALANCE_EVENT (+9 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "devDependencies"
Cohesion: 0.07
Nodes (27): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+19 more)

### Community 13 - "rateLimit"
Cohesion: 0.21
Nodes (13): getClientIp(), POST(), getClientIp(), POST(), POST(), cleanupExpiredOtpCodes(), cleanupExpiredRateLimits(), resetRateLimit() (+5 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 15 - "settings-shared.tsx"
Cohesion: 0.17
Nodes (16): mobileNavSections, SettingsPage(), SettingsDialog(), SettingsDialogProps, NotificationsContent(), ActionButton(), NAV_GROUPS, NavGroup (+8 more)

### Community 16 - "auth/index.ts"
Cohesion: 0.15
Nodes (15): { GET, POST, PATCH, PUT, DELETE }, POST(), dynamic, GET(), revalidate, dynamic, GET(), revalidate (+7 more)

### Community 17 - "app/page.tsx"
Cohesion: 0.06
Nodes (28): FinalCta(), defaultBottomLinks, defaultFooterColumns, Footer(), FooterColumn, FooterLinkItem, FooterProps, Hero() (+20 more)

### Community 18 - "profile-content.tsx"
Cohesion: 0.11
Nodes (13): LoginForm(), SignupForm(), GitHubIcon(), GoogleIcon(), AccountItem, ProfileContent(), ProfileContentProps, SessionItem (+5 more)

### Community 19 - "rewards/page.tsx"
Cohesion: 0.18
Nodes (18): badges, milestones, ClaimedVouchersList(), ClaimedVouchersListProps, generateVoucherCode(), getBrandUrl(), VoucherClaimModal(), VoucherClaimModalProps (+10 more)

### Community 20 - "leaderboard-card.tsx"
Cohesion: 0.10
Nodes (24): metadata, leaderboardData, LeaderboardView(), PeriodData, runOptions, formatRangeDate(), LeaderboardCard, LeaderboardCardProps (+16 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)"
Cohesion: 0.06
Nodes (33): 1.1 Smile Capture & Anti-Cheat Pipeline (Subal), 1.2 Streak & Freeze Management (Subal), 1.3 Refer & Earn Program (Subal), 1.4 Serverless Maintenance Crons & Health Check (Subal), 1. System Architecture: Next.js + Python FastAPI (Vercel Serverless), 2.1 Leaderboard & Podium Engine (Akash), 2.2 Rewards & Voucher Marketplace (Akash), 2.3 Explore Feed & Social Smiles (Akash) (+25 more)

### Community 23 - "getPool"
Cohesion: 0.26
Nodes (11): getClientIp(), POST(), GET(), getPool(), getSupabase(), globalForPg, findBetaWaitlistByEmail(), insertBetaWaitlist() (+3 more)

### Community 24 - "upload/route.ts"
Cohesion: 0.23
Nodes (14): GET(), ALLOWED_MIME_TYPES, DELETE(), isImageKitUrl(), POST(), sanitizeFileName(), sanitizeFolder(), deleteFromImageKit() (+6 more)

### Community 25 - "logo.tsx"
Cohesion: 0.15
Nodes (7): highlights, runtime, metadata, Logo(), LogoProps, links, Navbar()

### Community 26 - "alert-dialog.tsx"
Cohesion: 0.24
Nodes (9): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+1 more)

### Community 27 - "abort"
Cohesion: 0.12
Nodes (17): abort(), assert(), assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), forceLoadFile() (+9 more)

### Community 28 - "vision_wasm_module_internal.js"
Cohesion: 0.11
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 29 - "abort"
Cohesion: 0.12
Nodes (17): abort(), assert(), assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), forceLoadFile() (+9 more)

### Community 30 - "PRD — Open Smile"
Cohesion: 0.06
Nodes (31): 10. Data Model (summary), 11. Success Metrics, 12. Current Build Status, 13. Open Questions, 14. Related Documents, 1. Summary, 2. Problem Statement, 3. Goals (+23 more)

### Community 31 - "capture-flow.tsx"
Cohesion: 0.06
Nodes (42): metadata, AuthGateOverlay(), BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin, CaptureFlow() (+34 more)

### Community 32 - "check-credentials/route.ts"
Cohesion: 0.25
Nodes (13): getClientIp(), invalidCredentials(), POST(), getClientIp(), POST(), generateOTP(), createAuthTicket(), getSecret() (+5 more)

### Community 33 - "collapsible.tsx"
Cohesion: 0.29
Nodes (6): Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps

### Community 34 - "otp.ts"
Cohesion: 0.24
Nodes (13): globalAny, hashOtp(), InMemoryOtpRecord, isDbConfigured(), OTP_MAX_ATTEMPTS, OTP_TTL_MS, safeEqual(), saveOTP() (+5 more)

### Community 35 - "verify-otp/page.tsx"
Cohesion: 0.36
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 36 - "utils.ts"
Cohesion: 0.13
Nodes (16): metadata, publicSmiles, statCards, userProfile, AvatarUpload(), AvatarUploadProps, sizeClasses, ImageKitUploadedFile (+8 more)

### Community 39 - "combobox.tsx"
Cohesion: 0.21
Nodes (9): Combobox(), ComboboxOption, ComboboxProps, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+1 more)

### Community 40 - "smile-result-screen.tsx"
Cohesion: 0.19
Nodes (10): NeubrutalistPhotoCard(), NeubrutalistPhotoCardProps, AI_REACTIONS, AiReaction, CONFETTI_COLORS, getAiReaction(), getScoreBarColor(), getVibeLabel() (+2 more)

### Community 41 - "Optical Alignment"
Cohesion: 0.50
Nodes (4): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Optical Alignment, Play Button Triangles

### Community 42 - "ios-install-guide.tsx"
Cohesion: 0.29
Nodes (8): IosInstallGuide(), IosInstallGuideProps, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 43 - "1. Product / Gameplay Rules"
Cohesion: 0.09
Nodes (22): 1. Product / Gameplay Rules, 2. Engineering Rules, 3. Contribution Rules, Anti-cheat (do not remove without a replacement), Auth, Before submitting any change, Branching, Code style (+14 more)

### Community 44 - "Core Principles"
Cohesion: 0.12
Nodes (17): 10. Text Wrapping, 11. Image Outlines, 12. Scale on Press, 13. Skip Animation on Page Load, 14. Never Use `transition: all`, 15. Use `will-change` Sparingly, 16. Minimum Hit Area, 1. Concentric Border Radius (+9 more)

### Community 45 - "dependencies"
Cohesion: 0.22
Nodes (9): @base-ui/react, next, dependencies, @base-ui/react, next, react-dom, @supabase/supabase-js, react-dom (+1 more)

### Community 46 - "ui/sheet.tsx"
Cohesion: 0.25
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 47 - "createLazyFile"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 48 - "createLazyFile"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 49 - "AGENTS.md — Open Smile"
Cohesion: 0.17
Nodes (12): AGENTS.md — Open Smile, Anti-cheat — do not weaken these without discussion, Auth conventions, Before submitting changes, Codebase Knowledge Graph (Graphify), Current build status, Database conventions, Design system (+4 more)

### Community 50 - "Surfaces"
Cohesion: 0.20
Nodes (9): Color rules (non-negotiable), Concentric Border Radius, Dark Mode, Example, Image Outlines, Light Mode, Surfaces, Tailwind Example (+1 more)

### Community 51 - "createWasm"
Cohesion: 0.29
Nodes (8): assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), getWasmImports(), locateFile(), updateMemoryViews()

### Community 52 - "Minimum Hit Area"
Cohesion: 0.50
Nodes (4): Collision Rule, CSS Example, Minimum Hit Area, Tailwind Example

### Community 53 - "DESIGN.md"
Cohesion: 0.17
Nodes (11): Accessibility Checkpoint, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Physics, Shapes (+3 more)

### Community 54 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "collections.ts"
Cohesion: 0.21
Nodes (14): POST(), getClientIp(), getSessionCookieName(), POST(), sendLoginNotification(), setSessionCookie(), BetaWaitlistRow, createSessionForUser() (+6 more)

### Community 57 - "_client.tsx"
Cohesion: 0.33
Nodes (4): TemplateOption, TEMPLATES, TemplateType, TestMailClient

### Community 58 - "score-reveal.tsx"
Cohesion: 0.47
Nodes (4): getScoreColor(), getScoreLabel(), ScoreReveal(), ScoreRevealProps

### Community 59 - "makeEntry"
Cohesion: 0.33
Nodes (6): makeBufferEntry(), makeEntries(), makeEntry(), makeSamplerEntry(), makeStorageTextureEntry(), makeTextureEntry()

### Community 60 - "instantiateArrayBuffer"
Cohesion: 0.33
Nodes (6): abort(), assert(), getBinarySync(), getWasmBinary(), instantiateArrayBuffer(), instantiateAsync()

### Community 61 - "makeEntry"
Cohesion: 0.33
Nodes (6): makeBufferEntry(), makeEntries(), makeEntry(), makeSamplerEntry(), makeStorageTextureEntry(), makeTextureEntry()

### Community 62 - "makeEntry"
Cohesion: 0.33
Nodes (6): makeBufferEntry(), makeEntries(), makeEntry(), makeSamplerEntry(), makeStorageTextureEntry(), makeTextureEntry()

### Community 64 - "run"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 65 - "makeBlendState"
Cohesion: 0.40
Nodes (5): makeBlendComponent(), makeBlendState(), makeColorState(), makeColorStates(), makeFragmentState()

### Community 66 - "makeVertexAttributes"
Cohesion: 0.40
Nodes (5): makeVertexAttribute(), makeVertexAttributes(), makeVertexBuffer(), makeVertexBuffers(), makeVertexState()

### Community 67 - "run"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 68 - "makeBlendState"
Cohesion: 0.40
Nodes (5): makeBlendComponent(), makeBlendState(), makeColorState(), makeColorStates(), makeFragmentState()

### Community 69 - "makeVertexAttributes"
Cohesion: 0.40
Nodes (5): makeVertexAttribute(), makeVertexAttributes(), makeVertexBuffer(), makeVertexBuffers(), makeVertexState()

### Community 71 - "run"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 72 - "makeBlendState"
Cohesion: 0.40
Nodes (5): makeBlendComponent(), makeBlendState(), makeColorState(), makeColorStates(), makeFragmentState()

### Community 73 - "makeVertexAttributes"
Cohesion: 0.40
Nodes (5): makeVertexAttribute(), makeVertexAttributes(), makeVertexBuffer(), makeVertexBuffers(), makeVertexState()

### Community 75 - "getFullscreenElement"
Cohesion: 0.50
Nodes (4): getFullscreenElement(), requestFullscreen(), fullscreenChange(), updateCanvasDimensions()

### Community 76 - "___syscall_ioctl"
Cohesion: 0.50
Nodes (4): ioctl_tcgets(), ioctl_tcsets(), ioctl_tiocgwinsz(), ___syscall_ioctl()

### Community 77 - "makeColorAttachments"
Cohesion: 0.50
Nodes (4): makeColorAttachment(), makeColorAttachments(), makeDepthStencilAttachment(), makeRenderPassDescriptor()

### Community 78 - "makeColorAttachments"
Cohesion: 0.50
Nodes (4): makeColorAttachment(), makeColorAttachments(), makeDepthStencilAttachment(), makeRenderPassDescriptor()

### Community 79 - "getFullscreenElement"
Cohesion: 0.50
Nodes (4): getFullscreenElement(), requestFullscreen(), fullscreenChange(), updateCanvasDimensions()

### Community 80 - "___syscall_ioctl"
Cohesion: 0.50
Nodes (4): ioctl_tcgets(), ioctl_tcsets(), ioctl_tiocgwinsz(), ___syscall_ioctl()

### Community 81 - "makeColorAttachments"
Cohesion: 0.50
Nodes (4): makeColorAttachment(), makeColorAttachments(), makeDepthStencilAttachment(), makeRenderPassDescriptor()

### Community 82 - "write"
Cohesion: 0.67
Nodes (3): msync(), put_char(), write()

### Community 83 - "syncfs"
Cohesion: 1.00
Nodes (3): syncfs(), doCallback(), done()

### Community 84 - "write"
Cohesion: 0.67
Nodes (3): msync(), put_char(), write()

### Community 85 - "syncfs"
Cohesion: 1.00
Nodes (3): syncfs(), doCallback(), done()

### Community 146 - "Animations"
Cohesion: 0.08
Nodes (24): Animations, Choosing Between Motion and CSS, Code Example, Contextual Icon Animations, CSS Example, CSS-Only Stagger, CSS Transition Approach (No Motion), CSS Transitions vs. Keyframes (+16 more)

### Community 147 - "Transition Only What Changes"
Cohesion: 0.18
Nodes (10): CSS Example, Performance, Rules, Tailwind, Tailwind `transition-transform` Note, Transition Only What Changes, Use `will-change` Sparingly, Useful Properties (+2 more)

### Community 148 - "Typography"
Cohesion: 0.18
Nodes (11): Caveat, Font Family Scope, Font Smoothing (macOS), Good vs. Bad, Tabular Numbers, text-wrap: balance, text-wrap: pretty, Text Wrapping (+3 more)

### Community 149 - "Architecture — Open Smile"
Cohesion: 0.18
Nodes (10): Architecture — Open Smile, Auth architecture, Cross-cutting concerns, Data flow: a smile capture, end to end, Data flow: referrals, Deployment note, Storage boundaries, System overview (+2 more)

### Community 151 - "README.md"
Cohesion: 0.22
Nodes (6): Getting started, mailer (transactional emails: OTP, welcome, login notification, reset password, beta waitlist), Open Smile 😁, Tech stack, What it does, Why it's different

### Community 152 - "Details that make interfaces feel better"
Cohesion: 0.25
Nodes (5): Common Mistakes, Details that make interfaces feel better, Quick Reference, Reference Files, Review Checklist

### Community 153 - "Security — Open Smile"
Cohesion: 0.25
Nodes (8): Auth & session security, Coin ledger integrity, Facial data & privacy, Input handling, Known open items (track before production use), Reporting, Security — Open Smile, Threat model summary

### Community 154 - "apply supabase/migrations/001_init.sql against your Supabase Postgres instance"
Cohesion: 0.33
Nodes (6): apply supabase/migrations/001_init.sql against your Supabase Postgres instance, Core mechanics, briefly, License, Project status, Project structure, Team

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 157 - "Example"
Cohesion: 0.40
Nodes (5): Concentric border radius, Example, Review Output Format, Scale on press, Tabular numbers

### Community 160 - "Colors"
Cohesion: 0.67
Nodes (3): Colors, Do, Don't

### Community 161 - "Typography"
Cohesion: 0.67
Nodes (3): Do, Don't, Typography

### Community 165 - "button.tsx"
Cohesion: 0.13
Nodes (10): filters, metadata, posts, metadata, stats, steps, AuthGateOverlayProps, ImageUpload() (+2 more)

## Knowledge Gaps
- **518 isolated node(s):** `runtime`, `highlights`, `metadata`, `recentActivity`, `mobileNavSections` (+513 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1090 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `app/layout.tsx`, `dashboard/sidebar.tsx`, `icons.tsx`, `settings-shared.tsx`, `profile-content.tsx`, `rewards/page.tsx`, `leaderboard-card.tsx`, `highlight.tsx`, `alert-dialog.tsx`, `capture-flow.tsx`, `collapsible.tsx`, `verify-otp/page.tsx`, `utils.ts`, `button.tsx`, `combobox.tsx`, `smile-result-screen.tsx`, `ios-install-guide.tsx`, `ui/sheet.tsx`, `badge.tsx`, `score-reveal.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `verify-otp/page.tsx`, `radix/sidebar.tsx`, `cn`, `combobox.tsx`, `smile-result-screen.tsx`, `app/layout.tsx`, `icons.tsx`, `ios-install-guide.tsx`, `settings-shared.tsx`, `app/page.tsx`, `profile-content.tsx`, `rewards/page.tsx`, `logo.tsx`, `alert-dialog.tsx`, `capture-flow.tsx`, `_client.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `auth` connect `mailer/index.ts` to `dashboard/sidebar.tsx`, `icons.tsx`, `rateLimit`, `auth/index.ts`, `app/page.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `highlights`, `metadata` to the rest of the system?**
  _518 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._