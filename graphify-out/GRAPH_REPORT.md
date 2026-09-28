# Graph Report - open-smile  (2026-09-28)

## Corpus Check
- 381 files · ~373,154 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2997 nodes · 5921 edges · 212 communities (129 shown, 71 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd295504`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- radix/sidebar.tsx
- components/radix/sheet.tsx
- cn
- mailer/index.ts
- primitives/animate/tooltip.tsx
- db/index.ts
- upload/route.ts
- routers/rewards.py
- compilerOptions
- devDependencies
- leaderboard-queries.ts
- components.json
- AdminLogsPage
- getUserPublicProfileByUsername
- send-email.ts
- requireServerUser
- feed/route.ts
- useToast
- highlight.tsx
- contact-form.tsx
- notification-queries.ts
- icons.tsx
- AdminVouchersPage
- cron.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- smile-result-screen.tsx
- capture-flow.tsx
- test_backend.py
- requireServerAdmin
- routers/refer.py
- leaderboard-card.tsx
- ExceptionInfo
- ExceptionInfo
- admin/layout.tsx
- routers/streaks.py
- Surfaces
- scratch-card-modal.tsx
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
- session.ts
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
- getPool
- routers/leaderboard.py
- eslint.config.mjs
- my-team.tsx
- profile-content.tsx
- admin-capture-rewards-card.tsx
- app/page.tsx
- Contextual Icon Animations
- utils.ts
- admin-queries.ts
- app/layout.tsx
- verify-otp/route.ts
- slot.tsx
- try/page.tsx
- about/page.tsx
- Scale on Press
- refer/page.tsx
- @radix-ui/react-label
- rateLimit
- voucher-marketplace.tsx
- otp-queries.ts
- index.py
- AdminUsersPage
- faq.tsx
- navbar.tsx
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
- auth-layout-client.tsx
- Shadows Instead of Borders
- scripts
- ui/animated-number-countdown.tsx
- 🚀 Getting Started
- ⚡ Key Features
- CLAUDE.md
- copilot-instructions.md
- verify-otp/page.tsx
- illustrations/index.ts
- hero-floating-coins.tsx
- better-auth
- AdminSettingsPage
- radix/checkbox.tsx
- @floating-ui/react
- class-variance-authority
- 🔌 API & Route Reference
- driver.js
- clsx
- contact/page.tsx
- radix-ui
- vercel.json
- @radix-ui/react-alert-dialog
- use-system-settings.tsx
- @imagekit/nodejs
- motion
- react
- react-dom
- @vercel/analytics
- next
- @radix-ui/react-icons
- pg
- leaderboard/page.tsx
- qrcode
- @radix-ui/react-accordion
- @types/nodemailer
- @imagekit/next
- @vercel/speed-insights
- @radix-ui/react-dialog
- shadcn
- [username]/page.tsx
- rules/page.tsx
- explore/route.ts
- nodemailer
- claims/route.ts
- @radix-ui/react-navigation-menu
- react-markdown
- activity-marquee.tsx
- footer.tsx
- AdminExplorePage
- SignupForm

## God Nodes (most connected - your core abstractions)
1. `cn()` - 274 edges
2. `getPool()` - 137 edges
3. `ModuleFactory()` - 120 edges
4. `Button()` - 67 edges
5. `requireServerAdmin()` - 63 edges
6. `requireServerUser()` - 47 edges
7. `useToast()` - 41 edges
8. `getSystemSettingsMap()` - 34 edges
9. `ensureIndexes()` - 30 edges
10. `logAdminAction()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/dashboard/settings/page.tsx → lib/utils.ts
- `generateMetadata()` --calls--> `findUserByReferralCode()`  [EXTRACTED]
  app/(marketing)/join/[code]/page.tsx → lib/db/referral-queries.ts
- `TryCapturePage()` --calls--> `getServerUser()`  [EXTRACTED]
  app/(marketing)/try/page.tsx → lib/auth/session.ts
- `handleLogoUpload()` --calls--> `convertToWebP()`  [EXTRACTED]
  app/admin/vouchers/page.tsx → lib/convert-to-webp.ts
- `generateMetadata()` --calls--> `getUserPublicProfileByUsername()`  [EXTRACTED]
  app/u/[username]/page.tsx → lib/db/profile-queries.ts

## Import Cycles
- 3-file cycle: `lib/db/admin-queries.ts -> lib/db/capture-queries.ts -> lib/db/settings-queries.ts -> lib/db/admin-queries.ts`

## Communities (212 total, 71 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "radix/sidebar.tsx"
Cohesion: 0.03
Nodes (75): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+67 more)

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.08
Nodes (33): SheetCloseProps, SheetContentProps, SheetDescriptionProps, SheetFooter(), SheetFooterProps, SheetHeaderProps, SheetOverlay(), SheetOverlayProps (+25 more)

### Community 5 - "cn"
Cohesion: 0.04
Nodes (67): generateStars(), StarLayer(), StarLayerProps, StarsBackground(), StarsBackgroundProps, Collapsible(), CollapsibleContent(), CollapsibleContentProps (+59 more)

### Community 6 - "mailer/index.ts"
Cohesion: 0.16
Nodes (27): dynamic, POST(), POST(), GET(), getPreviewHtml(), POST(), sendBetaWaitlistEmail(), sendLoginNotificationEmail() (+19 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.07
Nodes (36): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+28 more)

### Community 8 - "db/index.ts"
Cohesion: 0.10
Nodes (19): dynamic, GET(), dynamic, GET(), GET(), POST, dynamic, GET() (+11 more)

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

### Community 13 - "leaderboard-queries.ts"
Cohesion: 0.19
Nodes (28): GET, POST(), dynamic, GET(), getSmileByline(), revalidate, DailySettlementResult, getLatestLeaderboardSettlement() (+20 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 16 - "getUserPublicProfileByUsername"
Cohesion: 0.11
Nodes (19): dynamic, GET(), revalidate, dynamic, GET(), revalidate, dynamic, metadata (+11 more)

### Community 17 - "send-email.ts"
Cohesion: 0.09
Nodes (32): dynamic, POST(), dynamic, POST(), getEmailLogById(), insertEmailLog(), isEmailSuppressed(), ContactEmailPayload (+24 more)

### Community 18 - "requireServerUser"
Cohesion: 0.07
Nodes (35): dynamic, POST(), dynamic, POST(), revalidate, DELETE(), dynamic, revalidate (+27 more)

### Community 19 - "feed/route.ts"
Cohesion: 0.24
Nodes (12): dynamic, POST(), GET, POST(), dynamic, formatTimeAgo(), GET(), getAvatarLetters() (+4 more)

### Community 20 - "useToast"
Cohesion: 0.06
Nodes (52): AdminCapturesPage(), fetchCaptures(), handleFlagCapture(), AdminMailerPage(), ALL_LOG_TEMPLATES, DISPATCH_TEMPLATES, EmailLogItem, MailerStats (+44 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "contact-form.tsx"
Cohesion: 0.17
Nodes (12): SUBJECT_PRESETS, Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+4 more)

### Community 23 - "notification-queries.ts"
Cohesion: 0.10
Nodes (35): GET(), DELETE(), dynamic, GET(), POST(), dynamic, POST(), dynamic (+27 more)

### Community 24 - "icons.tsx"
Cohesion: 0.13
Nodes (20): dynamic, metadata, revalidate, DashboardStats, DashboardView(), DashboardViewProps, RecentSmile, RewardsView() (+12 more)

### Community 25 - "AdminVouchersPage"
Cohesion: 0.23
Nodes (9): AdminVouchersPage(), calculateBenefit(), fetchData(), handleConfirmDelete(), handleCreateVoucher(), handleLogoUpload(), handleSeedVouchers(), handleUpdateVoucher() (+1 more)

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
Cohesion: 0.06
Nodes (38): createFirework(), createParticle(), DEFAULT_FIREWORK_COLORS, FireworksBackground(), FireworksBackgroundProps, FireworkType, getColorFromPalette(), getValueByRange() (+30 more)

### Community 32 - "capture-flow.tsx"
Cohesion: 0.10
Nodes (23): metadata, AuthGateOverlay(), AuthGateOverlayProps, BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin (+15 more)

### Community 33 - "test_backend.py"
Cohesion: 0.12
Nodes (27): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+19 more)

### Community 34 - "requireServerAdmin"
Cohesion: 0.06
Nodes (50): dynamic, POST(), DELETE(), dynamic, DELETE(), dynamic, GET(), POST() (+42 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.22
Nodes (16): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+8 more)

### Community 36 - "leaderboard-card.tsx"
Cohesion: 0.08
Nodes (38): AdminDashboardPage(), dynamic, generateMetadata(), JoinPageProps, ReferralTracker(), ReferralTrackerProps, MOBILE_NAV_ITEMS, PeriodData (+30 more)

### Community 39 - "admin/layout.tsx"
Cohesion: 0.21
Nodes (7): metadata, AdminBootstrapClient(), AdminHeader(), AdminSidebar(), NAV_ITEMS, PageTransition(), PageTransitionProps

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "scratch-card-modal.tsx"
Cohesion: 0.17
Nodes (10): ScratchCardTile(), ScratchCardTileProps, BACKDROP_TRANSITION, CONFETTI_COLORS, PANEL_TRANSITION, ScratchCardItem, ScratchCardModal(), ScratchCardModalProps (+2 more)

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
Nodes (28): ExplorePost, filters, EMAIL_PROMPT_CHIPS, NOTIFICATION_PROMPT_CHIPS, TONES, ShareExploreModalProps, ImageUpload(), ImageUploadProps (+20 more)

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "ai/client.ts"
Cohesion: 0.16
Nodes (21): dynamic, POST(), dynamic, POST(), AdminAiGeneratorDialogProps, callAICompletion(), generateEmailDraft(), generateNotificationDraft() (+13 more)

### Community 57 - "session.ts"
Cohesion: 0.13
Nodes (14): AdminLayout(), dynamic, GET(), dynamic, GET(), { GET, POST, PATCH, PUT, DELETE }, DashboardGroupLayout(), auth (+6 more)

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

### Community 90 - "getPool"
Cohesion: 0.08
Nodes (35): dynamic, GET(), revalidate, dynamic, GET(), revalidate, POST(), dynamic (+27 more)

### Community 91 - "routers/leaderboard.py"
Cohesion: 0.44
Nodes (8): LeaderboardResponse, PodiumEntry, BaseModel, RankingEntry, UserRank, get_leaderboard(), get, Pool

### Community 93 - "my-team.tsx"
Cohesion: 0.16
Nodes (10): AkashIllustration(), AyushiIllustration(), RoniIllustration(), SohanIllustration(), SubalIllustration(), defaultTeamMembers, MyTeamProps, TeamMember (+2 more)

### Community 94 - "profile-content.tsx"
Cohesion: 0.07
Nodes (27): LoginForm(), mobileNavSections, SettingsPage(), GitHubIcon(), GoogleIcon(), SettingsDialog(), SettingsDialogProps, NotificationsContent() (+19 more)

### Community 95 - "admin-capture-rewards-card.tsx"
Cohesion: 0.23
Nodes (12): AdminCaptureRewardsCardProps, TIER_BADGES, calculateSmileCoins(), CaptureRewardConfig, CoinCalculationResult, DEFAULT_LUCKY_BONUS_MAX, DEFAULT_LUCKY_BONUS_MIN, DEFAULT_LUCKY_DROP_CHANCE (+4 more)

### Community 96 - "app/page.tsx"
Cohesion: 0.12
Nodes (11): faqSchema, Faq(), FinalCta(), HowItWorks(), StepItem, STEPS, SmoothScroll(), TRUST_POINTS (+3 more)

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "utils.ts"
Cohesion: 0.11
Nodes (25): AdminScratchCardItem, CatalogVoucher, CATEGORIES, VOUCHER_TYPES, VoucherType, AdminAiSettingsCard(), AdminAiSettingsCardProps, POPULAR_MODELS (+17 more)

### Community 99 - "admin-queries.ts"
Cohesion: 0.11
Nodes (27): dynamic, GET(), revalidate, dynamic, GET(), revalidate, DashboardPage(), dynamic (+19 more)

### Community 100 - "app/layout.tsx"
Cohesion: 0.05
Nodes (36): baseUrl, inter, metadata, outfit, sora, spaceMono, structuredData, viewport (+28 more)

### Community 101 - "verify-otp/route.ts"
Cohesion: 0.12
Nodes (28): getClientIp(), invalidCredentials(), POST(), resolveRedirectPath(), sendLoginNotification(), POST(), getClientIp(), POST() (+20 more)

### Community 102 - "slot.tsx"
Cohesion: 0.32
Nodes (7): AnyProps, DOMMotionProps, mergeProps(), mergeRefs(), Slot(), SlotProps, WithAsChild

### Community 103 - "try/page.tsx"
Cohesion: 0.19
Nodes (6): baseUrl, metadata, TryCapturePage(), tryToolSchema, Logo(), LogoProps

### Community 104 - "about/page.tsx"
Cohesion: 0.10
Nodes (16): aboutSchema, baseUrl, metadata, AboutCta(), AboutHero(), metrics, AboutManifesto(), promises (+8 more)

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 107 - "refer/page.tsx"
Cohesion: 0.15
Nodes (12): ReferPage(), ReferralItem, ReferStatsData, steps, Table, TableBody, TableCaption, TableCell (+4 more)

### Community 109 - "rateLimit"
Cohesion: 0.15
Nodes (18): getClientIp(), POST(), getClientIp(), POST(), getClientIp(), POST(), getClientIp(), POST() (+10 more)

### Community 110 - "voucher-marketplace.tsx"
Cohesion: 0.15
Nodes (18): ClaimedVouchersListProps, getBrandUrl(), VoucherClaimModal(), VoucherClaimModalProps, ClaimedVoucher, INITIAL_CLAIMED_VOUCHERS, VOUCHER_CATEGORIES, VoucherBrand (+10 more)

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

### Community 116 - "navbar.tsx"
Cohesion: 0.18
Nodes (8): baseUrl, metadata, securitySchema, baseUrl, metadata, termsSchema, links, Navbar()

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

### Community 154 - "auth-layout-client.tsx"
Cohesion: 0.29
Nodes (4): metadata, AuthLayoutClient(), highlights, taglines

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 158 - "scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:py, lint (+3 more)

### Community 159 - "ui/animated-number-countdown.tsx"
Cohesion: 0.33
Nodes (4): AnimatedNumberCountdown(), CountdownProps, MotionNumberFlow, TimeLeft

### Community 160 - "🚀 Getting Started"
Cohesion: 0.33
Nodes (6): Database Initialization, Environment Configuration, 🚀 Getting Started, Installation & Setup, Prerequisites, Running Locally

### Community 161 - "⚡ Key Features"
Cohesion: 0.17
Nodes (12): 10. 🎛️ Admin Command Center, 11. 📱 Installable Progressive Web App (PWA), 1. 🎯 On-Device Facial AI & Continuous Smile Scoring, 2. 🛡️ Client-Side Liveness & Anti-Spoofing Engine, 3. 🎫 Interactive Tactile Scratch Cards, 4. 🔥 Daily Streaks, Multipliers & Streak Freezes, 5. 🏆 Live Leaderboards & Nightly Podium Settlements, 6. 🎁 Instant Voucher Marketplace (+4 more)

### Community 164 - "verify-otp/page.tsx"
Cohesion: 0.36
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 166 - "hero-floating-coins.tsx"
Cohesion: 0.23
Nodes (8): GumroadCoin(), GumroadCoinProps, COIN_CONFIGS, FloatingCoinConfig, FloatingCoinItem(), FloatingCoinItemProps, HeroFloatingCoins(), Hero()

### Community 168 - "AdminSettingsPage"
Cohesion: 0.29
Nodes (3): AdminSettingsPage(), fetchSettings(), handlePlatformReset()

### Community 169 - "radix/checkbox.tsx"
Cohesion: 0.19
Nodes (9): Checkbox(), CheckboxContextType, CheckboxIndicatorProps, CheckboxProps, [CheckboxProvider, useCheckbox], Sheet(), CommonControlledStateProps, useControlledState() (+1 more)

### Community 172 - "🔌 API & Route Reference"
Cohesion: 0.67
Nodes (3): 🔌 API & Route Reference, FastAPI Game Engine Endpoints (`/api/v1/...`), Next.js BFF & Gateway Routes (`/api/...`)

### Community 175 - "contact/page.tsx"
Cohesion: 0.29
Nodes (4): baseUrl, contactSchema, metadata, ContactForm()

### Community 179 - "use-system-settings.tsx"
Cohesion: 0.13
Nodes (26): WebcamView, WebcamViewProps, DEFAULT_SETTINGS, SystemSettingsContext, SystemSettingsContextValue, SystemSettingsState, createGestureRecognizer(), detectHandGesture() (+18 more)

### Community 197 - "[username]/page.tsx"
Cohesion: 0.29
Nodes (6): dynamic, generateMetadata(), PageProps, PublicProfilePage(), revalidate, PublicProfileView()

### Community 198 - "rules/page.tsx"
Cohesion: 0.40
Nodes (3): baseUrl, metadata, rulesSchema

### Community 199 - "explore/route.ts"
Cohesion: 0.67
Nodes (3): dynamic, GET(), getAdminExplorePosts()

### Community 201 - "claims/route.ts"
Cohesion: 0.67
Nodes (3): dynamic, GET(), getAdminVoucherClaims()

### Community 205 - "footer.tsx"
Cohesion: 0.13
Nodes (12): baseUrl, cookieSchema, metadata, baseUrl, metadata, privacySchema, defaultBottomLinks, defaultFooterColumns (+4 more)

### Community 206 - "AdminExplorePage"
Cohesion: 1.00
Nodes (3): AdminExplorePage(), fetchPosts(), handleDeletePost()

## Knowledge Gaps
- **734 isolated node(s):** `metadata`, `metadata`, `dynamic`, `revalidate`, `mobileNavSections` (+729 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **71 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `radix/sidebar.tsx`, `components/radix/sheet.tsx`, `primitives/animate/tooltip.tsx`, `AdminLogsPage`, `useToast`, `highlight.tsx`, `contact-form.tsx`, `icons.tsx`, `AdminVouchersPage`, `smile-result-screen.tsx`, `capture-flow.tsx`, `leaderboard-card.tsx`, `verify-otp/page.tsx`, `hero-floating-coins.tsx`, `admin/layout.tsx`, `AdminSettingsPage`, `scratch-card-modal.tsx`, `use-system-settings.tsx`, `button.tsx`, `score-reveal.tsx`, `AdminExplorePage`, `profile-content.tsx`, `admin-capture-rewards-card.tsx`, `utils.ts`, `app/layout.tsx`, `slot.tsx`, `refer/page.tsx`, `voucher-marketplace.tsx`, `AdminUsersPage`, `faq.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `radix/sidebar.tsx`, `cn`, `useToast`, `contact-form.tsx`, `icons.tsx`, `smile-result-screen.tsx`, `capture-flow.tsx`, `leaderboard-card.tsx`, `verify-otp/page.tsx`, `hero-floating-coins.tsx`, `admin/layout.tsx`, `scratch-card-modal.tsx`, `use-system-settings.tsx`, `[username]/page.tsx`, `profile-content.tsx`, `admin-capture-rewards-card.tsx`, `app/page.tsx`, `utils.ts`, `app/layout.tsx`, `try/page.tsx`, `about/page.tsx`, `refer/page.tsx`, `voucher-marketplace.tsx`, `faq.tsx`, `navbar.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `requireServerAdmin`, `admin-queries.ts`, `verify-otp/route.ts`, `mailer/index.ts`, `explore/route.ts`, `db/index.ts`, `claims/route.ts`, `rateLimit`, `leaderboard-queries.ts`, `otp-queries.ts`, `getUserPublicProfileByUsername`, `send-email.ts`, `requireServerUser`, `feed/route.ts`, `notification-queries.ts`, `session.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `metadata`, `dynamic` to the rest of the system?**
  _734 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._