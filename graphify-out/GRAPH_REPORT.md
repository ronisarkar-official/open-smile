# Graph Report - open-smile  (2026-09-02)

## Corpus Check
- 277 files · ~236,646 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2455 nodes · 4258 edges · 180 communities (111 shown, 63 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a201d071`
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
- rewards/page.tsx
- requireServerUser
- routers/rewards.py
- compilerOptions
- devDependencies
- (dashboard)/explore/page.tsx
- components.json
- profile-content.tsx
- requireServerAdmin
- app/page.tsx
- utils.ts
- icons.tsx
- leaderboard-card.tsx
- highlight.tsx
- Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)
- getPool
- upload/route.ts
- logo.tsx
- database.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- capture-flow.tsx
- otp.ts
- test_backend.py
- session.ts
- routers/refer.py
- Admin Control Panel & Full Feature Management System
- ExceptionInfo
- ExceptionInfo
- scratch-card-gallery.tsx
- routers/streaks.py
- Surfaces
- app/layout.tsx
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
- badge.tsx
- next.config.ts
- my-team.tsx
- smile-result-screen.tsx
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
- @imagekit/nodejs
- input-otp
- Contextual Icon Animations
- collections.ts
- motion
- nodemailer
- pg
- radix-ui
- AdminUsersPage
- @radix-ui/react-alert-dialog
- ios-install-guide.tsx
- Scale on Press
- @radix-ui/react-icons
- @radix-ui/react-label
- @radix-ui/react-navigation-menu
- admin/settings/page.tsx
- verify-otp/page.tsx
- index.py
- auth/index.ts
- @types/nodemailer
- LoginForm
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
- SignupForm
- reward-calculator.ts
- Colors
- Typography
- CLAUDE.md
- copilot-instructions.md
- schema.md
- capture-celebration-overlay.tsx
- toast.tsx
- footer.tsx
- use-system-settings.tsx
- clsx
- @floating-ui/react
- activity-marquee.tsx
- logAdminAction
- @radix-ui/react-slot
- AdminCapturesPage
- shadcn
- tailwind-merge
- scripts
- next
- @supabase/supabase-js

## God Nodes (most connected - your core abstractions)
1. `cn()` - 235 edges
2. `ModuleFactory()` - 120 edges
3. `getPool()` - 76 edges
4. `Button()` - 45 edges
5. `requireServerAdmin()` - 37 edges
6. `requireServerUser()` - 31 edges
7. `useToast()` - 23 edges
8. `rateLimit()` - 19 edges
9. `Core Principles` - 17 edges
10. `getUserCoinBalance()` - 16 edges

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

## Communities (180 total, 63 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "mailer/index.ts"
Cohesion: 0.12
Nodes (29): { GET, POST, PATCH, PUT, DELETE }, POST(), GET(), getPreviewHtml(), POST(), TestMailClient(), auth, sendBetaWaitlistEmail() (+21 more)

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.06
Nodes (43): SheetCloseProps, SheetContent(), SheetContentProps, SheetDescriptionProps, SheetFooter(), SheetFooterProps, SheetHeaderProps, SheetOverlay() (+35 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.03
Nodes (74): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+66 more)

### Community 6 - "cn"
Cohesion: 0.04
Nodes (70): AdminSidebar(), NAV_ITEMS, Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps (+62 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.06
Nodes (43): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+35 more)

### Community 8 - "rewards/page.tsx"
Cohesion: 0.17
Nodes (19): ExplorePage(), badges, milestones, ClaimedVouchersList(), ClaimedVouchersListProps, VoucherClaimModal(), VoucherClaimModalProps, ClaimedVoucher (+11 more)

### Community 9 - "requireServerUser"
Cohesion: 0.08
Nodes (27): dynamic, POST(), dynamic, POST(), revalidate, dynamic, GET(), revalidate (+19 more)

### Community 10 - "routers/rewards.py"
Cohesion: 0.18
Nodes (28): BadgeItem, ClaimedVoucherResponse, ClaimVoucherRequest, BaseModel, ScratchCardActionResult, ScratchCardModel, ScratchCardsListResponse, SignupBonusResponse (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "devDependencies"
Cohesion: 0.10
Nodes (21): concurrently, eslint, eslint-config-next, devDependencies, concurrently, eslint, eslint-config-next, tailwindcss (+13 more)

### Community 13 - "(dashboard)/explore/page.tsx"
Cohesion: 0.16
Nodes (14): ExplorePost, filters, defaultProfile, PublicProfilePage(), UserProfileData, AvatarUpload(), AvatarUploadProps, sizeClasses (+6 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 15 - "profile-content.tsx"
Cohesion: 0.12
Nodes (23): mobileNavSections, SettingsPage(), SettingsDialog(), SettingsDialogProps, NotificationsContent(), PreferencesContent(), AccountItem, ProfileContent() (+15 more)

### Community 16 - "requireServerAdmin"
Cohesion: 0.07
Nodes (33): dynamic, POST(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+25 more)

### Community 17 - "app/page.tsx"
Cohesion: 0.11
Nodes (12): FinalCta(), Footer(), Hero(), HowItWorks(), StepItem, STEPS, TRUST_POINTS, TrustPoint (+4 more)

### Community 18 - "utils.ts"
Cohesion: 0.07
Nodes (31): AdminExplorePage(), fetchPosts(), handleDeletePost(), AdminLogsPage(), AdminDashboardPage(), AdminVouchersPage(), fetchData(), handleSeedVouchers() (+23 more)

### Community 19 - "icons.tsx"
Cohesion: 0.14
Nodes (18): AppNotification, INITIAL_NOTIFICATIONS, NotificationCategory, NotificationsPage(), DashboardStats, DashboardView(), DashboardViewProps, RecentSmile (+10 more)

### Community 20 - "leaderboard-card.tsx"
Cohesion: 0.08
Nodes (28): metadata, LeaderboardView(), PeriodData, runOptions, ShimmerLine(), formatRangeDate(), LeaderboardCard, LeaderboardCardProps (+20 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "Open Smile — Backend Architecture & Implementation Gap Analysis (FastAPI on Vercel)"
Cohesion: 0.06
Nodes (33): 1.1 Smile Capture & Anti-Cheat Pipeline (Subal), 1.2 Streak & Freeze Management (Subal), 1.3 Refer & Earn Program (Subal), 1.4 Serverless Maintenance Crons & Health Check (Subal), 1. System Architecture: Next.js + Python FastAPI (Vercel Serverless), 2.1 Leaderboard & Podium Engine (Akash), 2.2 Rewards & Voucher Marketplace (Akash), 2.3 Explore Feed & Social Smiles (Akash) (+25 more)

### Community 23 - "getPool"
Cohesion: 0.10
Nodes (30): dynamic, GET(), revalidate, dynamic, GET(), revalidate, POST(), dynamic (+22 more)

### Community 24 - "upload/route.ts"
Cohesion: 0.24
Nodes (14): GET(), ALLOWED_MIME_TYPES, DELETE(), isImageKitUrl(), POST(), sanitizeFileName(), sanitizeFolder(), deleteFromImageKit() (+6 more)

### Community 25 - "logo.tsx"
Cohesion: 0.15
Nodes (7): highlights, runtime, metadata, Logo(), LogoProps, links, Navbar()

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

### Community 31 - "capture-flow.tsx"
Cohesion: 0.13
Nodes (23): metadata, AuthGateOverlay(), AuthGateOverlayProps, CaptureFlow(), CaptureFlowProps, CapturePhase, requestCameraStream(), WebcamView (+15 more)

### Community 32 - "otp.ts"
Cohesion: 0.18
Nodes (18): getClientIp(), POST(), globalAny, hashOtp(), InMemoryOtpRecord, isDbConfigured(), OTP_MAX_ATTEMPTS, OTP_TTL_MS (+10 more)

### Community 33 - "test_backend.py"
Cohesion: 0.13
Nodes (25): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+17 more)

### Community 34 - "session.ts"
Cohesion: 0.13
Nodes (19): AdminLayout(), metadata, POST(), dynamic, formatTimeAgo(), GET(), getAvatarLetters(), revalidate (+11 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.21
Nodes (17): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+9 more)

### Community 36 - "Admin Control Panel & Full Feature Management System"
Cohesion: 0.12
Nodes (16): Admin Control Panel & Full Feature Management System, Admin UI Components & Pages, Authentication & API Layer, Automated / API Verification, Database Layer, Key Features & Structure, Manual UI Verification, [MODIFY] [backend/auth/session.ts](file:///d:/open-smile/backend/auth/session.ts) (+8 more)

### Community 39 - "scratch-card-gallery.tsx"
Cohesion: 0.15
Nodes (12): RewardsPage(), ScratchCardGallery(), ScratchCardTile(), ScratchCardTileProps, BACKDROP_TRANSITION, PANEL_TRANSITION, ScratchCardItem, ScratchCardModal() (+4 more)

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "app/layout.tsx"
Cohesion: 0.11
Nodes (19): inter, metadata, sora, spaceGrotesk, spaceMono, viewport, PwaInstallBanner(), PwaContext (+11 more)

### Community 43 - "1. Product / Gameplay Rules"
Cohesion: 0.09
Nodes (22): 1. Product / Gameplay Rules, 2. Engineering Rules, 3. Contribution Rules, Anti-cheat (do not remove without a replacement), Auth, Before submitting any change, Branching, Code style (+14 more)

### Community 44 - "Core Principles"
Cohesion: 0.12
Nodes (17): 10. Text Wrapping, 11. Image Outlines, 12. Scale on Press, 13. Skip Animation on Page Load, 14. Never Use `transition: all`, 15. Use `will-change` Sparingly, 16. Minimum Hit Area, 1. Concentric Border Radius (+9 more)

### Community 45 - "dependencies"
Cohesion: 0.09
Nodes (23): @base-ui/react, better-auth, lucide-react, @mediapipe/tasks-vision, dependencies, @base-ui/react, better-auth, lucide-react (+15 more)

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

### Community 54 - "badge.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "my-team.tsx"
Cohesion: 0.21
Nodes (9): AkashIllustration(), AyushiIllustration(), RoniIllustration(), SohanIllustration(), SubalIllustration(), IllustrationProps, defaultTeamMembers, MyTeamProps (+1 more)

### Community 57 - "smile-result-screen.tsx"
Cohesion: 0.19
Nodes (10): NeubrutalistPhotoCard(), NeubrutalistPhotoCardProps, AI_REACTIONS, AiReaction, CONFETTI_COLORS, getAiReaction(), getScoreBarColor(), getVibeLabel() (+2 more)

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

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "collections.ts"
Cohesion: 0.11
Nodes (26): dynamic, POST(), DELETE(), dynamic, GET(), dynamic, GET(), revalidate (+18 more)

### Community 103 - "AdminUsersPage"
Cohesion: 0.62
Nodes (7): AdminUsersPage(), fetchUsers(), handleAdjustCoins(), handleBanToggle(), handleDeleteUser(), handleRoleChange(), openUserDetail()

### Community 105 - "ios-install-guide.tsx"
Cohesion: 0.29
Nodes (8): IosInstallGuide(), IosInstallGuideProps, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 110 - "admin/settings/page.tsx"
Cohesion: 0.14
Nodes (8): AdminSettingsPage(), ANTI_CHEAT_NUMBERS, ANTI_CHEAT_SWITCHES, ECONOMY_NUMBERS, FEATURE_SWITCHES, SettingNumberConfig, SettingToggleConfig, Switch()

### Community 111 - "verify-otp/page.tsx"
Cohesion: 0.36
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 112 - "index.py"
Cohesion: 0.22
Nodes (12): health_check(), lifespan(), get, redirect_docs(), close_db_pool(), ActivityItem, ActivityRecentResponse, BaseModel (+4 more)

### Community 114 - "auth/index.ts"
Cohesion: 0.10
Nodes (33): getClientIp(), invalidCredentials(), POST(), getClientIp(), POST(), POST(), getClientIp(), POST() (+25 more)

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

### Community 159 - "reward-calculator.ts"
Cohesion: 0.38
Nodes (6): calculateSmileCoins(), CoinCalculationResult, getTier(), mulberry32(), SMILE_TIERS, SmileTier

### Community 160 - "Colors"
Cohesion: 0.67
Nodes (3): Colors, Do, Don't

### Community 161 - "Typography"
Cohesion: 0.67
Nodes (3): Do, Don't, Typography

### Community 165 - "capture-celebration-overlay.tsx"
Cohesion: 0.33
Nodes (5): BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin

### Community 166 - "toast.tsx"
Cohesion: 0.32
Nodes (6): AlertToast, AlertToastProps, alertToastVariants, iconColorClasses, iconMap, Toaster()

### Community 167 - "footer.tsx"
Cohesion: 0.33
Nodes (5): defaultBottomLinks, defaultFooterColumns, FooterColumn, FooterLinkItem, FooterProps

### Community 168 - "use-system-settings.tsx"
Cohesion: 0.33
Nodes (5): DEFAULT_SETTINGS, SystemSettingsContext, SystemSettingsContextValue, SystemSettingsProvider(), SystemSettingsState

### Community 172 - "logAdminAction"
Cohesion: 0.15
Nodes (16): dynamic, POST(), DELETE(), dynamic, dynamic, POST(), dynamic, POST() (+8 more)

### Community 174 - "AdminCapturesPage"
Cohesion: 1.00
Nodes (3): AdminCapturesPage(), fetchCaptures(), handleFlagCapture()

### Community 178 - "scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:py, lint (+3 more)

## Knowledge Gaps
- **589 isolated node(s):** `runtime`, `highlights`, `metadata`, `dynamic`, `revalidate` (+584 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1196 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `rewards/page.tsx`, `(dashboard)/explore/page.tsx`, `profile-content.tsx`, `utils.ts`, `icons.tsx`, `leaderboard-card.tsx`, `highlight.tsx`, `capture-flow.tsx`, `session.ts`, `toast.tsx`, `scratch-card-gallery.tsx`, `AdminCapturesPage`, `badge.tsx`, `smile-result-screen.tsx`, `score-reveal.tsx`, `combobox.tsx`, `AdminUsersPage`, `ios-install-guide.tsx`, `admin/settings/page.tsx`, `verify-otp/page.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Button()` connect `utils.ts` to `radix/sidebar.tsx`, `cn`, `scratch-card-gallery.tsx`, `rewards/page.tsx`, `ios-install-guide.tsx`, `app/layout.tsx`, `(dashboard)/explore/page.tsx`, `admin/settings/page.tsx`, `profile-content.tsx`, `verify-otp/page.tsx`, `app/page.tsx`, `icons.tsx`, `logo.tsx`, `smile-result-screen.tsx`, `combobox.tsx`, `capture-flow.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `otp.ts`, `session.ts`, `collections.ts`, `requireServerUser`, `logAdminAction`, `requireServerAdmin`, `auth/index.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `highlights`, `metadata` to the rest of the system?**
  _589 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._