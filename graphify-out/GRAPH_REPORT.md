# Graph Report - open-smile  (2026-09-21)

## Corpus Check
- 378 files · ~368,974 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2966 nodes · 5830 edges · 204 communities (125 shown, 67 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc7d5b29`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- admin/layout.tsx
- components/radix/sheet.tsx
- radix/sidebar.tsx
- cn
- primitives/animate/tooltip.tsx
- hand-gesture.ts
- upload/route.ts
- routers/rewards.py
- compilerOptions
- devDependencies
- getSystemSettingsMap
- components.json
- settings-queries.ts
- pwa-provider.tsx
- app/page.tsx
- session.ts
- ui/animated-number-countdown.tsx
- mailer/page.tsx
- highlight.tsx
- leaderboard-card.tsx
- getPool
- feed/route.ts
- dashboard/settings/page.tsx
- cron.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- smile-result-screen.tsx
- LivenessDetector
- test_backend.py
- requireServerAdmin
- routers/refer.py
- utils.ts
- ExceptionInfo
- ExceptionInfo
- dashboard/sidebar.tsx
- routers/streaks.py
- Surfaces
- check-credentials/route.ts
- 1. Product / Gameplay Rules
- Core Principles
- dependencies
- routers/explore.py
- createLazyFile
- createLazyFile
- AGENTS.md — Open Smile
- Image Outlines
- createWasm
- database.py
- DESIGN.md
- button.tsx
- next.config.ts
- ai/client.ts
- getUserPublicProfileByUsername
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
- db/index.ts
- routers/leaderboard.py
- eslint.config.mjs
- my-team.tsx
- profile-content.tsx
- send-otp/route.ts
- captures/route.ts
- Contextual Icon Animations
- [username]/page.tsx
- verify-otp/route.ts
- app/layout.tsx
- auth-layout-client.tsx
- webcam-view.tsx
- try/page.tsx
- about/page.tsx
- Scale on Press
- send-email.ts
- @radix-ui/react-label
- rateLimit
- AdminVouchersPage
- otp-queries.ts
- index.py
- AdminUsersPage
- faq.tsx
- capture-celebration-overlay.tsx
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
- 😁 Open Smile
- Details that make interfaces feel better
- Security — Open Smile
- theme-provider.tsx
- Shadows Instead of Borders
- scripts
- users/[id]/route.ts
- 🚀 Getting Started
- ⚡ Key Features
- CLAUDE.md
- copilot-instructions.md
- beta-join/route.ts
- rewards/page.tsx
- better-auth
- AdminSettingsPage
- radix/checkbox.tsx
- @floating-ui/react
- class-variance-authority
- 🔌 API & Route Reference
- driver.js
- clsx
- radix-ui
- vercel.json
- @radix-ui/react-alert-dialog
- capture-flow.tsx
- @imagekit/nodejs
- motion
- react
- react-dom
- @vercel/analytics
- next
- @radix-ui/react-icons
- pg
- qrcode
- @radix-ui/react-accordion
- @types/nodemailer
- @imagekit/next
- @vercel/speed-insights
- @radix-ui/react-dialog
- shadcn
- voucher-marketplace.tsx
- nodemailer
- slot.tsx
- @radix-ui/react-navigation-menu
- react-markdown
- navbar.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 272 edges
2. `getPool()` - 135 edges
3. `ModuleFactory()` - 120 edges
4. `Button()` - 67 edges
5. `requireServerAdmin()` - 63 edges
6. `requireServerUser()` - 47 edges
7. `useToast()` - 39 edges
8. `getSystemSettingsMap()` - 32 edges
9. `ensureIndexes()` - 30 edges
10. `logAdminAction()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/dashboard/settings/page.tsx → lib/utils.ts
- `TryCapturePage()` --calls--> `getServerUser()`  [EXTRACTED]
  app/(marketing)/try/page.tsx → lib/auth/session.ts
- `handleLogoUpload()` --calls--> `convertToWebP()`  [EXTRACTED]
  app/admin/vouchers/page.tsx → lib/convert-to-webp.ts
- `generateMetadata()` --calls--> `getUserPublicProfileByUsername()`  [EXTRACTED]
  app/u/[username]/page.tsx → lib/db/profile-queries.ts
- `PublicProfilePage()` --calls--> `getUserPublicProfileByUsername()`  [EXTRACTED]
  app/u/[username]/page.tsx → lib/db/profile-queries.ts

## Import Cycles
- 3-file cycle: `lib/db/admin-queries.ts -> lib/db/capture-queries.ts -> lib/db/settings-queries.ts -> lib/db/admin-queries.ts`

## Communities (204 total, 67 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "admin/layout.tsx"
Cohesion: 0.21
Nodes (7): metadata, AdminBootstrapClient(), AdminHeader(), AdminSidebar(), NAV_ITEMS, PageTransition(), PageTransitionProps

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.07
Nodes (38): Sheet(), SheetCloseProps, SheetContent(), SheetContentProps, SheetDescription(), SheetDescriptionProps, SheetFooter(), SheetFooterProps (+30 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.05
Nodes (41): [LocalSidebarProvider, useSidebar], SidebarContentProps, SidebarContextProps, SidebarFooter(), SidebarFooterProps, SidebarGroupAction(), SidebarGroupActionProps, SidebarGroupContent() (+33 more)

### Community 6 - "cn"
Cohesion: 0.03
Nodes (75): generateStars(), StarLayer(), StarLayerProps, StarsBackground(), StarsBackgroundProps, Collapsible(), CollapsibleContent(), CollapsibleContentProps (+67 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.07
Nodes (36): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+28 more)

### Community 8 - "hand-gesture.ts"
Cohesion: 0.36
Nodes (7): createGestureRecognizer(), detectHandGesture(), distance(), evaluateHandFist(), evaluateOpenPalm(), HandGestureResult, initGestureRecognizer()

### Community 9 - "upload/route.ts"
Cohesion: 0.24
Nodes (14): GET(), ALLOWED_MIME_TYPES, DELETE(), isImageKitUrl(), POST(), sanitizeFileName(), sanitizeFolder(), deleteFromImageKit() (+6 more)

### Community 10 - "routers/rewards.py"
Cohesion: 0.19
Nodes (27): BadgeItem, ClaimedVoucherResponse, ClaimVoucherRequest, BaseModel, ScratchCardActionResult, ScratchCardModel, ScratchCardsListResponse, SignupBonusResponse (+19 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "devDependencies"
Cohesion: 0.10
Nodes (21): concurrently, eslint, eslint-config-next, devDependencies, concurrently, eslint, eslint-config-next, tailwindcss (+13 more)

### Community 13 - "getSystemSettingsMap"
Cohesion: 0.14
Nodes (35): GET, POST(), dynamic, GET(), getSmileByline(), revalidate, dynamic, GET() (+27 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 15 - "settings-queries.ts"
Cohesion: 0.19
Nodes (17): AdminCaptureRewardsCardProps, TIER_BADGES, DEFAULT_SETTINGS, SystemSettingsContext, SystemSettingsContextValue, SystemSettingsState, DEFAULT_CAPTURE_REWARD_CONFIG, calculateSmileCoins() (+9 more)

### Community 16 - "pwa-provider.tsx"
Cohesion: 0.33
Nodes (7): PwaInstallBanner(), IosInstallGuide(), PwaContext, PwaProvider(), BeforeInstallPromptEvent, PwaState, usePwa()

### Community 17 - "app/page.tsx"
Cohesion: 0.09
Nodes (14): faqSchema, Faq(), FinalCta(), Hero(), HowItWorks(), StepItem, STEPS, SmoothScroll() (+6 more)

### Community 18 - "session.ts"
Cohesion: 0.05
Nodes (49): AdminLayout(), dynamic, POST(), dynamic, GET(), revalidate, dynamic, POST() (+41 more)

### Community 19 - "ui/animated-number-countdown.tsx"
Cohesion: 0.33
Nodes (4): AnimatedNumberCountdown(), CountdownProps, MotionNumberFlow, TimeLeft

### Community 20 - "mailer/page.tsx"
Cohesion: 0.05
Nodes (57): AdminCapturesPage(), fetchCaptures(), handleFlagCapture(), AdminExplorePage(), fetchPosts(), handleDeletePost(), AdminLogsPage(), AdminMailerPage() (+49 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "leaderboard-card.tsx"
Cohesion: 0.07
Nodes (32): metadata, ContactForm(), SUBJECT_PRESETS, LeaderboardView(), PeriodData, runOptions, ShimmerLine(), StreakView() (+24 more)

### Community 23 - "getPool"
Cohesion: 0.08
Nodes (47): dynamic, GET(), revalidate, GET(), dynamic, POST(), GET(), dynamic (+39 more)

### Community 24 - "feed/route.ts"
Cohesion: 0.24
Nodes (12): dynamic, POST(), GET, POST(), dynamic, formatTimeAgo(), GET(), getAvatarLetters() (+4 more)

### Community 25 - "dashboard/settings/page.tsx"
Cohesion: 0.16
Nodes (16): mobileNavSections, SettingsPage(), SettingsDialog(), SettingsDialogProps, NotificationsContent(), ActionButton(), NAV_GROUPS, NavGroup (+8 more)

### Community 26 - "cron.py"
Cohesion: 0.28
Nodes (11): get_settings(), Settings, get, Pool, post, Request, run_cleanup_cron(), run_keepalive() (+3 more)

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

### Community 31 - "smile-result-screen.tsx"
Cohesion: 0.08
Nodes (24): createFirework(), createParticle(), DEFAULT_FIREWORK_COLORS, FireworksBackground(), FireworksBackgroundProps, FireworkType, getColorFromPalette(), getValueByRange() (+16 more)

### Community 33 - "test_backend.py"
Cohesion: 0.12
Nodes (27): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+19 more)

### Community 34 - "requireServerAdmin"
Cohesion: 0.04
Nodes (62): dynamic, POST(), DELETE(), dynamic, dynamic, GET(), dynamic, GET() (+54 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.22
Nodes (16): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+8 more)

### Community 36 - "utils.ts"
Cohesion: 0.11
Nodes (29): AdminScratchCardItem, dynamic, JoinPageProps, ReferralTracker(), ReferralTrackerProps, MOBILE_NAV_ITEMS, AvatarUpload(), AvatarUploadProps (+21 more)

### Community 39 - "dashboard/sidebar.tsx"
Cohesion: 0.08
Nodes (30): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+22 more)

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "check-credentials/route.ts"
Cohesion: 0.33
Nodes (9): getClientIp(), invalidCredentials(), POST(), resolveRedirectPath(), sendLoginNotification(), getSessionCookieName(), setSessionCookie(), signSessionToken() (+1 more)

### Community 43 - "1. Product / Gameplay Rules"
Cohesion: 0.09
Nodes (22): 1. Product / Gameplay Rules, 2. Engineering Rules, 3. Contribution Rules, Anti-cheat (do not remove without a replacement), Auth, Before submitting any change, Branching, Code style (+14 more)

### Community 44 - "Core Principles"
Cohesion: 0.12
Nodes (17): 10. Text Wrapping, 11. Image Outlines, 12. Scale on Press, 13. Skip Animation on Page Load, 14. Never Use `transition: all`, 15. Use `will-change` Sparingly, 16. Minimum Hit Area, 1. Concentric Border Radius (+9 more)

### Community 45 - "dependencies"
Cohesion: 0.08
Nodes (25): @base-ui/react, input-otp, lenis, lucide-react, @mediapipe/tasks-vision, @number-flow/react, dependencies, @base-ui/react (+17 more)

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
Cohesion: 0.15
Nodes (12): AGENTS.md — Open Smile, Anti-cheat — do not weaken these without discussion, Auth conventions, Before submitting changes, Codebase Knowledge Graph (Graphify), Current build status, Database conventions, Design system (+4 more)

### Community 50 - "Image Outlines"
Cohesion: 0.40
Nodes (5): Color rules (non-negotiable), Dark Mode, Image Outlines, Light Mode, Tailwind with Dark Mode

### Community 51 - "createWasm"
Cohesion: 0.29
Nodes (8): assignWasmExports(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), getWasmImports(), locateFile(), updateMemoryViews()

### Community 52 - "database.py"
Cohesion: 0.16
Nodes (21): ensure_db_tables(), get_db_pool(), init_db_pool(), Pool, extract_session_token_candidates(), get_current_user(), get_optional_user(), Any (+13 more)

### Community 53 - "DESIGN.md"
Cohesion: 0.12
Nodes (16): Accessibility Checkpoint, Border & Radius System, Border Utilities, Border Widths, Color Palette & Theme Tokens, Component Standards, Dark Mode (`.dark`), Elevation, Depth & Shadow System (+8 more)

### Community 54 - "button.tsx"
Cohesion: 0.10
Nodes (24): ExplorePost, filters, ReferPage(), ReferStatsData, steps, EMAIL_PROMPT_CHIPS, NOTIFICATION_PROMPT_CHIPS, TONES (+16 more)

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "ai/client.ts"
Cohesion: 0.16
Nodes (21): dynamic, POST(), dynamic, POST(), AdminAiGeneratorDialogProps, callAICompletion(), generateEmailDraft(), generateNotificationDraft() (+13 more)

### Community 57 - "getUserPublicProfileByUsername"
Cohesion: 0.07
Nodes (28): dynamic, GET(), revalidate, dynamic, GET(), revalidate, dynamic, GET() (+20 more)

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

### Community 90 - "db/index.ts"
Cohesion: 0.08
Nodes (40): POST(), GET(), POST, dynamic, formatCardDate(), POST(), revalidate, dynamic (+32 more)

### Community 91 - "routers/leaderboard.py"
Cohesion: 0.44
Nodes (8): LeaderboardResponse, PodiumEntry, BaseModel, RankingEntry, UserRank, get_leaderboard(), get, Pool

### Community 93 - "my-team.tsx"
Cohesion: 0.16
Nodes (11): AkashIllustration(), AyushiIllustration(), RoniIllustration(), SohanIllustration(), SubalIllustration(), IllustrationProps, defaultTeamMembers, MyTeamProps (+3 more)

### Community 94 - "profile-content.tsx"
Cohesion: 0.07
Nodes (29): CatalogVoucher, CATEGORIES, VOUCHER_TYPES, VoucherType, LoginForm(), SignupForm(), AdminAiSettingsCard(), AdminAiSettingsCardProps (+21 more)

### Community 95 - "send-otp/route.ts"
Cohesion: 0.33
Nodes (8): getClientIp(), POST(), generateOTP(), createAuthTicket(), getSecret(), TicketPayload, verifyAuthTicket(), findUserByEmail()

### Community 96 - "captures/route.ts"
Cohesion: 0.29
Nodes (6): dynamic, GET(), dynamic, GET(), getAdminCaptures(), getAdminVoucherClaims()

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "[username]/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, generateMetadata(), PageProps, PublicProfilePage(), revalidate, PublicProfileView()

### Community 99 - "verify-otp/route.ts"
Cohesion: 0.27
Nodes (12): POST(), getClientIp(), POST(), resolveRedirectPath(), sendLoginNotification(), createSessionForUser(), createUserWithAccount(), generateId() (+4 more)

### Community 100 - "app/layout.tsx"
Cohesion: 0.08
Nodes (20): baseUrl, inter, metadata, sora, spaceGrotesk, spaceMono, structuredData, viewport (+12 more)

### Community 101 - "auth-layout-client.tsx"
Cohesion: 0.29
Nodes (4): metadata, AuthLayoutClient(), highlights, taglines

### Community 102 - "webcam-view.tsx"
Cohesion: 0.19
Nodes (17): MediaPipeDrawingSpecCardProps, WebcamView, WebcamViewHandle, WebcamViewProps, renderHandDrawingShape(), DEFAULT_DRAWING_SPEC, MediaPipeDrawingSpec, renderFaceDrawingShape() (+9 more)

### Community 103 - "try/page.tsx"
Cohesion: 0.13
Nodes (9): baseUrl, metadata, TryCapturePage(), tryToolSchema, Logo(), LogoProps, InputOTP(), InputOTPGroup() (+1 more)

### Community 104 - "about/page.tsx"
Cohesion: 0.10
Nodes (16): aboutSchema, baseUrl, metadata, AboutCta(), AboutHero(), metrics, AboutManifesto(), promises (+8 more)

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 107 - "send-email.ts"
Cohesion: 0.07
Nodes (57): dynamic, POST(), dynamic, POST(), { GET, POST, PATCH, PUT, DELETE }, POST(), GET(), getPreviewHtml() (+49 more)

### Community 109 - "rateLimit"
Cohesion: 0.20
Nodes (13): getClientIp(), POST(), getClientIp(), POST(), getClientIp(), POST(), insertContactMessage(), resetRateLimit() (+5 more)

### Community 110 - "AdminVouchersPage"
Cohesion: 0.23
Nodes (9): AdminVouchersPage(), calculateBenefit(), fetchData(), handleConfirmDelete(), handleCreateVoucher(), handleLogoUpload(), handleSeedVouchers(), handleUpdateVoucher() (+1 more)

### Community 111 - "otp-queries.ts"
Cohesion: 0.18
Nodes (17): globalAny, hashOtp(), InMemoryOtpRecord, isDbConfigured(), OTP_MAX_ATTEMPTS, OTP_TTL_MS, safeEqual(), saveOTP() (+9 more)

### Community 112 - "index.py"
Cohesion: 0.22
Nodes (12): health_check(), lifespan(), get, redirect_docs(), close_db_pool(), ActivityItem, ActivityRecentResponse, BaseModel (+4 more)

### Community 114 - "AdminUsersPage"
Cohesion: 0.62
Nodes (7): AdminUsersPage(), fetchUsers(), handleBanToggle(), handleDeleteUser(), handleGrantScratchCard(), handleRoleChange(), openUserDetail()

### Community 115 - "faq.tsx"
Cohesion: 0.43
Nodes (5): FAQ_ITEMS, FaqItem, AccordionContent, AccordionItem, AccordionTrigger

### Community 116 - "capture-celebration-overlay.tsx"
Cohesion: 0.33
Nodes (5): BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin

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
Cohesion: 0.20
Nodes (10): Architectural Decisions & Invariants, Architecture — Open Smile, Auth & Session Architecture, Cross-Cutting & Infrastructure, Data Flow: Referral Activation & Economy Protection, Data Flow: Smile Capture, Scoring & Reveal, Data Flow: Voucher Marketplace & Redemption, Leaderboard Aggregation & Settlement (+2 more)

### Community 151 - "😁 Open Smile"
Cohesion: 0.12
Nodes (17): 🙏 Acknowledgments, 🛡️ Anti-Cheat & Security Posture, 🔒 Architectural Invariants, 📜 Available Scripts, 🤝 Contributing Guidelines, 🎮 Core Game Mechanics & Economy, Development Workflow, 📄 License (+9 more)

### Community 152 - "Details that make interfaces feel better"
Cohesion: 0.17
Nodes (10): Common Mistakes, Concentric border radius, Details that make interfaces feel better, Example, Quick Reference, Reference Files, Review Checklist, Review Output Format (+2 more)

### Community 153 - "Security — Open Smile"
Cohesion: 0.15
Nodes (9): Auth & session security, Coin ledger integrity, Facial data & privacy, Input handling, Known open items (track before production use), Reporting, Security — Open Smile, Threat model summary (+1 more)

### Community 154 - "theme-provider.tsx"
Cohesion: 0.29
Nodes (6): initialState, Theme, ThemeProvider(), ThemeProviderContext, ThemeProviderProps, ThemeProviderState

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 158 - "scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:py, lint (+3 more)

### Community 159 - "users/[id]/route.ts"
Cohesion: 0.47
Nodes (5): DELETE(), dynamic, GET(), getAdminUserDetail(), adminDeleteUser()

### Community 160 - "🚀 Getting Started"
Cohesion: 0.33
Nodes (6): Database Initialization, Environment Configuration, 🚀 Getting Started, Installation & Setup, Prerequisites, Running Locally

### Community 161 - "⚡ Key Features"
Cohesion: 0.17
Nodes (12): 10. 🎛️ Admin Command Center, 11. 📱 Installable Progressive Web App (PWA), 1. 🎯 On-Device Facial AI & Continuous Smile Scoring, 2. 🛡️ Client-Side Liveness & Anti-Spoofing Engine, 3. 🎫 Interactive Tactile Scratch Cards, 4. 🔥 Daily Streaks, Multipliers & Streak Freezes, 5. 🏆 Live Leaderboards & Nightly Podium Settlements, 6. 🎁 Instant Voucher Marketplace (+4 more)

### Community 164 - "beta-join/route.ts"
Cohesion: 0.70
Nodes (4): getClientIp(), POST(), findBetaWaitlistByEmail(), insertBetaWaitlist()

### Community 165 - "rewards/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, metadata, revalidate

### Community 168 - "AdminSettingsPage"
Cohesion: 0.29
Nodes (3): AdminSettingsPage(), fetchSettings(), handlePlatformReset()

### Community 169 - "radix/checkbox.tsx"
Cohesion: 0.19
Nodes (9): Checkbox(), CheckboxContextType, CheckboxIndicatorProps, CheckboxProps, [CheckboxProvider, useCheckbox], Sheet(), CommonControlledStateProps, useControlledState() (+1 more)

### Community 172 - "🔌 API & Route Reference"
Cohesion: 0.67
Nodes (3): 🔌 API & Route Reference, FastAPI Game Engine Endpoints (`/api/v1/...`), Next.js BFF & Gateway Routes (`/api/...`)

### Community 179 - "capture-flow.tsx"
Cohesion: 0.18
Nodes (15): metadata, AuthGateOverlay(), AuthGateOverlayProps, CaptureFlow(), CaptureFlowProps, CapturePhase, getNextIndianMidnight(), requestCameraStream() (+7 more)

### Community 198 - "voucher-marketplace.tsx"
Cohesion: 0.07
Nodes (45): NeubrutalistPhotoCard(), NeubrutalistPhotoCardProps, DashboardStats, DashboardView(), DashboardViewProps, RecentSmile, ClaimedVouchersListProps, RewardsView() (+37 more)

### Community 201 - "slot.tsx"
Cohesion: 0.32
Nodes (7): AnyProps, DOMMotionProps, mergeProps(), mergeRefs(), Slot(), SlotProps, WithAsChild

### Community 205 - "navbar.tsx"
Cohesion: 0.07
Nodes (26): baseUrl, cookieSchema, metadata, baseUrl, metadata, privacySchema, baseUrl, metadata (+18 more)

## Knowledge Gaps
- **724 isolated node(s):** `metadata`, `metadata`, `dynamic`, `revalidate`, `mobileNavSections` (+719 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1370 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **67 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `admin/layout.tsx`, `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `settings-queries.ts`, `mailer/page.tsx`, `highlight.tsx`, `leaderboard-card.tsx`, `dashboard/settings/page.tsx`, `smile-result-screen.tsx`, `utils.ts`, `dashboard/sidebar.tsx`, `AdminSettingsPage`, `capture-flow.tsx`, `button.tsx`, `score-reveal.tsx`, `voucher-marketplace.tsx`, `slot.tsx`, `profile-content.tsx`, `app/layout.tsx`, `webcam-view.tsx`, `try/page.tsx`, `AdminVouchersPage`, `AdminUsersPage`, `faq.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `admin/layout.tsx`, `radix/sidebar.tsx`, `cn`, `settings-queries.ts`, `pwa-provider.tsx`, `app/page.tsx`, `mailer/page.tsx`, `leaderboard-card.tsx`, `dashboard/settings/page.tsx`, `smile-result-screen.tsx`, `utils.ts`, `capture-flow.tsx`, `voucher-marketplace.tsx`, `navbar.tsx`, `db/index.ts`, `profile-content.tsx`, `[username]/page.tsx`, `webcam-view.tsx`, `try/page.tsx`, `about/page.tsx`, `faq.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `captures/route.ts`, `requireServerAdmin`, `verify-otp/route.ts`, `beta-join/route.ts`, `check-credentials/route.ts`, `send-email.ts`, `rateLimit`, `getSystemSettingsMap`, `otp-queries.ts`, `settings-queries.ts`, `session.ts`, `feed/route.ts`, `getUserPublicProfileByUsername`, `db/index.ts`, `send-otp/route.ts`, `users/[id]/route.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `metadata`, `dynamic` to the rest of the system?**
  _724 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._