# Graph Report - open-smile  (2026-09-19)

## Corpus Check
- 377 files · ~367,669 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2956 nodes · 5783 edges · 208 communities (130 shown, 66 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f0bf52a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- vision_wasm_internal.js
- vision_wasm_nosimd_internal.js
- ModuleFactory
- rewards/page.tsx
- components/radix/sheet.tsx
- radix/sidebar.tsx
- cn
- primitives/animate/tooltip.tsx
- db/index.ts
- upload/route.ts
- routers/rewards.py
- compilerOptions
- devDependencies
- leaderboard-queries.ts
- components.json
- verify-otp/route.ts
- voucher-marketplace.tsx
- app/page.tsx
- requireServerUser
- stars.tsx
- mailer/page.tsx
- highlight.tsx
- leaderboard-card.tsx
- getPool
- logAdminAction
- profile-content.tsx
- cron.py
- abort
- vision_wasm_module_internal.js
- abort
- PRD — Open Smile
- smile-result-screen.tsx
- AdminVouchersPage
- test_backend.py
- requireServerAdmin
- routers/refer.py
- utils.ts
- ExceptionInfo
- ExceptionInfo
- dashboard/sidebar.tsx
- routers/streaks.py
- Surfaces
- admin/settings/page.tsx
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
- auth/index.ts
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
- admin-queries.ts
- routers/leaderboard.py
- eslint.config.mjs
- my-team.tsx
- mailer/route.ts
- admin/layout.tsx
- test-mail/route.ts
- Contextual Icon Animations
- verify-otp/page.tsx
- otp-queries.ts
- app/layout.tsx
- useToast
- getSystemSettingsMap
- try/page.tsx
- about/page.tsx
- Scale on Press
- send-email.ts
- @radix-ui/react-label
- streak-view.tsx
- leaderboard-view.tsx
- rateLimit
- index.py
- combobox.tsx
- check-credentials/route.ts
- scratch-card-modal.tsx
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
- [code]/page.tsx
- Shadows Instead of Borders
- scripts
- faq.tsx
- 🚀 Getting Started
- ⚡ Key Features
- CLAUDE.md
- copilot-instructions.md
- theme-provider.tsx
- settings/route.ts
- users/[id]/route.ts
- better-auth
- AdminSettingsPage
- radix/checkbox.tsx
- @floating-ui/react
- class-variance-authority
- 🔌 API & Route Reference
- driver.js
- clsx
- markdownToEmailHtml
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
- contact/page.tsx
- qrcode
- @radix-ui/react-accordion
- @types/nodemailer
- @imagekit/next
- @vercel/speed-insights
- @radix-ui/react-dialog
- shadcn
- admin/cleanup/route.ts
- coin-icon.tsx
- nodemailer
- slot.tsx
- @radix-ui/react-navigation-menu
- react-markdown
- navbar.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 272 edges
2. `getPool()` - 131 edges
3. `ModuleFactory()` - 120 edges
4. `Button()` - 67 edges
5. `requireServerAdmin()` - 63 edges
6. `requireServerUser()` - 44 edges
7. `useToast()` - 39 edges
8. `getSystemSettingsMap()` - 32 edges
9. `ensureIndexes()` - 30 edges
10. `logAdminAction()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `cn()`  [EXTRACTED]
  app/(dashboard)/dashboard/settings/page.tsx → lib/utils.ts
- `handleLogoUpload()` --calls--> `convertToWebP()`  [EXTRACTED]
  app/admin/vouchers/page.tsx → lib/convert-to-webp.ts
- `generateMetadata()` --calls--> `getUserPublicProfileByUsername()`  [EXTRACTED]
  app/u/[username]/page.tsx → lib/db/profile-queries.ts
- `PublicProfilePage()` --calls--> `getUserPublicProfileByUsername()`  [EXTRACTED]
  app/u/[username]/page.tsx → lib/db/profile-queries.ts
- `StarsBackground()` --calls--> `cn()`  [EXTRACTED]
  components/animate-ui/components/backgrounds/stars.tsx → lib/utils.ts

## Import Cycles
- 3-file cycle: `lib/db/admin-queries.ts -> lib/db/capture-queries.ts -> lib/db/settings-queries.ts -> lib/db/admin-queries.ts`

## Communities (208 total, 66 thin omitted)

### Community 0 - "vision_wasm_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 1 - "vision_wasm_nosimd_internal.js"
Cohesion: 0.01
Nodes (16): RFC-2279, RFC-3629, NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),, NOTE: This is also used as the process return code in shell environments, TODO: check for O_SEARCH? (== search for dir only), NOTE: None of the defaults here are true. We're just returning safe and, TODO: Use mozResponseArrayBuffer, responseStream, etc. if available., TODO: in theory we should write to the winsize struct that gets (+8 more)

### Community 3 - "rewards/page.tsx"
Cohesion: 0.40
Nodes (3): dynamic, metadata, revalidate

### Community 4 - "components/radix/sheet.tsx"
Cohesion: 0.07
Nodes (38): Sheet(), SheetCloseProps, SheetContent(), SheetContentProps, SheetDescription(), SheetDescriptionProps, SheetFooter(), SheetFooterProps (+30 more)

### Community 5 - "radix/sidebar.tsx"
Cohesion: 0.05
Nodes (41): [LocalSidebarProvider, useSidebar], SidebarContentProps, SidebarContextProps, SidebarFooter(), SidebarFooterProps, SidebarGroupAction(), SidebarGroupActionProps, SidebarGroupContent() (+33 more)

### Community 6 - "cn"
Cohesion: 0.04
Nodes (62): Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps, AvatarUpload(), Badge() (+54 more)

### Community 7 - "primitives/animate/tooltip.tsx"
Cohesion: 0.07
Nodes (36): Tooltip(), TooltipContent(), TooltipContentProps, TooltipProps, TooltipProvider(), TooltipProviderProps, TooltipTrigger(), TooltipTriggerProps (+28 more)

### Community 8 - "db/index.ts"
Cohesion: 0.15
Nodes (12): GET(), POST, dynamic, GET(), revalidate, GET(), getSupabase(), ContactMessageRow (+4 more)

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

### Community 15 - "verify-otp/route.ts"
Cohesion: 0.27
Nodes (12): POST(), getClientIp(), getSessionCookieName(), POST(), sendLoginNotification(), setSessionCookie(), createSessionForUser(), createUserWithAccount() (+4 more)

### Community 16 - "voucher-marketplace.tsx"
Cohesion: 0.15
Nodes (18): ClaimedVouchersListProps, getBrandUrl(), VoucherClaimModal(), VoucherClaimModalProps, ClaimedVoucher, INITIAL_CLAIMED_VOUCHERS, VOUCHER_CATEGORIES, VoucherBrand (+10 more)

### Community 17 - "app/page.tsx"
Cohesion: 0.10
Nodes (12): faqSchema, FinalCta(), Hero(), HowItWorks(), StepItem, STEPS, SmoothScroll(), TRUST_POINTS (+4 more)

### Community 18 - "requireServerUser"
Cohesion: 0.08
Nodes (28): dynamic, POST(), dynamic, POST(), revalidate, DELETE(), dynamic, revalidate (+20 more)

### Community 19 - "stars.tsx"
Cohesion: 0.40
Nodes (5): generateStars(), StarLayer(), StarLayerProps, StarsBackground(), StarsBackgroundProps

### Community 20 - "mailer/page.tsx"
Cohesion: 0.13
Nodes (24): ALL_LOG_TEMPLATES, DISPATCH_TEMPLATES, EmailLogItem, MailerStats, SuppressionItem, AdminNotificationItem, CATEGORIES, ICONS (+16 more)

### Community 21 - "highlight.tsx"
Cohesion: 0.12
Nodes (18): BaseHighlightProps, Bounds, ControlledChildrenModeHighlightProps, ControlledParentModeHighlightProps, DEFAULT_BOUNDS_OFFSET, ExtendedChildProps, getNonOverridingDataAttributes(), Highlight() (+10 more)

### Community 22 - "leaderboard-card.tsx"
Cohesion: 0.10
Nodes (23): SUBJECT_PRESETS, AnimatedNumberCountdown(), CountdownProps, MotionNumberFlow, TimeLeft, formatRangeDate(), LeaderboardCard, LeaderboardRunOption (+15 more)

### Community 23 - "getPool"
Cohesion: 0.10
Nodes (42): dynamic, GET(), revalidate, GET(), dynamic, POST(), GET(), DELETE() (+34 more)

### Community 24 - "logAdminAction"
Cohesion: 0.10
Nodes (25): DELETE(), dynamic, GET(), POST(), dynamic, POST(), dynamic, POST() (+17 more)

### Community 25 - "profile-content.tsx"
Cohesion: 0.12
Nodes (21): mobileNavSections, SettingsPage(), SettingsDialogProps, NotificationsContent(), AccountItem, ProfileContent(), ProfileContentProps, SessionItem (+13 more)

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
Nodes (26): createFirework(), createParticle(), DEFAULT_FIREWORK_COLORS, FireworksBackground(), FireworksBackgroundProps, FireworkType, getColorFromPalette(), getValueByRange() (+18 more)

### Community 32 - "AdminVouchersPage"
Cohesion: 0.23
Nodes (9): AdminVouchersPage(), calculateBenefit(), fetchData(), handleConfirmDelete(), handleCreateVoucher(), handleLogoUpload(), handleSeedVouchers(), handleUpdateVoucher() (+1 more)

### Community 33 - "test_backend.py"
Cohesion: 0.12
Nodes (27): CaptureRewardBreakdown, CaptureSubmitRequest, CaptureSubmitResponse, BaseModel, get_capture_status(), get, Pool, post (+19 more)

### Community 34 - "requireServerAdmin"
Cohesion: 0.05
Nodes (51): AdminLayout(), dynamic, POST(), dynamic, GET(), DELETE(), dynamic, dynamic (+43 more)

### Community 35 - "routers/refer.py"
Cohesion: 0.22
Nodes (16): BaseModel, ReferralStats, ReferStatsResponse, ReferValidateRequest, ReferValidateResponse, get_stats(), get, Pool (+8 more)

### Community 36 - "utils.ts"
Cohesion: 0.13
Nodes (25): AdminScratchCardItem, MOBILE_NAV_ITEMS, AdminUserComboboxProps, AdminUserItem, AvatarUploadProps, sizeClasses, ImageKitUploadedFile, ImageUpload() (+17 more)

### Community 39 - "dashboard/sidebar.tsx"
Cohesion: 0.07
Nodes (31): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+23 more)

### Community 40 - "routers/streaks.py"
Cohesion: 0.20
Nodes (15): BaseModel, StreakFreezeResponse, StreakStatusResponse, get_current_user_streak(), get, Pool, post, use_streak_freeze() (+7 more)

### Community 41 - "Surfaces"
Cohesion: 0.17
Nodes (12): Asymmetric Icons (Stars, Arrows, Carets), Buttons with Text + Icon, Collision Rule, Concentric Border Radius, CSS Example, Example, Minimum Hit Area, Optical Alignment (+4 more)

### Community 42 - "admin/settings/page.tsx"
Cohesion: 0.06
Nodes (37): ANTI_CHEAT_NUMBERS, ANTI_CHEAT_SWITCHES, ECONOMY_NUMBERS, FEATURE_SWITCHES, LEADERBOARD_PODIUM_NUMBERS, PODIUM_TIERS, SettingNumberConfig, SettingsTab (+29 more)

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
Cohesion: 0.08
Nodes (29): ExplorePost, filters, ReferPage(), ReferStatsData, steps, EMAIL_PROMPT_CHIPS, NOTIFICATION_PROMPT_CHIPS, TONES (+21 more)

### Community 55 - "next.config.ts"
Cohesion: 0.29
Nodes (6): connectSrc, ContentSecurityPolicy, cspParts, nextConfig, scriptSrc, securityHeaders

### Community 56 - "ai/client.ts"
Cohesion: 0.16
Nodes (21): dynamic, POST(), dynamic, POST(), AdminAiGeneratorDialogProps, callAICompletion(), generateEmailDraft(), generateNotificationDraft() (+13 more)

### Community 57 - "auth/index.ts"
Cohesion: 0.06
Nodes (29): { GET, POST, PATCH, PUT, DELETE }, dynamic, GET(), revalidate, dynamic, GET(), revalidate, dynamic (+21 more)

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

### Community 90 - "admin-queries.ts"
Cohesion: 0.14
Nodes (23): POST(), dynamic, GET(), revalidate, DashboardPage(), dynamic, revalidate, formatActivityTime() (+15 more)

### Community 91 - "routers/leaderboard.py"
Cohesion: 0.44
Nodes (8): LeaderboardResponse, PodiumEntry, BaseModel, RankingEntry, UserRank, get_leaderboard(), get, Pool

### Community 93 - "my-team.tsx"
Cohesion: 0.15
Nodes (12): AkashIllustration(), AyushiIllustration(), RoniIllustration(), SohanIllustration(), SubalIllustration(), IllustrationProps, defaultTeamMembers, MyTeamProps (+4 more)

### Community 94 - "mailer/route.ts"
Cohesion: 0.30
Nodes (16): dynamic, POST(), getPreviewHtml(), sendRewardUnlockedEmail(), sendVoucherClaimedEmail(), renderEmailLayout(), escapeHtml(), getAdminBroadcastEmailHtml() (+8 more)

### Community 95 - "admin/layout.tsx"
Cohesion: 0.22
Nodes (7): metadata, AdminBootstrapClient(), AdminHeader(), AdminSidebar(), NAV_ITEMS, PageTransition(), PageTransitionProps

### Community 96 - "test-mail/route.ts"
Cohesion: 0.36
Nodes (7): POST(), GET(), POST(), auth, sendLoginNotificationEmail(), sendResetPasswordEmail(), sendWelcomeEmail()

### Community 97 - "Contextual Icon Animations"
Cohesion: 0.40
Nodes (5): Choosing Between Motion and CSS, Contextual Icon Animations, CSS Transition Approach (No Motion), Motion Example, When to Animate Icons

### Community 98 - "verify-otp/page.tsx"
Cohesion: 0.36
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 99 - "otp-queries.ts"
Cohesion: 0.17
Nodes (18): globalAny, hashOtp(), InMemoryOtpRecord, isDbConfigured(), OTP_MAX_ATTEMPTS, OTP_TTL_MS, safeEqual(), saveOTP() (+10 more)

### Community 100 - "app/layout.tsx"
Cohesion: 0.08
Nodes (25): baseUrl, inter, metadata, sora, spaceGrotesk, spaceMono, structuredData, viewport (+17 more)

### Community 101 - "useToast"
Cohesion: 0.09
Nodes (25): AdminCapturesPage(), fetchCaptures(), handleFlagCapture(), AdminExplorePage(), fetchPosts(), handleDeletePost(), AdminLogsPage(), AdminMailerPage() (+17 more)

### Community 102 - "getSystemSettingsMap"
Cohesion: 0.14
Nodes (14): dynamic, GET(), revalidate, dynamic, POST(), revalidate, dynamic, POST() (+6 more)

### Community 103 - "try/page.tsx"
Cohesion: 0.12
Nodes (10): metadata, runtime, baseUrl, metadata, tryToolSchema, AuthLayoutClient(), highlights, taglines (+2 more)

### Community 104 - "about/page.tsx"
Cohesion: 0.10
Nodes (16): aboutSchema, baseUrl, metadata, AboutCta(), AboutHero(), metrics, AboutManifesto(), promises (+8 more)

### Community 106 - "Scale on Press"
Cohesion: 0.40
Nodes (5): CSS Example, Motion Example, Scale on Press, Static Prop Pattern, Tailwind Example

### Community 107 - "send-email.ts"
Cohesion: 0.10
Nodes (27): dynamic, POST(), ContactEmailPayload, escapeHtml(), getContactEmailHtml(), createSmtpTransporter(), devLog(), escapeHtml() (+19 more)

### Community 109 - "streak-view.tsx"
Cohesion: 0.14
Nodes (15): DashboardStats, DashboardView(), DashboardViewProps, RecentSmile, MILESTONES, StreakView(), updateCountdown(), StreakViewProps (+7 more)

### Community 110 - "leaderboard-view.tsx"
Cohesion: 0.17
Nodes (10): metadata, LeaderboardView(), PeriodData, runOptions, ShimmerLine(), LeaderboardCardProps, LeaderboardRanking, LeaderboardRankingItem (+2 more)

### Community 111 - "rateLimit"
Cohesion: 0.15
Nodes (19): getClientIp(), POST(), getClientIp(), POST(), getClientIp(), POST(), getClientIp(), POST() (+11 more)

### Community 112 - "index.py"
Cohesion: 0.22
Nodes (12): health_check(), lifespan(), get, redirect_docs(), close_db_pool(), ActivityItem, ActivityRecentResponse, BaseModel (+4 more)

### Community 114 - "combobox.tsx"
Cohesion: 0.21
Nodes (9): Combobox(), ComboboxOption, ComboboxProps, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle() (+1 more)

### Community 115 - "check-credentials/route.ts"
Cohesion: 0.25
Nodes (13): getClientIp(), invalidCredentials(), POST(), getClientIp(), POST(), generateOTP(), createAuthTicket(), getSecret() (+5 more)

### Community 116 - "scratch-card-modal.tsx"
Cohesion: 0.25
Nodes (6): BACKDROP_TRANSITION, PANEL_TRANSITION, ScratchCardModal(), ScratchCardModalProps, ScratchCard(), ScratchCardProps

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

### Community 154 - "[code]/page.tsx"
Cohesion: 0.31
Nodes (7): dynamic, generateMetadata(), JoinPage(), JoinPageProps, ReferralTracker(), ReferralTrackerProps, findUserByReferralCode()

### Community 156 - "Shadows Instead of Borders"
Cohesion: 0.40
Nodes (5): Shadow as Border (Dark Mode), Shadow as Border (Light Mode), Shadows Instead of Borders, Usage with Hover Transition, When to Use Shadows vs. Borders

### Community 158 - "scripts"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, dev:all, dev:py, lint (+3 more)

### Community 159 - "faq.tsx"
Cohesion: 0.36
Nodes (6): Faq(), FAQ_ITEMS, FaqItem, AccordionContent, AccordionItem, AccordionTrigger

### Community 160 - "🚀 Getting Started"
Cohesion: 0.33
Nodes (6): Database Initialization, Environment Configuration, 🚀 Getting Started, Installation & Setup, Prerequisites, Running Locally

### Community 161 - "⚡ Key Features"
Cohesion: 0.17
Nodes (12): 10. 🎛️ Admin Command Center, 11. 📱 Installable Progressive Web App (PWA), 1. 🎯 On-Device Facial AI & Continuous Smile Scoring, 2. 🛡️ Client-Side Liveness & Anti-Spoofing Engine, 3. 🎫 Interactive Tactile Scratch Cards, 4. 🔥 Daily Streaks, Multipliers & Streak Freezes, 5. 🏆 Live Leaderboards & Nightly Podium Settlements, 6. 🎁 Instant Voucher Marketplace (+4 more)

### Community 164 - "theme-provider.tsx"
Cohesion: 0.29
Nodes (6): initialState, Theme, ThemeProvider(), ThemeProviderContext, ThemeProviderProps, ThemeProviderState

### Community 165 - "settings/route.ts"
Cohesion: 0.47
Nodes (5): dynamic, GET(), POST(), getSystemSettings(), updateSystemSetting()

### Community 166 - "users/[id]/route.ts"
Cohesion: 0.47
Nodes (5): DELETE(), dynamic, GET(), getAdminUserDetail(), adminDeleteUser()

### Community 168 - "AdminSettingsPage"
Cohesion: 0.29
Nodes (3): AdminSettingsPage(), fetchSettings(), handlePlatformReset()

### Community 169 - "radix/checkbox.tsx"
Cohesion: 0.19
Nodes (9): Checkbox(), CheckboxContextType, CheckboxIndicatorProps, CheckboxProps, [CheckboxProvider, useCheckbox], Sheet(), CommonControlledStateProps, useControlledState() (+1 more)

### Community 172 - "🔌 API & Route Reference"
Cohesion: 0.67
Nodes (3): 🔌 API & Route Reference, FastAPI Game Engine Endpoints (`/api/v1/...`), Next.js BFF & Gateway Routes (`/api/...`)

### Community 175 - "markdownToEmailHtml"
Cohesion: 0.83
Nodes (3): escapeHtml(), markdownToEmailHtml(), parseInlineFormatting()

### Community 179 - "capture-flow.tsx"
Cohesion: 0.05
Nodes (60): metadata, MediaPipeDrawingSpecCardProps, AuthGateOverlay(), AuthGateOverlayProps, BRUTAL_COLORS, CaptureCelebrationOverlay(), CaptureCelebrationOverlayProps, ConfettiPiece (+52 more)

### Community 189 - "contact/page.tsx"
Cohesion: 0.29
Nodes (4): baseUrl, contactSchema, metadata, ContactForm()

### Community 197 - "admin/cleanup/route.ts"
Cohesion: 0.44
Nodes (7): dynamic, POST(), GET, POST(), cleanupExpiredExplorePosts(), cleanupExpiredOtpCodes(), cleanupExpiredRateLimits()

### Community 198 - "coin-icon.tsx"
Cohesion: 0.29
Nodes (12): RewardsView(), ScratchCardGallery(), ScratchCardTile(), ScratchCardTileProps, ScratchCardItem, CoinIcon(), CoinIconProps, COIN_BALANCE_EVENT (+4 more)

### Community 201 - "slot.tsx"
Cohesion: 0.32
Nodes (7): AnyProps, DOMMotionProps, mergeProps(), mergeRefs(), Slot(), SlotProps, WithAsChild

### Community 205 - "navbar.tsx"
Cohesion: 0.07
Nodes (29): baseUrl, cookieSchema, metadata, baseUrl, metadata, privacySchema, baseUrl, metadata (+21 more)

## Knowledge Gaps
- **724 isolated node(s):** `runtime`, `metadata`, `metadata`, `dynamic`, `revalidate` (+719 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1372 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `components/radix/sheet.tsx`, `radix/sidebar.tsx`, `primitives/animate/tooltip.tsx`, `voucher-marketplace.tsx`, `stars.tsx`, `mailer/page.tsx`, `highlight.tsx`, `leaderboard-card.tsx`, `profile-content.tsx`, `smile-result-screen.tsx`, `AdminVouchersPage`, `faq.tsx`, `utils.ts`, `dashboard/sidebar.tsx`, `AdminSettingsPage`, `admin/settings/page.tsx`, `capture-flow.tsx`, `button.tsx`, `score-reveal.tsx`, `coin-icon.tsx`, `slot.tsx`, `admin/layout.tsx`, `verify-otp/page.tsx`, `app/layout.tsx`, `useToast`, `streak-view.tsx`, `leaderboard-view.tsx`, `combobox.tsx`, `scratch-card-modal.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `radix/sidebar.tsx`, `cn`, `voucher-marketplace.tsx`, `app/page.tsx`, `mailer/page.tsx`, `leaderboard-card.tsx`, `profile-content.tsx`, `[code]/page.tsx`, `faq.tsx`, `smile-result-screen.tsx`, `utils.ts`, `admin/settings/page.tsx`, `capture-flow.tsx`, `coin-icon.tsx`, `navbar.tsx`, `verify-otp/page.tsx`, `app/layout.tsx`, `useToast`, `try/page.tsx`, `about/page.tsx`, `streak-view.tsx`, `combobox.tsx`, `scratch-card-modal.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `getPool()` connect `getPool` to `requireServerAdmin`, `otp-queries.ts`, `admin/cleanup/route.ts`, `getSystemSettingsMap`, `users/[id]/route.ts`, `db/index.ts`, `[code]/page.tsx`, `settings/route.ts`, `leaderboard-queries.ts`, `verify-otp/route.ts`, `rateLimit`, `requireServerUser`, `check-credentials/route.ts`, `logAdminAction`, `auth/index.ts`, `admin-queries.ts`, `mailer/route.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `ModuleFactory()` (e.g. with `__asyncjs__mediapipe_map_buffer_jspi()` and `BeginGlQueryTiming()`) actually correct?**
  _`ModuleFactory()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **What connects `runtime`, `metadata`, `metadata` to the rest of the system?**
  _724 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `vision_wasm_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01015228426395939 - nodes in this community are weakly interconnected._
- **Should `vision_wasm_nosimd_internal.js` be split into smaller, more focused modules?**
  _Cohesion score 0.01020408163265306 - nodes in this community are weakly interconnected._