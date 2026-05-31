
# StayBook — Smart Travel Planner Platform

A frontend-only travel planning platform inspired by Airbnb, Google Maps, Tripadvisor, and Notion. Browse destinations, build day-by-day itineraries with drag-and-drop, manage budgets and bookings, and collaborate with friends in real time — all powered by a mocked backend that lives entirely in the browser.

## Highlights

- **Mocked backend**, but it feels real: IndexedDB persistence, simulated network latency, randomised errors, and seeded catalogue data.
- **Authentication** with mocked sessions, protected routes, and a `(app)` route group guard.
- **Destination discovery** with full text search, multi-facet filters, sort, pagination, and a Map view powered by Leaflet.
- **Trip planner** with drag-and-drop across days, four view modes (Board / Timeline / Calendar / Map), live route polylines, and per-day color rotation.
- **Budget management** with optimistic expense tracking, Recharts donut + bar + area charts, and multi-currency support.
- **Hotel booking** with availability simulation, date picker, occupancy controls, and a confirm flow that persists to IndexedDB.
- **Real-time collaboration** via `BroadcastChannel`: presence avatars, cross-tab invalidation, last-write-wins toasts, activity feed, and comment threads with reactions.
- **Notifications + command palette + dark mode**, plus skeletons, empty states, and a custom 404.

## Stack

- **Next.js 16** App Router · **React 19** · **TypeScript** · **Tailwind 4**
- **TanStack Query** for server cache · **Zustand** for client state · **next-themes** for theming
- **dnd-kit** for drag-and-drop · **react-leaflet** + Leaflet · **recharts** for charts · **framer-motion** for micro-interactions
- **react-hook-form** + **zod** for forms · **react-day-picker** for date selection · **cmdk** for the command palette
- **idb** for IndexedDB · **nanoid** for IDs · **sonner** for toasts · **Radix UI** primitives for dialogs, tooltips, popovers, etc.

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

The first time the app loads it seeds users, destinations, trips, expenses, and notifications into IndexedDB. To wipe the local database, open DevTools → Application → IndexedDB → delete `staybook`.

### Demo Credentials

```
Email:    alex@voyager.com
Password: voyager2024
```

These auto-fill on the login form. You can also register a new account; it will be persisted in IndexedDB.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server with Turbopack |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint with the Next.js config |

## Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Login, register (public)
│   ├── (app)/                    # Protected pages
│   │   ├── dashboard/            # Dashboard + saved + budget + bookings
│   │   ├── explore/              # Destination discovery + map + [slug]
│   │   ├── booking/              # Hotel search + detail + reserve flow
│   │   ├── planner/              # Trip picker + [tripId] planner board
│   │   └── profile/              # Account settings + avatar upload
│   ├── layout.tsx                # Root layout, fonts, skip link
│   ├── providers.tsx             # QueryClient + Theme + Tooltip + AuthBootstrap
│   └── not-found.tsx
├── components/
│   ├── maps/                     # Leaflet wrapper with theme tiles + routes
│   ├── sections/landing/         # Landing page sections
│   ├── shared/                   # CommandPalette, FavoriteButton, ThemeToggle…
│   └── ui/                       # Buttons, dialogs, skeletons, etc.
├── features/                     # Feature-scoped hooks + UI
│   ├── auth/                     # Hooks, bootstrap, redirect-if-authenticated
│   ├── bookings/
│   ├── comments/
│   ├── destinations/
│   ├── expenses/
│   ├── favorites/
│   ├── hotels/
│   ├── notifications/
│   ├── realtime/                 # BroadcastChannel primitives + presence
│   └── trips/
├── lib/
│   ├── api/                      # Mocked backend (client, db, seed, modules)
│   ├── realtime/                 # Broadcast channel utility
│   ├── utils/                    # Currency, distance, availability
│   └── validations/              # zod schemas
├── stores/                       # Zustand stores (auth, ui)
├── data/                         # Seed JSON catalogues
├── constants/                    # Shared constants (nav)
└── hooks/                        # Shared hooks (debounce, geolocation, currency)
```

## Architecture

### Mocked Backend

Everything that would normally be a network call goes through `src/lib/api/`:

- `client.ts` — `fakeRequest()` helper that adds 200–600ms latency and ~3% randomised failures, plus typed error helpers (`unauthorized`, `notFound`, `validationError`, …).
- `db.ts` — `idb` wrapper with a typed `StayBookDb` schema (users, sessions, trips, bookings, favorites, expenses, notifications, comments) and an `upgrade` migration ladder.
- `seed.ts` — runs once per object store version, hydrating IndexedDB from the JSON files in `src/data/`.
- `auth.ts`, `trips.ts`, `expenses.ts`, `bookings.ts`, `favorites.ts`, `notifications.ts`, `comments.ts`, `hotels.ts`, `destinations.ts` — domain modules exposing CRUD verbs.

### Data Layer

- **TanStack Query** for server cache, with `keepPreviousData` for paginated grids, `setQueryData` for optimistic mutations, and `useIsMutating` to detect concurrent local edits.
- **Zustand** for the small slice of client state that crosses pages (`authStore`, `uiStore`). Both are persisted to `localStorage`.

### Real-time Collaboration

`src/features/realtime/` exposes:

- `useChannelListener(room, handler)` and `broadcast(room, type, payload)` over the browser `BroadcastChannel`.
- `usePresence(tripId)` heartbeats every 5 seconds with a 30s prune.
- `useTripRealtime(tripId)` invalidates the trip cache and toasts when teammates push changes; if a local mutation is in flight, the toast notes the merge.

To experience it, open the same trip in two tabs.

### Theming

`src/styles/tokens.css` defines a light + dark palette through CSS variables. `next-themes` toggles the `.dark` class on `<html>`, and Tailwind v4's `@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` utilities respond accordingly. The `ThemeToggle` component lives in `src/components/shared/theme-toggle.tsx`.

### Maps

`src/components/maps/leaflet-map.tsx` is a dynamic (`ssr: false`) wrapper around `react-leaflet`. It accepts a typed `markers` and `routes` prop, supports custom `divIcon` markers (six accent colors, three kinds), pulse-animated user dot, and a `flyTo` prop for programmatic recentering. Tile layer switches between CARTO Voyager (light) and CARTO Dark.

## Notable Routes

| Route | Description |
| --- | --- |
| `/` | Marketing landing page |
| `/login` · `/register` | Mocked auth flows with `react-hook-form` + zod |
| `/dashboard` | Home with live trip cards, analytics, budget overview, recent activity |
| `/dashboard/budget` | Donut + bar + area charts of all spend |
| `/dashboard/bookings` | Upcoming / past / cancelled tabs |
| `/dashboard/saved` | Favorited destinations and hotels |
| `/explore?view=map` | Destination discovery, switch between grid and Leaflet map |
| `/explore/[slug]` | Destination details, gallery, attractions map |
| `/booking` | Hotel search + filters + availability |
| `/booking/[hotelId]` | Hotel detail + reserve dialog |
| `/planner` | Trip picker (redirects to first trip when present) |
| `/planner/[tripId]` | Itinerary board with drag-and-drop, four view modes, comments, presence, invite |
| `/profile` | Edit profile, change avatar, currency preference |

## Constraints Honoured

- TypeScript everywhere.
- Mobile-first responsive design.
- Map functionality is real (Leaflet).
- Collaborative features (presence, live updates, comments, invites).
- No UI templates: all components are hand-built on top of Radix primitives and Tailwind.
- Clean folder architecture by feature.

## Deployment

Any platform that supports Next.js 16 will work — Vercel, Netlify, Cloudflare, Fly, or self-host. The app is fully client-side after the initial HTML response; there are no environment variables required because the backend lives in the browser.

```bash
npm run build
npm run start
```

## License

No license file ships with this repository.
