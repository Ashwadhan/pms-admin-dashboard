# Performance Management System — Admin Dashboard Plan

Frontend-only, mock-data PMS admin dashboard. Visual bar: **Stripe / Linear / Airbnb-grade polish** — restrained, confident, modern. Not Material 2014. Not bootstrap. Not "dashboard template."

## Visual direction (the non-negotiables)

- **Surface**: warm near-white background (`oklch(0.99 0.002 95)`), pure white cards, hairline 1px borders in cool gray. No drop shadows on tables; soft `0 1px 2px` only on floating elements (modals, dropdowns).
- **Accent**: a single confident blue — Stripe-ish indigo-blue `oklch(0.55 0.19 260)`. Used sparingly: primary buttons, focused inputs, active nav item, link text. Never as decoration.
- **Typography**: Inter for UI, with tight tracking on headings (`-0.02em`). Sizes follow an 8-step scale; page titles 20px/600, table headers 12px/500 uppercase tracking-wide, body 14px/400. No oversized hero text — this is a tool, not a marketing site.
- **Density**: Linear-style. Table rows 44px, comfortable but not airy. Generous left/right padding on the page (32px), tight vertical rhythm.
- **Radius**: `8px` everywhere (`10px` on the page-level cards). No pill buttons except status badges.
- **Status badges**: soft tinted background + matching text (e.g. green-50 bg + green-700 text), no borders, no dots-and-lines.
- **Motion**: 150ms ease-out on hover/focus, modal fade+scale from 0.98. No bouncy springs, no decorative animation.
- **Iconography**: lucide-react at 16px in tables, 18px in nav. Stroke 1.75.
- **What we will NOT do**: gradients, glassmorphism, neumorphism, colored shadows, gradient borders, emoji in UI, oversized rounded-2xl cards, purple-pink anything, "AI-app" aesthetics.

All tokens defined in `src/styles.css` via `oklch`. Components consume semantic tokens only.

## Routes (TanStack Start)

```
src/routes/
  __root.tsx               // QueryClient + sonner Toaster
  index.tsx                // redirect → /login or /users by mock session
  login.tsx                // public
  unauthorized.tsx         // 403
  _app.tsx                 // pathless layout (sidebar + topbar + <Outlet/>)
  _app/users.tsx           // User Management (Admin only)
```

- `_app.beforeLoad` → redirect to `/login` if no mock session.
- `_app/users.beforeLoad` → redirect to `/unauthorized` if role !== `admin`.

Mock session in `src/lib/auth-store.ts` (tiny `useSyncExternalStore` + localStorage). Demo logins (any password):

- `admin@acme.com` → Admin
- `manager@acme.com` → Manager
- `employee@acme.com` → Employee

## Pages

**1. Login (`/login`)**
Split layout: left 60% solid off-white with brand mark + one quiet tagline; right 40% white card with form. Email + password (eye toggle). "Sign in" button shows spinner during 800ms fake auth. Inline error alert on failure. Tiny "Demo accounts" footer chip lists the three emails.

**2. App shell (`_app`)**

- **Sidebar** (240px, collapsible to 56px icon rail): brand mark, primary nav (Users active; Reviews, Goals, Analytics, Settings as muted "Soon" items), workspace switcher placeholder at top, user card + logout at bottom.
- **Topbar** (56px, white, hairline bottom border): breadcrumb / page title left, global search (⌘K hint), notifications bell, avatar menu right.
- Content: `max-w-[1400px]`, `px-8 py-6`.

**3. User Management (`/users`)**

- **Header row**: H1 "Users", subtitle "Manage team members and access", primary "Add user" button right-aligned.
- **Stat strip** (4 small cards): Total, Active, Inactive, New this month — quiet numbers, no charts.
- **Toolbar**: search input (leading icon, debounced), Role filter, Department filter, Status filter, "Clear" link when filters active.
- **Table**: Name (avatar with initials + name/email stacked), Role, Department, Status badge, Last active (relative time), Actions (kebab menu → Edit, Activate/Deactivate).
- **States**: skeleton rows on load, empty state with illustration + reset action, simple pagination (10/page) with "Showing 1–10 of 24".

**4. Add User modal** — centered `Dialog`, 480px. Fields: Full Name, Email, Role select, Department select. Zod validation, inline field errors. Cancel + Create user. Success toast.

**5. Edit User modal** — same Dialog component, pre-filled. Save changes button (disabled until dirty). Success toast.

**6. Confirm modal** — `AlertDialog`. Dynamic copy + destructive variant for Deactivate. Cancel + Confirm.

**7. Unauthorized (`/unauthorized`)** — centered, generous whitespace. Custom inline SVG (geometric, not cartoon) for 403. "You don't have access to this page." Two buttons: "Back" (history) and "Sign in as different user".

## Reusable components

- `layout/`: `AppShell`, `Sidebar`, `Topbar`
- `users/`: `UserTable`, `UserToolbar`, `UserFormDialog` (Add+Edit), `StatusBadge`, `ConfirmDialog`, `StatCard`
- `common/`: `EmptyState`, `Spinner`, `ErrorAlert`, `PageHeader`
- Toasts via `sonner`, mounted in `__root.tsx`.

## Mock data

`src/lib/mock-data.ts`: ~24 realistic users across the 9 standard departments (Engineering, Product, Design, Sales, Marketing, HR, Finance, Operations, Support) and 3 roles. `src/lib/users-store.ts` exposes list/create/update/toggleStatus with simulated 400ms latency so loading states are visible.

## Out of scope

Real backend, password reset, Reviews/Goals modules, bulk actions, CSV export.

Approve and I'll build.
