<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Next Boilerplate — Template Rules

This is a **boilerplate template** built with Next.js 16 + Better Auth.

## Key conventions
- **Files:** kebab-case, PascalCase for components, camelCase for functions/vars
- **Imports:** Use `@/` path alias
- **UI:** shadcn/ui in `components/ui/`, animate-ui in `components/animate-ui/`
- **Auth:** Better Auth config in `auth.ts`, routes in `app/api/auth/`
- **Database:** Supabase (PostgreSQL) via `pg` Pool in `lib/db/`, Supabase client for future features
- **State:** React Context (ToastProvider, ThemeProvider)

## Template customization workflow
1. Copy `.env.example` → `.env.local`, fill in credentials (DATABASE_URL, Supabase keys)
2. Run `npx auth migrate` to create Better Auth tables
3. Run the SQL in `supabase/migrations/001_init.sql` in Supabase SQL Editor
4. Update branding in `app/(auth)/layout.tsx` and `app/layout.tsx`
5. Replace sidebar DATA in `components/dashboard/sidebar.tsx`
