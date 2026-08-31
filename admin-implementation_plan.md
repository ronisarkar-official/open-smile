# Admin Control Panel & Full Feature Management System

This implementation plan outlines the architecture and execution strategy for building a full-featured, secure, and production-grade **Admin Control Panel (`/admin`)** in Open Smile. The admin panel gives administrators complete control over every aspect of the platform: users, coin economy, vouchers, capture moderation, anti-cheat detection, explore feed, system settings, feature flags, and administrative audit logs.

## User Review Required

> [!IMPORTANT]
> **Admin Access Authorization:**
> - Access to `/admin` will be strictly guarded. A user is recognized as an admin if:
>   1. Their `user.role === 'admin'` in the database.
>   2. OR their email is specified in the `ADMIN_EMAILS` environment variable (e.g., `ADMIN_EMAILS=your-email@example.com`).
> - We will also include an initial bootstrap helper API for development environments so you can promote your own user account to `admin` with a single click.

> [!NOTE]
> All administrative database operations adhere strictly to the project's **Supabase Postgres + raw `pg` pool** architecture (`backend/db/collections.ts`) with zero ORM and parameterized queries. All coin adjustments flow through `coin_ledger` to maintain an immutable, auditable economy.

---

## Key Features & Structure

```
app/admin/
├── layout.tsx              # Server-guarded layout with Neubrutalist Admin Shell & navigation
├── page.tsx                # 📊 Main Dashboard & KPIs (Users, Captures, Minted Coins, Quick Actions)
├── users/
│   └── page.tsx            # 👥 User Management (Search, Ban/Unban, Coin Adjustments, Role Switch)
├── vouchers/
│   └── page.tsx            # 🎁 Vouchers & Economy (Stock Management, Code Seeding, Claims Fulfillment)
├── captures/
│   └── page.tsx            # 📸 Captures & Anti-Cheat (Logs, Score Distributions, Cooldown Audit, Flagging)
├── explore/
│   └── page.tsx            # 🧭 Explore Feed Moderation (Public Posts Gallery, Purge Inappropriate Content)
├── settings/
│   └── page.tsx            # ⚙️ System Settings & Feature Flags (Maintenance Mode, Coin Multipliers, DB Cleanup)
└── logs/
    └── page.tsx            # 📜 Administrative Audit Trail (Chronological log of all admin operations)
```

---

## Proposed Changes

### Database Layer

#### [MODIFY] [backend/db/indexes.ts](file:///d:/open-smile/backend/db/indexes.ts)
- Add table definitions for:
  - `system_settings`: Key-value store for global platform configuration and feature flags.
  - `admin_audit_logs`: Immutable logs tracking admin actions (`adjust_coins`, `ban_user`, `change_role`, `update_settings`, etc.).
  - `voucher_inventory`: Inventory of voucher codes for brand reward fulfillment.

#### [MODIFY] [backend/db/collections.ts](file:///d:/open-smile/backend/db/collections.ts)
- Add typed parameterized queries:
  - `getAdminDashboardStats()`: Live KPI aggregation (users, daily captures, total coins minted/spent, voucher claims, streaks).
  - `getAdminUsers({ search, role, banned, limit, offset })`: User directory with balances, streak counts, and capture counts.
  - `getAdminUserDetail(userId)`: User profile + coin ledger transactions + capture history + claimed vouchers.
  - `adminAdjustUserCoins(adminId, adminEmail, targetUserId, amount, reason)`: Ledger entry + audit log.
  - `adminSetUserRole(adminId, adminEmail, targetUserId, role)`: Update role + audit log.
  - `adminSetUserBan(adminId, adminEmail, targetUserId, banned, banReason, banExpires)`: Ban/unban user + audit log.
  - `getAdminCaptures({ search, minScore, maxScore, flaggedOnly, limit, offset })`: Captures list.
  - `adminFlagCapture(adminId, adminEmail, captureId, reason, deductCoins)`: Flag capture and claw back coins.
  - `getAdminVouchers()` & `getAdminVoucherClaims()`: Inventory and claims list.
  - `adminUpdateVoucherClaim(adminId, adminEmail, claimId, status, notes)`: Update claim status or refund.
  - `adminSeedVoucherCodes(adminId, adminEmail, voucherId, brandName, title, codes)`: Bulk insert voucher codes.
  - `getAdminExplorePosts({ limit, offset })` & `adminDeleteExplorePost(adminId, adminEmail, postId)`: Moderation.
  - `getSystemSettings()` & `updateSystemSetting(adminId, adminEmail, key, value)`: Feature toggles & economy variables.
  - `getAdminAuditLogs({ limit, offset })`: Fetch audit trail.
  - `runAdminCleanup()`: Clean up expired OTPs and rate limits.

---

### Authentication & API Layer

#### [MODIFY] [backend/auth/session.ts](file:///d:/open-smile/backend/auth/session.ts)
- Add `requireServerAdmin()` helper that checks session, `role === 'admin'`, and `ADMIN_EMAILS` fallback.

#### [NEW] API Routes under `app/api/admin/`
- [NEW] `app/api/admin/stats/route.ts`: Dashboard KPI summary endpoint.
- [NEW] `app/api/admin/users/route.ts`: List and search users.
- [NEW] `app/api/admin/users/[id]/route.ts`: Detailed user profile endpoint.
- [NEW] `app/api/admin/users/[id]/adjust-coins/route.ts`: Grant/deduct coins.
- [NEW] `app/api/admin/users/[id]/ban/route.ts`: Ban/unban user.
- [NEW] `app/api/admin/users/[id]/role/route.ts`: Promote/demote role.
- [NEW] `app/api/admin/vouchers/route.ts`: Voucher inventory overview.
- [NEW] `app/api/admin/vouchers/claims/route.ts`: Voucher claims list.
- [NEW] `app/api/admin/vouchers/claims/[id]/route.ts`: Update claim status / refund.
- [NEW] `app/api/admin/vouchers/seed/route.ts`: Bulk seed voucher codes.
- [NEW] `app/api/admin/captures/route.ts`: Capture audit logs.
- [NEW] `app/api/admin/captures/[id]/flag/route.ts`: Flag capture.
- [NEW] `app/api/admin/explore/route.ts`: Explore posts for moderation.
- [NEW] `app/api/admin/explore/[id]/route.ts`: Delete explore post.
- [NEW] `app/api/admin/settings/route.ts`: System settings & feature flags.
- [NEW] `app/api/admin/cleanup/route.ts`: Trigger DB maintenance cleanup.
- [NEW] `app/api/admin/logs/route.ts`: Fetch audit logs.
- [NEW] `app/api/admin/bootstrap/route.ts`: Self-promote current user in dev / authorized mode.

---

### Admin UI Components & Pages

#### [NEW] Admin Layout & Shell
- [NEW] `app/admin/layout.tsx`: Neubrutalist Admin Shell with sticky topbar, live system status beacon, breadcrumbs, and sidebar.
- [NEW] `components/admin/admin-sidebar.tsx`: Collapsible neubrutalist admin navigation.
- [NEW] `components/admin/admin-header.tsx`: Header with live KPI badges and quick actions.

#### [NEW] Admin Pages
- [NEW] `app/admin/page.tsx`: Overview Dashboard with metric cards, velocity charts, quick actions, and recent activity feed.
- [NEW] `app/admin/users/page.tsx`: User Management with live search, filters, user detail drawer, coin modifier modal, and ban dialog.
- [NEW] `app/admin/vouchers/page.tsx`: Voucher & Rewards Hub with stock inventory, batch code seeder, and redemption claims fulfillment pipeline.
- [NEW] `app/admin/captures/page.tsx`: Smile Captures & Anti-Cheat with score distribution filter, velocity anomaly flags, and rollback triggers.
- [NEW] `app/admin/explore/page.tsx`: Explore Community Moderation feed with 1-click purge.
- [NEW] `app/admin/settings/page.tsx`: Dynamic Feature Flags (Maintenance mode, Marketplace switch, Explore switch) & Economy Tuners (Coin multiplier, Cooldown minutes, Referral rewards) + Database Vacuum tool.
- [NEW] `app/admin/logs/page.tsx`: Admin Audit Trail viewer with JSON inspection.

#### [MODIFY] [components/dashboard/sidebar.tsx](file:///d:/open-smile/components/dashboard/sidebar.tsx)
- Add quick access link to `/admin` for users with `admin` role or authorized admin email.

---

## Verification Plan

### Automated / API Verification
1. Verify Next.js build and TypeScript compilation:
   ```bash
   npm run build
   ```
2. Verify table creation and index integrity in Supabase Postgres.
3. Test all `/api/admin/*` endpoints with unauthorized requests (expect 401/403) and authorized admin session (expect 200).

### Manual UI Verification
1. Navigate to `/admin` as admin user:
   - Check Overview KPI metrics and recent activity.
   - Adjust a user's coins and verify update in `coin_ledger` and user balance.
   - Promote / demote roles and verify role persistence.
   - Ban a test user with a reason, verify banned state.
   - Seed new voucher codes for a brand, verify stock availability.
   - Mark a voucher claim as delivered / refunded.
   - Inspect smile capture audit log and flag a test capture.
   - Toggle feature flags in System Settings (e.g. coin multiplier, maintenance mode).
   - Check Audit Logs tab to verify every administrative action was accurately recorded with timestamp and admin email.
