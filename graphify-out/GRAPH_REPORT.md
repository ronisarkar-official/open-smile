# Graph Report - open-smile  (2026-09-11)

## Corpus Check
- 341 files · ~295,422 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2801 nodes · 5420 edges · 201 communities (118 shown, 70 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d41c3e70`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- send-email.ts
- components/radix/sheet.tsx
- radix/sidebar.tsx
- cn
- primitives/animate/tooltip.tsx
- dashboard/settings/page.tsx
- upload/route.ts
- routers/rewards.py
- compilerOptions
- devDependencies
- getSystemSettingsMap
- components.json
- voucher-marketplace.tsx
- scratch-card-modal.tsx
- app/page.tsx
- rateLimit
- smile-result-screen.tsx
- mailer/page.tsx
- highlight.tsx
- AdminLogsPage
- collections.ts
- verify-otp/route.ts
- getPool
- database.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- otp.ts
- check-credentials/route.ts
- test_backend.py
- requireServerAdmin
- routers/refer.py
- utils.ts
- ExceptionInfo
- ExceptionInfo
- combobox.tsx
- routers/streaks.py
- Surfaces
- button.tsx
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
- (dashboard)/explore/page.tsx
- next.config.ts
- admin-ai-settings-card.tsx
- getUserCoinBalance
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
- [username]/page.tsx
- routers/leaderboard.py
- eslint.config.mjs
- webcam-view.tsx
- db/index.ts
- admin/cleanup/route.ts
- auth/index.ts
- Contextual Icon Animations
- requireServerUser
- vouchers/route.ts
- app/layout.tsx
- AdminVouchersPage
- [code]/page.tsx
- capture-celebration-overlay.tsx
- rewards-view.tsx
- Scale on Press
- SignupForm
- @radix-ui/react-label
- reward-calculator.ts
- AdminSettingsPage
- ui/animated-number-countdown.tsx
- index.py
- settings/route.ts
- toast.tsx
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
- Open Smile 😁
- Details that make interfaces feel better
- Security — Open Smile
- admin/layout.tsx
- Shadows Instead of Borders
- scripts
- Getting started
- CLAUDE.md
- copilot-instructions.md
- schema.md
- leaderboard-card.tsx
- leaderboard/page.tsx
- AdminUsersPage
- @floating-ui/react
- Physics, Motion & Interactions
- driver.js
- try/page.tsx
- vercel.json
- framer-motion
- capture-flow.tsx
- @imagekit/nodejs
- motion
- @mediapipe/tasks-vision
- react-dom
- @vercel/analytics
- next
- @radix-ui/react-icons
- pg
- qrcode
- @radix-ui/react-accordion
- @types/nodemailer
- @imagekit/next
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- shadcn
- input-otp
- lucide-react
- @supabase/supabase-js
- nodemailer
- @number-flow/react
- @radix-ui/react-navigation-menu
- react-markdown
- tw-animate-css

## God Nodes (most connected - your core abstractions)
1. `cn()` - 265 edges
2. `getPool()` - 120 edges
3. `ModuleFactory()` - 120 edges
4. `requireServerAdmin()` - 63 edges
5. `Button()` - 62 edges
6. `requireServerUser()` - 44 edges
7. `useToast()` - 37 edges
8. `ensureIndexes()` - 33 edges
9. `getSystemSettingsMap()` - 28 edges
10. `logAdminAction()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/dashboard/settings/page.tsx → lib/utils.ts
- `ProfilePage()` --calls--> `getUserProfileFullDetails()`  [EXTRACTED]
  app/(dashboard)/profile/page.tsx → lib/db/collections.ts
- `StreakPage()` --calls--> `getUserStreakFullDetails()`  [EXTRACTED]
  app/(dashboard)/streak/page.tsx → lib/db/collections.ts
- `handleLogoUpload()` --calls--> `convertToWebP()`  [EXTRACTED]
  app/admin/vouchers/page.tsx → lib/convert-to-webp.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/radix/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (201 total, 70 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "send-email.ts"
Cohesion: 0.08
Nodes (54): dynamic, POST(), dynamic, POST(), dynamic, POST(), POST(), GET() (+46 more)

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.06
Nodes (43): SheetCloseProps, SheetContent(), SheetContentProps, SheetDescriptionProps, SheetFooter(), SheetFooterProps, SheetHeaderProps, SheetOverlay() (+35 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.03
Nodes (77): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+69 more)

### Community 6 - "cn"
Cohesion: 0.04
Nodes (59): Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps, Badge(), BadgeProps (+51 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.06
Nodes (43): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+35 more)

### Community 8 - "dashboard/settings/page.tsx"
Cohesion: 0.13
Nodes (17): mobileNavSections, SettingsPage(), SettingsDialog(), SettingsDialogProps, NotificationsContent(), ProfileContent(), ActionButton(), NAV_GROUPS (+9 more)

### Community 9 - "upload/route.ts"
Cohesion: 0.24
Nodes (14): GET(), ALLOWED_MIME_TYPES, DELETE(), isImageKitUrl(), POST(), sanitizeFileName(), sanitizeFolder(), deleteFromImageKit() (+6 more)

### Community 10 - "routers/rewards.py"
Cohesion: 0.19
Nodes (28): BadgeItem, ClaimedVoucherResponse, ClaimVoucherRequest, BaseModel, ScratchCardActionResult, ScratchCardModel, ScratchCardsListResponse, SignupBonusResponse (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "devDependencies"
Cohesion: 0.10
Nodes (21): concurrently, eslint, eslint-config-next, devDependencies, concurrently, eslint, eslint-config-next, tailwindcss (+13 more)

### Community 13 - "getSystemSettingsMap"
Cohesion: 0.18
Nodes (28): GET, POST(), dynamic, GET(), getSmileByline(), revalidate, dynamic, GET() (+20 more)

### Community 14 - "components.json"
Cohesion: 0.09
Nodes (22): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+14 more)

### Community 15 - "voucher-marketplace.tsx"
Cohesion: 0.14
Nodes (18): ClaimedVouchersList(), ClaimedVouchersListProps, VoucherClaimModal(), VoucherClaimModalProps, ClaimedVoucher, INITIAL_CLAIMED_VOUCHERS, VOUCHER_CATEGORIES, VoucherBrand (+10 more)

### Community 16 - "scratch-card-modal.tsx"
Cohesion: 0.25
Nodes (6): BACKDROP_TRANSITION, PANEL_TRANSITION, ScratchCardModal(), ScratchCardModalProps, ScratchCard(), ScratchCardProps

### Community 17 - "app/page.tsx"
Cohesion: 0.06
Nodes (30): faqSchema, Faq(), FAQ_ITEMS, FaqItem, FinalCta(), Hero(), HowItWorks(), StepItem (+22 more)

### Community 18 - "rateLimit"
Cohesion: 0.22
Nodes (10): getClientIp(), POST(), getClientIp(), POST(), resetRateLimit(), upsertRateLimit(), isDbConfigured(), memoryStores (+2 more)

### Community 19 - "smile-result-screen.tsx"
Cohesion: 0.10
Nodes (13): NeubrutalistPhotoCard(), NeubrutalistPhotoCardProps, ShareExploreModal(), AI_REACTIONS, AiReaction, CONFETTI_COLORS, getAiReaction(), getScoreBarColor() (+5 more)

### Community 20 - "mailer/page.tsx"
Cohesion: 0.05
Nodes (55): AdminCapturesPage(), fetchCaptures(), handleFlagCapture(), AdminMailerPage(), ALL_LOG_TEMPLATES, DISPATCH_TEMPLATES, EmailLogItem, MailerStats (+47 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "AdminLogsPage"
Cohesion: 0.29
Nodes (4): AdminExplorePage(), fetchPosts(), handleDeletePost(), AdminLogsPage()

### Community 23 - "collections.ts"
Cohesion: 0.07
Nodes (44): GET(), getClientIp(), POST(), dynamic, POST(), dynamic, GET(), POST() (+36 more)

### Community 24 - "verify-otp/route.ts"
Cohesion: 0.25
Nodes (12): POST(), getClientIp(), getSessionCookieName(), POST(), sendLoginNotification(), setSessionCookie(), createPendingReferral(), createSessionForUser() (+4 more)

### Community 25 - "getPool"
Cohesion: 0.14
Nodes (17): dynamic, GET(), revalidate, DELETE(), dynamic, GET(), POST(), GET() (+9 more)

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

### Community 31 - "otp.ts"
Cohesion: 0.24
Nodes (13): globalAny, hashOtp(), InMemoryOtpRecord, isDbConfigured(), OTP_MAX_ATTEMPTS, OTP_TTL_MS, safeEqual(), saveOTP() (+5 more)

### Community 32 - "check-credentials/route.ts"
Cohesion: 0.25
Nodes (12): getClientIp(), invalidCredentials(), POST(), getClientIp(), POST(), generateOTP(), createAuthTicket(), getSecret() (+4 more)

### Community 33 - "test_backend.py"
Cohesion: 0.13
Nodes (25): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+17 more)

### Community 34 - "requireServerAdmin"
Cohesion: 0.05
Nodes (54): AdminLayout(), dynamic, POST(), DELETE(), dynamic, dynamic, GET(), dynamic (+46 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.21
Nodes (17): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+9 more)

### Community 36 - "utils.ts"
Cohesion: 0.12
Nodes (30): AdminScratchCardItem, MOBILE_NAV_ITEMS, AdminUserComboboxProps, AdminUserItem, AvatarUpload(), AvatarUploadProps, sizeClasses, ImageKitUploadedFile (+22 more)

### Community 39 - "combobox.tsx"
Cohesion: 0.21
Nodes (9): Combobox(), ComboboxOption, ComboboxProps, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+1 more)

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "button.tsx"
Cohesion: 0.08
Nodes (27): CatalogVoucher, CATEGORIES, VOUCHER_TYPES, VoucherType, LoginForm(), EMAIL_PROMPT_CHIPS, NOTIFICATION_PROMPT_CHIPS, TONES (+19 more)

### Community 43 - "1. Product / Gameplay Rules"
Cohesion: 0.09
Nodes (22): 1. Product / Gameplay Rules, 2. Engineering Rules, 3. Contribution Rules, Anti-cheat (do not remove without a replacement), Auth, Before submitting any change, Branching, Code style (+14 more)

### Community 44 - "Core Principles"
Cohesion: 0.12
Nodes (17): 10. Text Wrapping, 11. Image Outlines, 12. Scale on Press, 13. Skip Animation on Page Load, 14. Never Use `transition: all`, 15. Use `will-change` Sparingly, 16. Minimum Hit Area, 1. Concentric Border Radius (+9 more)

### Community 45 - "dependencies"
Cohesion: 0.08
Nodes (25): @base-ui/react, better-auth, class-variance-authority, clsx, lenis, dependencies, @base-ui/react, better-auth (+17 more)

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
Cohesion: 0.14
Nodes (13): Accessibility Checkpoint, Border & Radius System, Border Utilities, Border Widths, Color Palette & Theme Tokens, Component Standards, Dark Mode (`.dark`), Elevation, Depth & Shadow System (+5 more)

### Community 54 - "(dashboard)/explore/page.tsx"
Cohesion: 0.11
Nodes (20): ExplorePost, filters, ReferPage(), ReferStatsData, steps, ShareExploreModalProps, BadgeShowcaseProps, categoryLabels (+12 more)

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "admin-ai-settings-card.tsx"
Cohesion: 0.15
Nodes (23): dynamic, POST(), dynamic, POST(), AdminAiGeneratorDialogProps, AdminAiSettingsCardProps, POPULAR_MODELS, callAICompletion() (+15 more)

### Community 57 - "getUserCoinBalance"
Cohesion: 0.11
Nodes (23): dynamic, generateVoucherCode(), POST(), revalidate, dynamic, formatCardDate(), POST(), revalidate (+15 more)

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

### Community 90 - "[username]/page.tsx"
Cohesion: 0.09
Nodes (25): dynamic, GET(), revalidate, dynamic, GET(), revalidate, dynamic, GET() (+17 more)

### Community 91 - "routers/leaderboard.py"
Cohesion: 0.44
Nodes (8): LeaderboardResponse, PodiumEntry, BaseModel, RankingEntry, UserRank, get_leaderboard(), get, Pool

### Community 93 - "webcam-view.tsx"
Cohesion: 0.12
Nodes (27): MediaPipeDrawingSpecCardProps, WebcamView, WebcamViewHandle, WebcamViewProps, DEFAULT_SETTINGS, SystemSettingsContext, SystemSettingsContextValue, SystemSettingsProvider() (+19 more)

### Community 94 - "db/index.ts"
Cohesion: 0.10
Nodes (18): dynamic, GET(), dynamic, GET(), dynamic, GET(), GET(), POST (+10 more)

### Community 95 - "admin/cleanup/route.ts"
Cohesion: 0.44
Nodes (7): dynamic, POST(), GET, POST(), cleanupExpiredExplorePosts(), cleanupExpiredOtpCodes(), cleanupExpiredRateLimits()

### Community 96 - "auth/index.ts"
Cohesion: 0.12
Nodes (10): { GET, POST, PATCH, PUT, DELETE }, dynamic, metadata, ProfilePage(), revalidate, dynamic, metadata, revalidate (+2 more)

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "requireServerUser"
Cohesion: 0.07
Nodes (33): dynamic, POST(), dynamic, GET(), revalidate, POST(), dynamic, POST() (+25 more)

### Community 99 - "vouchers/route.ts"
Cohesion: 0.29
Nodes (9): DELETE(), dynamic, GET(), PATCH(), POST(), createAdminVoucher(), deleteAdminVoucher(), getAdminVouchers() (+1 more)

### Community 100 - "app/layout.tsx"
Cohesion: 0.08
Nodes (24): baseUrl, inter, metadata, sora, spaceGrotesk, spaceMono, structuredData, viewport (+16 more)

### Community 101 - "AdminVouchersPage"
Cohesion: 0.23
Nodes (9): AdminVouchersPage(), calculateBenefit(), fetchData(), handleConfirmDelete(), handleCreateVoucher(), handleLogoUpload(), handleSeedVouchers(), handleUpdateVoucher() (+1 more)

### Community 102 - "[code]/page.tsx"
Cohesion: 0.31
Nodes (7): dynamic, generateMetadata(), JoinPage(), JoinPageProps, ReferralTracker(), ReferralTrackerProps, findUserByReferralCode()

### Community 103 - "capture-celebration-overlay.tsx"
Cohesion: 0.33
Nodes (5): BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece, FlyingCoin

### Community 104 - "rewards-view.tsx"
Cohesion: 0.11
Nodes (24): dynamic, metadata, revalidate, DashboardStats, DashboardView(), DashboardViewProps, RecentSmile, RewardsView() (+16 more)

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 109 - "reward-calculator.ts"
Cohesion: 0.38
Nodes (6): calculateSmileCoins(), CoinCalculationResult, getTier(), mulberry32(), SMILE_TIERS, SmileTier

### Community 110 - "AdminSettingsPage"
Cohesion: 0.29
Nodes (3): AdminSettingsPage(), fetchSettings(), handlePlatformReset()

### Community 111 - "ui/animated-number-countdown.tsx"
Cohesion: 0.33
Nodes (4): AnimatedNumberCountdown(), CountdownProps, MotionNumberFlow, TimeLeft

### Community 112 - "index.py"
Cohesion: 0.22
Nodes (12): health_check(), lifespan(), get, redirect_docs(), close_db_pool(), ActivityItem, ActivityRecentResponse, BaseModel (+4 more)

### Community 114 - "settings/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, GET(), POST(), getSystemSettings(), updateSystemSetting()

### Community 115 - "toast.tsx"
Cohesion: 0.32
Nodes (6): AlertToast, AlertToastProps, alertToastVariants, iconColorClasses, iconMap, Toaster()

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

### Community 151 - "Open Smile 😁"
Cohesion: 0.29
Nodes (7): Core mechanics, briefly, License, Open Smile 😁, Team, Tech stack, What it does, Why it's different

### Community 152 - "Details that make interfaces feel better"
Cohesion: 0.17
Nodes (10): Common Mistakes, Concentric border radius, Details that make interfaces feel better, Example, Quick Reference, Reference Files, Review Checklist, Review Output Format (+2 more)

### Community 153 - "Security — Open Smile"
Cohesion: 0.25
Nodes (8): Auth & session security, Coin ledger integrity, Facial data & privacy, Input handling, Known open items (track before production use), Reporting, Security — Open Smile, Threat model summary

### Community 154 - "admin/layout.tsx"
Cohesion: 0.28
Nodes (5): metadata, AdminBootstrapClient(), AdminHeader(), AdminSidebar(), NAV_ITEMS

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 158 - "scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:py, lint (+3 more)

### Community 160 - "Getting started"
Cohesion: 0.33
Nodes (6): Database setup, Environment configuration, Getting started, Installation, Prerequisites, Running locally

### Community 165 - "leaderboard-card.tsx"
Cohesion: 0.09
Nodes (27): PeriodData, runOptions, ShimmerLine(), MILESTONES, StreakView(), updateCountdown(), StreakViewProps, formatRangeDate() (+19 more)

### Community 168 - "AdminUsersPage"
Cohesion: 0.62
Nodes (7): AdminUsersPage(), fetchUsers(), handleBanToggle(), handleDeleteUser(), handleGrantScratchCard(), handleRoleChange(), openUserDetail()

### Community 172 - "Physics, Motion & Interactions"
Cohesion: 0.67
Nodes (3): Keyframe Animations & Reveal Utilities, Physics, Motion & Interactions, The Tactile Lift (`.brutal-lift`)

### Community 175 - "try/page.tsx"
Cohesion: 0.07
Nodes (19): highlights, metadata, runtime, baseUrl, metadata, tryToolSchema, defaultBottomLinks, defaultFooterColumns (+11 more)

### Community 179 - "capture-flow.tsx"
Cohesion: 0.13
Nodes (18): metadata, AuthGateOverlay(), AuthGateOverlayProps, CaptureFlow(), CaptureFlowProps, CapturePhase, getNextIndianMidnight(), requestCameraStream() (+10 more)

## Knowledge Gaps
- **661 isolated node(s):** `runtime`, `metadata`, `highlights`, `metadata`, `dynamic` (+656 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1298 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **70 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `dashboard/settings/page.tsx`, `voucher-marketplace.tsx`, `scratch-card-modal.tsx`, `app/page.tsx`, `smile-result-screen.tsx`, `mailer/page.tsx`, `highlight.tsx`, `AdminLogsPage`, `admin/layout.tsx`, `utils.ts`, `leaderboard-card.tsx`, `combobox.tsx`, `AdminUsersPage`, `button.tsx`, `try/page.tsx`, `capture-flow.tsx`, `(dashboard)/explore/page.tsx`, `admin-ai-settings-card.tsx`, `score-reveal.tsx`, `webcam-view.tsx`, `AdminVouchersPage`, `rewards-view.tsx`, `AdminSettingsPage`, `toast.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `radix/sidebar.tsx`, `cn`, `dashboard/settings/page.tsx`, `voucher-marketplace.tsx`, `scratch-card-modal.tsx`, `app/page.tsx`, `smile-result-screen.tsx`, `mailer/page.tsx`, `admin/layout.tsx`, `utils.ts`, `leaderboard-card.tsx`, `combobox.tsx`, `try/page.tsx`, `capture-flow.tsx`, `(dashboard)/explore/page.tsx`, `admin-ai-settings-card.tsx`, `[username]/page.tsx`, `webcam-view.tsx`, `app/layout.tsx`, `[code]/page.tsx`, `rewards-view.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `check-credentials/route.ts`, `requireServerUser`, `send-email.ts`, `requireServerAdmin`, `vouchers/route.ts`, `[code]/page.tsx`, `getSystemSettingsMap`, `settings/route.ts`, `rateLimit`, `collections.ts`, `verify-otp/route.ts`, `getUserCoinBalance`, `[username]/page.tsx`, `otp.ts`, `db/index.ts`, `admin/cleanup/route.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `metadata`, `highlights` to the rest of the system?**
  _661 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._