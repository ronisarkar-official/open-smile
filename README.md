# Next Boilerplate

A production-ready **Next.js 16** boilerplate with authentication, dashboard, and reusable UI components — ready to clone and build on.

## Features

- **Authentication** — Email/password signup & login, OTP verification flow, GitHub & Google OAuth, forgot/reset password
- **Beta Waitlist** — Rate-limited `/api/beta-join` endpoint with MongoDB dedupe + confirmation email
- **Health Check** — `/api/health` liveness probe with DB ping
- **Dashboard** — Protected dashboard with sidebar navigation, settings dialog (profile, preferences, theme switching)
- **UI Library** — shadcn/ui (radix-nova style) + animate-ui primitives + Motion animations + Tailwind CSS v4
- **Theme** — Light / Dark / System with SSR-safe flash prevention
- **Toast Notifications** — Animated toasts with success/warning/info/error variants

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url> my-project
cd my-project

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your MongoDB, OAuth, and other credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Customization Guide

See `memory.md` for detailed customization instructions.

## Tech Stack

| Category | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Motion v12 |
| Database | MongoDB |
| Auth | Better Auth |
| Email | Nodemailer (Gmail SMTP) |

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — Better Auth
- `MONGODB_DIRECT_URI` — MongoDB
- `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET` — OAuth (optional)

## Scripts

```bash
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## License

MIT
