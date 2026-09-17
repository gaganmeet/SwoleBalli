# Open Gym

Open Gym is an open-source workout tracking app for athletes and coaches. Plan your training, log every set, watch your progress, and optionally coach clients — all from a fast, installable web app (PWA) that works on your phone and desktop.

It's built with React + TypeScript + Vite and backed by [Supabase](https://supabase.com) (Postgres + Auth + Row Level Security + Storage). You can run it entirely on the free tiers of Supabase and a static host — no server to maintain.

## Features

**Plans & workouts**

- Build plans as Plan → Days → Exercises, with drag-and-drop reordering
- Log a workout set-by-set (weight, reps, RPE, warm-up flag) with a built-in rest timer
- "Last time" placeholders show your numbers from your most recent session for the same exercise — preferring the same gym, falling back to your last session anywhere
- Full workout history with per-session detail views
- Duplicate any plan you can see into your own editable copy

**Exercise library**

- Global seeded exercise library plus your own custom exercises
- Muscle group / equipment tagging and optional tutorial video links

**Progress**

- Estimated 1RM and volume charts per exercise
- Filter progress by gym ("All gyms" / "No gym" / a specific gym)

**Gyms**

- Optionally tag a workout with the gym you trained at (Settings → Gyms)
- Keeps "last time" placeholders and progress honest when the same exercise is loaded differently across locations

**Coaching**

- Athletes can find and link with a coach (request → approve flow)
- Coaches get a client dashboard: pending requests, per-client plans/progress/history, and can assign plans directly to a client
- Coaches can leave notes on specific exercises (read-only for the athlete); athletes can keep their own private notes too

**Public plan library**

- Publish any plan as public and get a shareable link
- Anyone can browse the library, view a plan in full, and add their own copy
- Library is sorted by star count, most-starred first

**Profiles & social**

- Public profile pages with optional bio and profile picture (auto-compressed client-side before upload)
- GitHub-style heatmap of days worked out
- Star any profile or plan

**Account**

- Change password, set weight unit (kg/lb)
- Delete your account fully (plans, workouts, custom exercises, coach links, notes, gyms, stars, avatar)

**PWA**

- Installable on your home screen, works offline for previously loaded data, prompts on update

## Tech stack

- React 19, TypeScript, Vite
- Tailwind v4 + shadcn/ui (Radix primitives)
- TanStack Query, React Router v7
- react-hook-form + zod
- Recharts, dnd-kit, next-themes (dark mode), sonner (toasts)
- Supabase: Postgres, Auth, Row Level Security, Storage
- vite-plugin-pwa

## Self-hosting

Open Gym is a static frontend plus a Supabase backend. Setting it up takes about 15 minutes and you can do it all on free tiers.

### Prerequisites

- [Node.js](https://nodejs.org) 20+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for applying the database schema)
- A [Supabase](https://supabase.com) project — the free tier is plenty — OR Docker to run Supabase locally

### Step 1 — Clone and install

```bash
git clone <your-fork-or-this-repo-url>
cd <repo>
npm install
```

### Step 2 — Set up the database (Supabase)

There are two options:

**Option A: Supabase cloud (recommended, free)**

1. Create a project at [supabase.com](https://supabase.com).
2. Link the CLI to it:

```bash
npx supabase link --project-ref <your-project-ref>
```

> Your project ref is the short ID in your project's URL (`https://<project-ref>.supabase.co`).

3. Apply the schema (migrations in `supabase/migrations/` are the source of truth):

```bash
npm run db:push
```

4. Load the global exercise library seed data:

```bash
npx supabase db push --include-seed
```

**Option B: Supabase locally with Docker**

```bash
npx supabase start   # runs Postgres + Auth + Storage locally
npm run db:push      # applies migrations to the local database
npx supabase db push --include-seed
```

> The first `supabase start` pulls a few Docker images and can take a few minutes.

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Fill in the two values from your Supabase project (**Project Settings → API**):

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your anon/publishable key>
```

> `VITE_SUPABASE_PUBLISHABLE_KEY` is the **anon (publishable)** key, not the service role secret. The service role key is only needed if you run the end-to-end tests — never commit it.

### Step 4 — Run it locally

```bash
npm run dev
```

Open http://localhost:5173, sign up, and you're in.

### Step 5 — Deploy the frontend

Open Gym is a fully static build, so any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages, nginx...).

```bash
npm run build   # outputs to dist/
```

- **Vercel / Netlify**: push the repo and import it — the build command is `npm run build` and the output directory is `dist`. A `vercel.json` is included that rewrites all routes to `index.html` (required for client-side routing).
- **Anything else**: serve `dist/` and make sure unknown paths fall back to `index.html`.

Don't forget to set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables in your host's dashboard before building.

> For the PWA to be installable and work offline you need HTTPS — most static hosts give you that for free.

### Making it your own

Want to run it under your own name? A few quick greps will get you there:

- App name/title: `index.html`, `vite.config.ts`, `src/components/layout/TopBar.tsx`, `src/features/auth/AuthLayout.tsx`
- Privacy policy copy: `src/pages/PrivacyPolicyPage.tsx`
- PWA icons: replace files in `public/icons/` (and `public/favicon.png`)
- Android app name: `android/twa-manifest.json`, `android/app/build.gradle`
- If you ship your own Android app, update the package ID and domains in `android/` and `public/.well-known/assetlinks.json` to match your domain

## Common tasks

### Updating the schema after changes

```bash
npm run db:push     # apply new migrations
npm run gen:types   # regenerate src/lib/supabase/database.types.ts
```

Migrations in `supabase/migrations/` are the source of truth for the schema — every table, RLS policy, and RPC (e.g. `save_plan`, `delete_own_account`, `get_workout_activity`) is defined there in order.

### Running tests

```bash
npm run lint            # oxlint
npm run test:e2e        # Playwright (needs SUPABASE_SERVICE_ROLE_KEY in .env)
npm run test:e2e:ui     # Playwright with UI
npm run format          # prettier
```

## Project structure

```
src/
  app/            app-wide providers and query client
  components/     shared UI and layout components
  features/       feature modules (auth, plans, workouts, coaching, progress, ...)
  lib/supabase/   Supabase client + generated types
  pages/          top-level pages (privacy policy, 404, ...)
supabase/
  migrations/     schema, RLS policies, and RPCs in order
  seed.sql        global exercise library
public/
  icons/          PWA icons
```

## License

Open Gym is open source. See the repository for license details.
