# Graph Report - open-smile  (2026-09-03)

## Corpus Check
- 289 files · ~251,136 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2534 nodes · 4486 edges · 199 communities (116 shown, 77 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 105 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1381bb5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- _client.tsx
- components/radix/sheet.tsx
- radix/sidebar.tsx
- cn
- primitives/animate/tooltip.tsx
- session.ts
- app/layout.tsx
- routers/rewards.py
- compilerOptions
- devDependencies
- getPool
- components.json
- utils.ts
- db/index.ts
- app/page.tsx
- logo.tsx
- radix/dropdown-menu.tsx
- my-team.tsx
- highlight.tsx
- Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)
- collections.ts
- upload/route.ts
- icons.tsx
- database.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- verify-otp/page.tsx
- admin/layout.tsx
- test_backend.py
- voucher-marketplace.tsx
- routers/refer.py
- button.tsx
- ExceptionInfo
- ExceptionInfo
- capture-flow.tsx
- routers/streaks.py
- Surfaces
- smile-result-screen.tsx
- 1. Product / Gameplay Rules
- Core Principles
- dependencies
- routers/explore.py
- createLazyFile
- createLazyFile
- AGENTS.md — Open Smile
- Image Outlines
- createWasm
- dependencies.py
- DESIGN.md
- Admin Control Panel & Full Feature Management System
- next.config.ts
- streak/page.tsx
- scratch-card-gallery.tsx
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
- users.py
- @better-auth/infra
- class-variance-authority
- routers/leaderboard.py
- eslint.config.mjs
- combobox.tsx
- @imagekit/next
- users/[id]/route.ts
- vouchers/route.ts
- Contextual Icon Animations
- badge.tsx
- webcam-view.tsx
- refer/page.tsx
- pg
- rewards/page.tsx
- AdminUsersPage
- @radix-ui/react-alert-dialog
- dashboard-view.tsx
- Scale on Press
- framer-motion
- @radix-ui/react-label
- @radix-ui/react-navigation-menu
- useToast
- @imagekit/nodejs
- index.py
- auth/index.ts
- reward-calculator.ts
- motion
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
- streak-view.tsx
- nodemailer
- Colors
- Typography
- CLAUDE.md
- copilot-instructions.md
- schema.md
- @number-flow/react
- capture-celebration-overlay.tsx
- getUserCoinBalance
- settings/route.ts
- clsx
- @floating-ui/react
- [username]/route.ts
- logAdminAction
- @radix-ui/react-slot
- radix-ui
- shadcn
- tailwind-merge
- @mediapipe/tasks-vision
- @radix-ui/react-checkbox
- @radix-ui/react-accordion
- @radix-ui/react-dialog
- @radix-ui/react-icons
- react
- react-dom
- @vercel/analytics
- next
- footer.tsx
- LivenessDetector
- input-otp
- lucide-react
- qrcode
- tw-animate-css
- ui/animated-number-countdown.tsx
- @types/qrcode
- leaderboard/page.tsx
- activity-marquee.tsx
- RewardsPage
- auth-gate-overlay.tsx
- generatePHash

## God Nodes (most connected - your core abstractions)
1. `cn()` - 244 edges
2. `ModuleFactory()` - 120 edges
3. `getPool()` - 86 edges
4. `Button()` - 48 edges
5. `requireServerAdmin()` - 38 edges
6. `requireServerUser()` - 31 edges
7. `useToast()` - 23 edges
8. `getSystemSettingsMap()` - 19 edges
9. `rateLimit()` - 19 edges
10. `CaptureFlow()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `NotificationsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/notifications/page.tsx → lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (199 total, 77 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "_client.tsx"
Cohesion: 0.09
Nodes (36): { GET, POST, PATCH, PUT, DELETE }, POST(), getClientIp(), POST(), GET(), getPreviewHtml(), POST(), TemplateOption (+28 more)

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.06
Nodes (43): SheetCloseProps, SheetContent(), SheetContentProps, SheetDescriptionProps, SheetFooter(), SheetFooterProps, SheetHeaderProps, SheetOverlay() (+35 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.04
Nodes (62): Sheet(), SheetDescription(), SheetHeader(), SheetTitle(), [LocalSidebarProvider, useSidebar], Sidebar(), SidebarContent(), SidebarContentProps (+54 more)

### Community 6 - "cn"
Cohesion: 0.03
Nodes (80): SettingsPage(), Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps, ShimmerLine() (+72 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.06
Nodes (43): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+35 more)

### Community 8 - "session.ts"
Cohesion: 0.08
Nodes (31): dynamic, POST(), POST(), dynamic, POST(), revalidate, dynamic, POST() (+23 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.09
Nodes (22): inter, metadata, sora, spaceGrotesk, spaceMono, viewport, PwaInstallBanner(), IosInstallGuide() (+14 more)

### Community 10 - "routers/rewards.py"
Cohesion: 0.19
Nodes (28): BadgeItem, ClaimedVoucherResponse, ClaimVoucherRequest, BaseModel, ScratchCardActionResult, ScratchCardModel, ScratchCardsListResponse, SignupBonusResponse (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "devDependencies"
Cohesion: 0.06
Nodes (32): concurrently, eslint, eslint-config-next, devDependencies, concurrently, eslint, eslint-config-next, tailwindcss (+24 more)

### Community 13 - "getPool"
Cohesion: 0.10
Nodes (32): dynamic, GET(), revalidate, dynamic, GET(), revalidate, POST(), dynamic (+24 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 15 - "utils.ts"
Cohesion: 0.08
Nodes (40): ExplorePost, filters, dynamic, JoinPageProps, ReferralTracker(), ReferralTrackerProps, defaultProfile, PublicProfilePage() (+32 more)

### Community 16 - "db/index.ts"
Cohesion: 0.07
Nodes (37): dynamic, POST(), dynamic, GET(), DELETE(), dynamic, dynamic, GET() (+29 more)

### Community 17 - "app/page.tsx"
Cohesion: 0.11
Nodes (12): FinalCta(), Footer(), Hero(), HowItWorks(), StepItem, STEPS, TRUST_POINTS, TrustPoint (+4 more)

### Community 18 - "logo.tsx"
Cohesion: 0.21
Nodes (4): highlights, runtime, Logo(), LogoProps

### Community 19 - "radix/dropdown-menu.tsx"
Cohesion: 0.13
Nodes (14): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+6 more)

### Community 20 - "my-team.tsx"
Cohesion: 0.21
Nodes (9): AkashIllustration(), AyushiIllustration(), RoniIllustration(), SohanIllustration(), SubalIllustration(), IllustrationProps, defaultTeamMembers, MyTeamProps (+1 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)"
Cohesion: 0.06
Nodes (33): 1.1 Smile Capture & Anti-Cheat Pipeline (Subal), 1.2 Streak & Freeze Management (Subal), 1.3 Refer & Earn Program (Subal), 1.4 Serverless Maintenance Crons & Health Check (Subal), 1. System Architecture: Next.js + Python FastAPI (Vercel Serverless), 2.1 Leaderboard & Podium Engine (Akash), 2.2 Rewards & Voucher Marketplace (Akash), 2.3 Explore Feed & Social Smiles (Akash) (+25 more)

### Community 23 - "collections.ts"
Cohesion: 0.11
Nodes (27): POST(), getClientIp(), getSessionCookieName(), POST(), sendLoginNotification(), setSessionCookie(), JoinPage(), BetaWaitlistRow (+19 more)

### Community 24 - "upload/route.ts"
Cohesion: 0.24
Nodes (14): GET(), ALLOWED_MIME_TYPES, DELETE(), isImageKitUrl(), POST(), sanitizeFileName(), sanitizeFolder(), deleteFromImageKit() (+6 more)

### Community 25 - "icons.tsx"
Cohesion: 0.22
Nodes (12): AppNotification, INITIAL_NOTIFICATIONS, NotificationCategory, NotificationsPage(), CoinIconProps, UserCoinBalance(), UserCoinBalanceProps, useUserCoins() (+4 more)

### Community 26 - "database.py"
Cohesion: 0.23
Nodes (15): get_settings(), Settings, ensure_db_tables(), get_db_pool(), init_db_pool(), Pool, get, Pool (+7 more)

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

### Community 31 - "verify-otp/page.tsx"
Cohesion: 0.36
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 32 - "admin/layout.tsx"
Cohesion: 0.24
Nodes (7): AdminLayout(), metadata, isUserAdmin(), AdminBootstrapClient(), AdminHeader(), AdminSidebar(), NAV_ITEMS

### Community 33 - "test_backend.py"
Cohesion: 0.13
Nodes (25): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+17 more)

### Community 34 - "voucher-marketplace.tsx"
Cohesion: 0.13
Nodes (20): ExplorePage(), ClaimedVouchersListProps, VoucherClaimModal(), VoucherClaimModalProps, ClaimedVoucher, INITIAL_CLAIMED_VOUCHERS, VOUCHER_CATEGORIES, VoucherBrand (+12 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.21
Nodes (17): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+9 more)

### Community 36 - "button.tsx"
Cohesion: 0.07
Nodes (32): CatalogVoucher, LoginForm(), SignupForm(), mobileNavSections, metadata, GitHubIcon(), GoogleIcon(), links (+24 more)

### Community 39 - "capture-flow.tsx"
Cohesion: 0.25
Nodes (11): metadata, CaptureFlow(), CaptureFlowProps, CapturePhase, getNextIndianMidnight(), getAudioContext(), playCountdownBeep(), playRewardChime() (+3 more)

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "smile-result-screen.tsx"
Cohesion: 0.19
Nodes (10): NeubrutalistPhotoCard(), NeubrutalistPhotoCardProps, AI_REACTIONS, AiReaction, CONFETTI_COLORS, getAiReaction(), getScoreBarColor(), getVibeLabel() (+2 more)

### Community 43 - "1. Product / Gameplay Rules"
Cohesion: 0.09
Nodes (22): 1. Product / Gameplay Rules, 2. Engineering Rules, 3. Contribution Rules, Anti-cheat (do not remove without a replacement), Auth, Before submitting any change, Branching, Code style (+14 more)

### Community 44 - "Core Principles"
Cohesion: 0.12
Nodes (17): 10. Text Wrapping, 11. Image Outlines, 12. Scale on Press, 13. Skip Animation on Page Load, 14. Never Use `transition: all`, 15. Use `will-change` Sparingly, 16. Minimum Hit Area, 1. Concentric Border Radius (+9 more)

### Community 45 - "dependencies"
Cohesion: 0.22
Nodes (9): @base-ui/react, better-auth, dependencies, @base-ui/react, better-auth, @supabase/supabase-js, @types/nodemailer, @supabase/supabase-js (+1 more)

### Community 46 - "routers/explore.py"
Cohesion: 0.26
Nodes (15): CreatePostRequest, CreatePostResponse, ExploreFeedResponse, ExplorePostItem, LikeToggleResponse, BaseModel, create_explore_post(), format_time_ago() (+7 more)

### Community 47 - "createLazyFile"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 48 - "createLazyFile"
Cohesion: 0.31
Nodes (7): createLazyFile(), stream_ops, writeChunks(), get_char(), mmap(), position(), read()

### Community 49 - "AGENTS.md — Open Smile"
Cohesion: 0.17
Nodes (12): AGENTS.md — Open Smile, Anti-cheat — do not weaken these without discussion, Auth conventions, Before submitting changes, Codebase Knowledge Graph (Graphify), Current build status, Database conventions, Design system (+4 more)

### Community 50 - "Image Outlines"
Cohesion: 0.40
Nodes (5): Color rules (non-negotiable), Dark Mode, Image Outlines, Light Mode, Tailwind with Dark Mode

### Community 51 - "createWasm"
Cohesion: 0.29
Nodes (8): assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), getWasmImports(), locateFile(), updateMemoryViews()

### Community 52 - "dependencies.py"
Cohesion: 0.24
Nodes (13): extract_session_token_candidates(), get_current_user(), get_optional_user(), Any, Pool, Request, override_auth(), anyio (+5 more)

### Community 53 - "DESIGN.md"
Cohesion: 0.17
Nodes (11): Accessibility Checkpoint, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Physics, Shapes (+3 more)

### Community 54 - "Admin Control Panel & Full Feature Management System"
Cohesion: 0.12
Nodes (16): Admin Control Panel & Full Feature Management System, Admin UI Components & Pages, Authentication & API Layer, Automated / API Verification, Database Layer, Key Features & Structure, Manual UI Verification, [MODIFY] [backend/auth/session.ts](file:///d:/open-smile/backend/auth/session.ts) (+8 more)

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "streak/page.tsx"
Cohesion: 0.22
Nodes (9): dynamic, GET(), revalidate, dynamic, metadata, revalidate, StreakPage(), calculateStreakMultiplier() (+1 more)

### Community 57 - "scratch-card-gallery.tsx"
Cohesion: 0.18
Nodes (11): ScratchCardGallery(), ScratchCardTile(), ScratchCardTileProps, BACKDROP_TRANSITION, PANEL_TRANSITION, ScratchCardItem, ScratchCardModal(), ScratchCardModalProps (+3 more)

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

### Community 88 - "users.py"
Cohesion: 0.26
Nodes (12): PublicUserProfile, BaseModel, UserProfile, format_activity_time(), get_avatar_letters(), get_my_coin_balance(), get_my_dashboard_stats(), get_smile_quality() (+4 more)

### Community 91 - "routers/leaderboard.py"
Cohesion: 0.44
Nodes (8): LeaderboardResponse, PodiumEntry, BaseModel, RankingEntry, UserRank, get_leaderboard(), get, Pool

### Community 93 - "combobox.tsx"
Cohesion: 0.21
Nodes (9): Combobox(), ComboboxOption, ComboboxProps, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+1 more)

### Community 95 - "users/[id]/route.ts"
Cohesion: 0.47
Nodes (5): DELETE(), dynamic, GET(), adminDeleteUser(), getAdminUserDetail()

### Community 96 - "vouchers/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, GET(), POST(), createAdminVoucher(), getAdminVouchers()

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 99 - "webcam-view.tsx"
Cohesion: 0.25
Nodes (11): requestCameraStream(), WebcamView, WebcamViewHandle, WebcamViewProps, computeSmileScore(), createLandmarker(), detectSmile(), distance() (+3 more)

### Community 100 - "refer/page.tsx"
Cohesion: 0.14
Nodes (12): ReferPage(), ReferStatsData, steps, IosInstallGuideProps, BrandedQrCode(), BrandedQrCodeProps, DialogContent, DialogDescription (+4 more)

### Community 102 - "rewards/page.tsx"
Cohesion: 0.48
Nodes (4): STREAK_BADGES, STREAK_MILESTONES, ClaimedVouchersList(), CoinIcon()

### Community 103 - "AdminUsersPage"
Cohesion: 0.62
Nodes (7): AdminUsersPage(), fetchUsers(), handleAdjustCoins(), handleBanToggle(), handleDeleteUser(), handleRoleChange(), openUserDetail()

### Community 105 - "dashboard-view.tsx"
Cohesion: 0.29
Nodes (6): DashboardStats, DashboardView(), DashboardViewProps, RecentSmile, COIN_BALANCE_EVENT, USER_STREAK_EVENT

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 110 - "useToast"
Cohesion: 0.05
Nodes (34): AdminCapturesPage(), fetchCaptures(), handleFlagCapture(), AdminExplorePage(), fetchPosts(), handleDeletePost(), AdminLogsPage(), AdminDashboardPage() (+26 more)

### Community 112 - "index.py"
Cohesion: 0.22
Nodes (12): health_check(), lifespan(), get, redirect_docs(), close_db_pool(), ActivityItem, ActivityRecentResponse, BaseModel (+4 more)

### Community 114 - "auth/index.ts"
Cohesion: 0.09
Nodes (36): getClientIp(), invalidCredentials(), POST(), getClientIp(), POST(), getClientIp(), POST(), getClientIp() (+28 more)

### Community 115 - "reward-calculator.ts"
Cohesion: 0.38
Nodes (6): calculateSmileCoins(), CoinCalculationResult, getTier(), mulberry32(), SMILE_TIERS, SmileTier

### Community 146 - "Animations"
Cohesion: 0.13
Nodes (14): Animations, Code Example, CSS-Only Stagger, CSS Transitions vs. Keyframes, Enter Animations: Split and Stagger, Exit Animations, Full Exit (When Context Matters), Good vs. Bad (+6 more)

### Community 147 - "Transition Only What Changes"
Cohesion: 0.18
Nodes (10): CSS Example, Performance, Rules, Tailwind, Tailwind `transition-transform` Note, Transition Only What Changes, Use `will-change` Sparingly, Useful Properties (+2 more)

### Community 148 - "Typography"
Cohesion: 0.17
Nodes (11): Caveat, Font Family Scope, Font Smoothing (macOS), Good vs. Bad, Tabular Numbers, text-wrap: balance, text-wrap: pretty, Text Wrapping (+3 more)

### Community 149 - "Architecture — Open Smile"
Cohesion: 0.18
Nodes (10): Architecture — Open Smile, Auth architecture, Cross-cutting concerns, Data flow: a smile capture, end to end, Data flow: referrals, Deployment note, Storage boundaries, System overview (+2 more)

### Community 151 - "README.md"
Cohesion: 0.22
Nodes (6): Getting started, mailer (transactional emails: OTP, welcome, login notification, reset password, beta waitlist), Open Smile 😁, Tech stack, What it does, Why it's different

### Community 152 - "Details that make interfaces feel better"
Cohesion: 0.17
Nodes (10): Common Mistakes, Concentric border radius, Details that make interfaces feel better, Example, Quick Reference, Reference Files, Review Checklist, Review Output Format (+2 more)

### Community 153 - "Security — Open Smile"
Cohesion: 0.25
Nodes (8): Auth & session security, Coin ledger integrity, Facial data & privacy, Input handling, Known open items (track before production use), Reporting, Security — Open Smile, Threat model summary

### Community 154 - "apply supabase/migrations/001_init.sql against your Supabase Postgres instance"
Cohesion: 0.33
Nodes (6): apply supabase/migrations/001_init.sql against your Supabase Postgres instance, Core mechanics, briefly, License, Project status, Project structure, Team

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 158 - "streak-view.tsx"
Cohesion: 0.40
Nodes (5): UserStreakFullDetails, MILESTONES, StreakView(), updateCountdown(), StreakViewProps

### Community 160 - "Colors"
Cohesion: 0.67
Nodes (3): Colors, Do, Don't

### Community 161 - "Typography"
Cohesion: 0.67
Nodes (3): Do, Don't, Typography

### Community 166 - "capture-celebration-overlay.tsx"
Cohesion: 0.33
Nodes (5): BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin

### Community 167 - "getUserCoinBalance"
Cohesion: 0.19
Nodes (15): dynamic, GET(), revalidate, dynamic, GET(), revalidate, DashboardPage(), dynamic (+7 more)

### Community 168 - "settings/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, GET(), POST(), getSystemSettings(), updateSystemSetting()

### Community 171 - "[username]/route.ts"
Cohesion: 0.50
Nodes (4): dynamic, GET(), getAvatarLetters(), revalidate

### Community 172 - "logAdminAction"
Cohesion: 0.28
Nodes (10): dynamic, POST(), dynamic, POST(), POST(), adminAdjustUserCoins(), cleanupExpiredExplorePosts(), cleanupExpiredOtpCodes() (+2 more)

### Community 186 - "footer.tsx"
Cohesion: 0.33
Nodes (5): defaultBottomLinks, defaultFooterColumns, FooterColumn, FooterLinkItem, FooterProps

### Community 192 - "ui/animated-number-countdown.tsx"
Cohesion: 0.33
Nodes (4): AnimatedNumberCountdown(), CountdownProps, MotionNumberFlow, TimeLeft

## Knowledge Gaps
- **611 isolated node(s):** `runtime`, `highlights`, `metadata`, `dynamic`, `revalidate` (+606 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1224 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **77 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `utils.ts`, `radix/dropdown-menu.tsx`, `highlight.tsx`, `icons.tsx`, `streak-view.tsx`, `verify-otp/page.tsx`, `admin/layout.tsx`, `voucher-marketplace.tsx`, `button.tsx`, `smile-result-screen.tsx`, `scratch-card-gallery.tsx`, `score-reveal.tsx`, `RewardsPage`, `combobox.tsx`, `badge.tsx`, `webcam-view.tsx`, `refer/page.tsx`, `rewards/page.tsx`, `AdminUsersPage`, `useToast`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `_client.tsx`, `radix/sidebar.tsx`, `cn`, `app/layout.tsx`, `utils.ts`, `app/page.tsx`, `logo.tsx`, `icons.tsx`, `streak-view.tsx`, `verify-otp/page.tsx`, `voucher-marketplace.tsx`, `capture-flow.tsx`, `smile-result-screen.tsx`, `scratch-card-gallery.tsx`, `auth-gate-overlay.tsx`, `combobox.tsx`, `webcam-view.tsx`, `refer/page.tsx`, `rewards/page.tsx`, `dashboard-view.tsx`, `useToast`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `vouchers/route.ts`, `_client.tsx`, `getUserCoinBalance`, `session.ts`, `settings/route.ts`, `[username]/route.ts`, `logAdminAction`, `db/index.ts`, `auth/index.ts`, `collections.ts`, `streak/page.tsx`, `users/[id]/route.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `highlights`, `metadata` to the rest of the system?**
  _611 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._