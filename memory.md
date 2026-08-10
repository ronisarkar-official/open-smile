# MEMORY.md

> Project context file. Keep this updated so any AI coding assistant or new team member can get full context fast.

## 1. Project Overview

- **Name:** next-boilerplate
- **Purpose:** A production-ready Next.js 16 boilerplate with auth, ImageKit media uploads, dashboard, and reusable UI components.
- **Live URL:** —
- **Repo URL:** —
- **Owner(s):** —

## 2. Tech Stack

- **Frontend:** React 19.2 + Next.js 16.2.6 (App Router, Turbopack)
- **Backend:** Next.js API Routes (Route Handlers) + MongoDB
- **Auth:** Better Auth (`better-auth`) / NextAuth v5 — Credentials (email/password + OTP), GitHub OAuth, Google OAuth
- **Package Manager:** npm
- **Styling:** Tailwind CSS v4 + shadcn/ui (radix-nova style) + tw-animate-css
- **Animation:** Motion v12 + animate-ui components
- **Icons:** lucide-react
- **Payments:** — (removed)
- **Media Uploads:** ImageKit + WebP conversion utility (`lib/convert-to-webp.ts`)
- **Email:** Nodemailer (Gmail SMTP)
- **Other Key Libraries:** class-variance-authority, clsx, tailwind-merge, @floating-ui/react, input-otp, bcryptjs

## 3. Folder Structure

```
root/
├── app/
│   ├── (auth)/              # Auth route group (login, signup, forgot-password, reset-password)
│   │   └── layout.tsx       # Shared auth layout with Logo & left branding panel
│   ├── api/
│   │   ├── auth/            # [...all], check-credentials, forgot-password, reset-password, send-otp, signup, verify-otp
│   │   ├── imagekit/        # auth, upload
│   ├── dashboard/           # Protected dashboard page
│   │   └── loading.tsx      # Dashboard skeleton loader
│   ├── verify-otp/          # OTP verification page
│   ├── error.tsx            # Global runtime error boundary
│   ├── globals.css          # Tailwind v4 + shadcn theme tokens
│   ├── layout.tsx           # Root layout (fonts, SessionProvider, ToastProvider, Toaster)
│   ├── loading.tsx          # Root page loader
│   ├── not-found.tsx        # Branded 404 page
│   └── page.tsx             # Landing page (redirects authenticated users to /dashboard)
├── components/
│   ├── animate-ui/          # Animated UI primitives (sidebar, sheet, tooltip, etc.)
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard sidebar
│   ├── imagekit/            # ImageKit upload components
│   ├── settings/            # Settings dialog (profile, preferences, placeholders)
│   ├── icons.tsx            # GitHub + Google SVG icons
│   ├── logo.tsx             # Reusable SVG & text Logo component
│   ├── navbar.tsx           # Responsive navbar with Next.js Link routing
│   ├── session-provider.tsx # SessionProvider wrapper
│   └── theme-provider.tsx   # Light/Dark/System theme context
├── hooks/
│   ├── use-controlled-state.tsx
│   ├── use-mobile.ts
│   └── use-toast.tsx        # Global toast state management
├── lib/
│   ├── db/                 # MongoDB module (client singleton, collections)
│   │   ├── index.ts        # Barrel exports — import from "@/lib/db"
│   │   ├── client.ts       # Singleton MongoClient (lazy, dev-safe)
│   │   └── collections.ts  # Typed collection accessors
│   ├── auth-client.ts       # Better-auth client setup
│   ├── convert-to-webp.ts   # WebP client-side/server-side image converter
│   ├── get-strict-context.tsx
│   ├── imagekit.ts          # ImageKit upload integration
│   ├── mailer.ts            # Nodemailer email sender (Gmail SMTP)
│   ├── otp.ts               # OTP generation/verification (in-memory dev fallback)
│   └── utils.ts             # cn() utility
├── types/
│   └── next-auth.d.ts       # NextAuth type augmentation

├── auth.ts                  # NextAuth / Better-Auth server config
├── proxy.ts                 # Next.js 16 proxy (middleware replacement)
├── .env.example             # All required env vars (fill in your values)
└── ...config files
```

## 4. Environment Variables

See `.env.example` for the full list. Key variables:
- `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- `MONGODB_URI`

## 5. Core Features

- [x] Auth — Email/password signup & login with bcrypt hashing
- [x] Auth — OTP verification flow (send via email, verify, auto-login)
- [x] Auth — GitHub & Google OAuth
- [x] Auth — Forgot password / reset password flow
- [x] Error Handling & App States — Branded 404 page (`app/not-found.tsx`)
- [x] Error Handling & App States — Global Error Boundary (`app/error.tsx`)
- [x] Error Handling & App States — Global Loader (`app/loading.tsx`) & Dashboard Skeleton (`app/dashboard/loading.tsx`)
- [x] Media Uploads — ImageKit integration with WebP conversion
- [x] Branding & UI — `<Logo />` component supporting theme-aware SVG vector rendering
- [x] Navigation — Full Next.js `<Link>` routing in Navbar
- [x] Dashboard — Protected dashboard page with sidebar navigation
- [x] Toast Notifications — Animated toasts (success/warning/info/error)
- [x] UI Component Library — shadcn/ui + animate-ui
- [x] Theme Switching — Light/Dark/System with SSR-safe blocking script

## 6. Architecture Decisions

| Date | Decision | Reason |
|---|---|---|
| 2026 | Next.js 16 App Router | Latest stable, Turbopack, proxy (middleware replacement) |
| 2026 | Better Auth / NextAuth v5 | Native Next.js 16 support & React auth hooks |
| 2026 | motion v12 instead of framer-motion | Modern successor, import from motion/react |
| 2026 | Reusable `<Logo />` SVG Component | Theme-aware (`currentColor`), hydration-safe, centralized branding |
| 2026 | Next.js `<Link>` Navigation in Navbar | Instant client-side page routing with prefetching |
| 2026 | ImageKit + WebP Optimization | Fast image uploading with automatic WebP format conversion |
| 2026 | Error & Loading Boundaries | Branded 404, error boundary, and pulse skeletons for smooth app UX |
| 2026 | Custom Toast System | Animated with Motion, supports variants, global context |

## 7. Template Customization

To adapt this boilerplate for your project:
1. Copy `.env.example` to `.env.local` and fill in your values
2. Customize `components/logo.tsx` or pass your brand title/URL to `<Logo />`
3. Update `app/(auth)/layout.tsx` branding & testimonial
4. Replace sidebar DATA in `components/dashboard/sidebar.tsx` with your app's navigation
5. Configure OAuth apps on GitHub/Google if needed

## 8. Deployment Notes

- **Build:** `npm run build` (→ `next build`)
- **Dev:** `npm run dev` (→ `next dev` with Turbopack)
- **Deploy target:** Any Node.js hosting (Vercel, Railway, Fly.io, etc.)
