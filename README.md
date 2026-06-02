# StayBook — Smart Travel Planner Platform

A frontend-only travel planning platform that lets travelers discover destinations, build day-by-day itineraries with drag-and-drop, manage budgets, book hotels, and collaborate with friends in real time — all powered by a fully mocked backend that lives entirely inside the browser.

StayBook is inspired by Airbnb, Google Maps, Tripadvisor and Notion. It runs without any server, without any API keys, and without any database — just clone, install, and open the browser.

> **Live demo:** _add your deployment URL here once published_ &nbsp;·&nbsp; [Deploy your own ▲](https://vercel.com/new/clone?repository-url=https://github.com/TamarCoder/Smart-Travel-Planner-Platform---StayBook)

---

## Table of Contents

1. [Highlights](#highlights)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Demo Credentials](#demo-credentials)
5. [Environment Configuration](#environment-configuration)
6. [Available Scripts](#available-scripts)
7. [Folder Structure](#folder-structure)
8. [Architecture Overview](#architecture-overview)
9. [Authentication Module (Detailed)](#authentication-module-detailed)
10. [Mocked Backend](#mocked-backend)
11. [State Management](#state-management)
12. [Real-Time Collaboration](#real-time-collaboration)
13. [Routing & Pages](#routing--pages)
14. [Feature Layer](#feature-layer)
15. [UI, Design System & Theming](#ui-design-system--theming)
16. [Maps (Leaflet)](#maps-leaflet)
17. [PWA & Offline Support](#pwa--offline-support)
18. [How to Use the Application](#how-to-use-the-application)
19. [Data & Seed Files](#data--seed-files)
20. [Deployment](#deployment)
21. [Known Limitations](#known-limitations)
22. [License](#license)

---

## Highlights

- **Mocked backend that feels real** — IndexedDB persistence, simulated network latency (200–600 ms), randomized 3% error rate, version-based seed migrations.
- **Full authentication flow** — register, login, logout, password verification, 14-day token sessions, route guards, automatic session rehydration on page reload.
- **Destination discovery** — full-text search, multi-facet filters, sort, pagination, grid view, and a Leaflet map view.
- **Trip planner with drag-and-drop** — six view modes (Board / Timeline / Calendar / Map / Budget / Album), live route polylines, per-day color rotation, multi-destination trips, comments with reactions.
- **Budget management** — optimistic expense tracking, Recharts donut + bar + area charts, multi-currency support.
- **Hotel booking** — availability simulation, date picker, occupancy controls, confirm flow persisted to IndexedDB.
- **Experiences & transport booking** — bookable activities and intercity transport linked to a trip.
- **Real-time collaboration** — same-browser via `BroadcastChannel`, optional cross-device via Supabase Realtime transport (zero database tables required).
- **Presence + activity feed + live comments** — see who is currently viewing a trip, who edited what, and react to comments with emojis.
- **Notifications + command palette + dark mode** — branded toasts, ⌘K palette, fully themed light/dark UI.
- **Progressive Web App** — installable manifest, offline page, service-worker caching of static shell.

---

## Tech Stack

| Layer | Library |
| --- | --- |
| Framework | **Next.js 16** (App Router) · **React 19** · **TypeScript 5** |
| Styling | **Tailwind CSS 4** · CSS custom properties · design tokens |
| Server cache | **TanStack Query 5** |
| Client state | **Zustand 5** (with `persist` middleware) |
| Theming | **next-themes 0.4** |
| Drag & drop | **@dnd-kit/core**, **@dnd-kit/sortable** |
| Maps | **Leaflet 1.9** + **react-leaflet 5** |
| Charts | **Recharts 3.8** |
| Animations | **Framer Motion 12** |
| Forms | **react-hook-form 7** + **zod 4** + `@hookform/resolvers` |
| Date picker | **react-day-picker 10** + **date-fns 4** |
| Command palette | **cmdk 1** |
| Modals & primitives | **Radix UI** (Dialog, Popover, Tabs, Tooltip, etc.) |
| Storage | **idb 8** (IndexedDB wrapper) |
| Realtime | **BroadcastChannel** (built-in) + optional **@supabase/supabase-js** |
| Misc | **nanoid 5**, **sonner 2** (toasts), **lucide-react** (icons) |
| Virtualization | **@tanstack/react-virtual 3** |

---

## Quick Start

```bash
git clone https://github.com/TamarCoder/Smart-Travel-Planner-Platform---StayBook.git
cd Smart-Travel-Planner-Platform---StayBook
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

The first time the app loads, it seeds users, destinations, trips, expenses and notifications into the browser's IndexedDB. To wipe the local database, open **DevTools → Application → IndexedDB → delete `staybook`**, then reload.

---

## Demo Credentials

```
Email:    alex@voyager.com
Password: voyager2024
```

The demo credentials auto-fill on the login form. You can also register a new account; it will be persisted in IndexedDB and survive page reloads.

The demo user (`user-001`, "Alex Johnson") ships with a populated profile: 12 planned trips, 24 countries visited, 48,600 miles flown, $34,200 total spent, USD currency, and a preference for Luxury + Cultural travel styles.

---

## Environment Configuration

Because the backend lives entirely in the browser, **the app runs with zero required environment variables**. Just `npm install && npm run dev`.

A few optional variables let you tune the demo. Copy the template and edit as needed:

```bash
cp .env.example .env.local
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URL used for metadata and share links. |
| `NEXT_PUBLIC_MOCK_LATENCY_MS` | `200-600` | Simulated network latency range (`min-max` in ms) for every mock request. |
| `NEXT_PUBLIC_MOCK_ERROR_RATE` | `0.03` | Fraction (0–1) of mock requests that randomly fail, to exercise error states. |
| `NEXT_PUBLIC_SUPABASE_URL` | _(empty)_ | Optional Supabase project URL. Set to enable cross-device collaboration. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | _(empty)_ | Optional Supabase anon key. Required together with the URL above. |

All variables are `NEXT_PUBLIC_*` (read on the client) and are safe to commit defaults for — there are no secrets, API keys, or database URLs because there is no server.

The Supabase variables, if set, are used **only** as a transport for ephemeral broadcast messages (presence, trip edits, comments). No tables are created, no rows are written, and no auth flows are configured. If they are left empty, collaboration falls back to same-browser-only via `BroadcastChannel`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server with Turbopack |
| `npm run build` | Production build (type-checks during build) |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | ESLint with the Next.js config |

---

## Folder Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Public auth routes
│   │   ├── layout.tsx                # Two-column auth layout
│   │   ├── login/page.tsx            # /login
│   │   └── register/page.tsx         # /register
│   ├── (app)/                        # Protected routes
│   │   ├── layout.tsx                # Route guard + app shell
│   │   ├── dashboard/                # /dashboard + /budget + /bookings + /saved
│   │   ├── explore/                  # /explore + /explore/[slug]
│   │   ├── booking/                  # /booking + /booking/[hotelId]
│   │   ├── planner/                  # /planner + /planner/[tripId]
│   │   ├── trips/                    # /trips/[id]
│   │   ├── feed/                     # /feed
│   │   ├── people/                   # /people
│   │   └── profile/                  # /profile
│   ├── layout.tsx                    # Root layout (fonts, PWA, providers)
│   ├── providers.tsx                 # QueryClient + Theme + AuthBootstrap
│   ├── template.tsx                  # Page transitions
│   └── not-found.tsx                 # Custom 404
│
├── components/
│   ├── maps/                         # Leaflet wrapper (dynamic, ssr:false)
│   ├── sections/landing/             # Landing-page sections
│   ├── shared/                       # CommandPalette, ThemeToggle, NotificationBell…
│   └── ui/                           # Buttons, Cards, Dialogs, Skeletons…
│
├── features/                         # Feature-scoped hooks + UI
│   ├── auth/                         # Hooks, bootstrap, redirect-if-authenticated
│   ├── bookings/
│   ├── comments/
│   ├── destinations/
│   ├── expenses/
│   ├── favorites/
│   ├── hotels/
│   ├── notifications/
│   ├── realtime/                     # BroadcastChannel primitives + presence
│   └── trips/
│
├── lib/
│   ├── api/                          # Mocked backend (client, db, seed, modules)
│   ├── realtime/                     # Broadcast channel + optional Supabase
│   ├── utils/                        # Currency, distance, availability
│   └── validations/                  # zod schemas (auth, profile, trip…)
│
├── stores/                           # Zustand stores (auth, ui, social)
├── data/                             # JSON seed catalogues
├── constants/                        # Shared constants (nav)
├── hooks/                            # Shared hooks (debounce, geolocation, currency)
└── styles/                           # tokens.css + globals.css
```

---

## Architecture Overview

StayBook is a **single-page application** built on Next.js's App Router. There is no Node API, no database server, no third-party SaaS dependency for core functionality. Every "network request" is intercepted by an in-browser mock client that:

1. Waits for a randomized latency (default 200–600 ms).
2. Optionally throws a synthetic `network_unstable` error (default 3% probability).
3. Reads or writes IndexedDB through a typed `idb` wrapper.
4. Returns the result to TanStack Query, which caches it like real server data.

State is split into three lanes:

- **Server cache** → TanStack Query holds the result of every mock request.
- **Client state** → Zustand stores hold cross-page state (auth, UI toggles).
- **DOM state** → React hooks hold transient state (form values, hover, etc.).

Two transports keep multiple instances of the app in sync:

- **Local** → `BroadcastChannel` for the same browser (tabs and windows).
- **Optional remote** → Supabase Realtime channels for cross-device sync.

```
┌────────────────────────────────────────────────────────────┐
│                       Browser tab                          │
│                                                            │
│  React components ─→ feature hooks ─→ TanStack Query       │
│                                              │             │
│                                              ▼             │
│                                       src/lib/api/         │
│                                              │             │
│                                              ▼             │
│                                       IndexedDB (idb)      │
│                                                            │
│  Mutations also emit events ─→ src/lib/realtime/channel    │
│                                       │           │        │
│                                       ▼           ▼        │
│                                 BroadcastChannel  Supabase │
│                                       │           │        │
└───────────────────────────────────────┼───────────┼────────┘
                                        ▼           ▼
                                 Other tabs   Other devices
```

---

## Authentication Module (Detailed)

Authentication is the most carefully designed module in the project because every "protected" route depends on it. There is no real server, but the flow imitates a production-grade JWT/cookie session model end-to-end.

### File map

| File | Responsibility |
| --- | --- |
| `src/lib/api/auth.ts` | Pure functions: `register`, `login`, `logout`, `getCurrentUser`, `updateProfile`. Talks to IndexedDB. |
| `src/lib/api/seed.ts` | Defines `hashPassword` / `verifyPassword`. Seeds the demo user on first load. |
| `src/lib/validations/auth.ts` | zod schemas: `loginSchema`, `registerSchema`. |
| `src/stores/auth-store.ts` | Zustand store: `{ user, token, status }`. Persisted to localStorage. |
| `src/features/auth/hooks.ts` | React Query hooks: `useLogin`, `useRegister`, `useLogout`, `useMe`, `useUpdateProfile`. |
| `src/features/auth/auth-bootstrap.tsx` | Runs once on app load to validate the persisted token. |
| `src/features/auth/redirect-if-authenticated.tsx` | Guard mounted on login/register: bounces signed-in users to `/dashboard`. |
| `src/app/(auth)/login/page.tsx` | Login UI with auto-filled demo credentials. |
| `src/app/(auth)/register/page.tsx` | Registration UI. |
| `src/app/(app)/layout.tsx` | The protected route guard for everything under `(app)`. |

### Data model

Two IndexedDB object stores back the auth system:

- `users` — primary key `id`, unique index `by-email`. Each row contains profile fields, hashed password, preferences, role, and aggregate stats.
- `sessions` — primary key `token`, index `by-user`. Each row is `{ token, userId, expiresAt }`.

### Password hashing

Passwords are encoded with Base64 of their UTF-8 bytes — a deliberately weak, deterministic hash chosen because:

- It works in both the browser (`window.btoa`) and Node (`Buffer.from`).
- It survives serialization to JSON seed files.
- It avoids bundling a real KDF (bcrypt/argon2) in the browser, which would balloon bundle size for a demo with no real attack surface.

```ts
function hashPassword(plain: string): string {
  return typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(plain)))
    : Buffer.from(plain).toString("base64");
}

function verifyPassword(plain: string, hashed: string): boolean {
  return hashPassword(plain) === hashed;
}
```

> ⚠️ **Production note:** swap `hashPassword` for `bcrypt` / `argon2` / `scrypt` and move it server-side before deploying anything real.

### Session token

A session token is a 48-character `nanoid()` string. When `login` or `register` succeeds, the API:

1. Generates the token.
2. Computes `expiresAt = Date.now() + 14 days`.
3. Writes `{ token, userId, expiresAt }` to the `sessions` store.
4. Returns `{ user, token, expiresAt }` to the caller.

### Login flow, end-to-end

```
1.  /login form (react-hook-form + zod)
2.  useLogin().mutateAsync({ email, password })
3.  src/lib/api/auth.ts → login()
       ├─ normalize email (trim + lowercase)
       ├─ lookup user via `by-email` index
       ├─ verifyPassword() against stored hash
       ├─ buildSession() → { token, expiresAt }
       └─ tx.put(users) + tx.put(sessions)
4.  authStore.setSession(user, token) (Zustand)
5.  Zustand `persist` writes token + user to localStorage ("staybook.auth")
6.  queryClient.setQueryData(authKeys.me(), user)
7.  router.replace(searchParams.get("next") ?? "/dashboard")
```

### Register flow

Identical to login, except the API additionally:

- Validates that the email is unused (throws `conflict("email_taken")` otherwise).
- Generates `id = "user-" + nanoid(8)`.
- Seeds default preferences (`currency: "USD"`, `travelStyle: []`, `notifications: true`) and zeroed stats.

### Session rehydration on page load

When the app boots, no JavaScript has run yet, so the React tree starts in an "idle" state. The `AuthBootstrap` component (mounted inside `providers.tsx`) handles this:

```ts
useEffect(() => {
  if (ranRef.current) return;
  ranRef.current = true;

  const token = useAuthStore.getState().token;
  if (!token) {
    setStatus("unauthenticated");
    return;
  }

  getCurrentUser(token)
    .then((user) => {
      setSession(user, token);
      queryClient.setQueryData(authKeys.me(), user);
    })
    .catch(() => {
      clearSession();
    });
}, []);
```

`getCurrentUser` in `src/lib/api/auth.ts` checks the `sessions` store, validates the expiry timestamp, deletes the row if it's stale, then returns the linked user. If anything fails, the Zustand store is cleared and the user is treated as signed out.

This is why a hard refresh on `/dashboard` still keeps you signed in: the token persists in localStorage, the bootstrap revalidates it against IndexedDB, and only then is `status` flipped to `"authenticated"`.

### Route guard for protected pages

The `(app)` route group has a `layout.tsx` that performs the guard:

```ts
const { status } = useAuthStore();
const pathname = usePathname();
const router = useRouter();

useEffect(() => {
  if (status === "unauthenticated") {
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }
}, [status, pathname, router]);

if (status === "idle") return <Spinner />;       // bootstrapping
if (status === "unauthenticated") return null;   // about to redirect
return <AppShell>{children}</AppShell>;
```

The `?next=` query string round-trips the originally requested URL, so signing in lands you back exactly where you were trying to go.

### Reverse guard for `(auth)` pages

Mirror logic on `/login` and `/register`: if `status === "authenticated"`, the `RedirectIfAuthenticated` component bounces the user to `?next` or `/dashboard`. This prevents an already-signed-in user from seeing the login form.

### Zustand auth store

```ts
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "authenticated" | "unauthenticated";

  setSession(user: AuthUser, token: string): void;
  clearSession(): void;
  patchUser(patch: Partial<AuthUser>): void;
  setStatus(status: AuthStatus): void;
}
```

- Persisted under the localStorage key **`staybook.auth`** via `zustand/middleware`.
- `partialize` keeps only `user` and `token` (never `status`, which is recomputed on rehydrate).
- Selectors `selectIsAuthenticated` and `selectAuthUser` are exported for component-level subscriptions.

### Validation schemas

```ts
// src/lib/validations/auth.ts
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8).max(72),
});
```

These schemas are wired into `react-hook-form` via `zodResolver`, so both the field labels and the `mutateAsync` payload share a single source of truth.

### Logout

```ts
async function logout(token: string) {
  const db = await getDb();
  await db.delete("sessions", token);
}
```

The `useLogout` hook calls this, then `authStore.clearSession()`, then `queryClient.removeQueries({ queryKey: authKeys.all })`. The user is bounced back to `/login` via the protected route guard.

### Why this design

Even though the storage is fake, the surface area is **shaped exactly like a real auth system**:

- Replacing `src/lib/api/auth.ts` with `fetch("/api/auth/login")` calls is a one-day refactor.
- The Zustand store, the bootstrap component, the guards, the schemas, and the React Query keys all continue to work unchanged.
- The token model maps cleanly onto JWT (just change `buildSession()` to call the server) or cookie sessions (drop the localStorage `persist` and rely on `getCurrentUser` reading from `document.cookie`).

---

## Mocked Backend

### `src/lib/api/client.ts` — the fake request layer

Every API module funnels its work through `fakeRequest()`, which:

- Reads `NEXT_PUBLIC_MOCK_LATENCY_MS` (e.g. `200-600`) and waits a uniform random duration in that range.
- Reads `NEXT_PUBLIC_MOCK_ERROR_RATE` (e.g. `0.03`) and randomly throws `new ApiError("network_unstable", 503)`.
- Honours an `AbortSignal` so cancelled queries (from React Query) actually stop.

Typed error helpers are exported:

```ts
notFound(resource)         // 404
unauthorized(message)      // 401
conflict(message)          // 409
validationError(message)   // 422
```

All throw an `ApiError extends Error` with `status` and `code` properties, which is what TanStack Query sees in `error.code`.

### `src/lib/api/db.ts` — IndexedDB schema

Database name: **`staybook`**. Version: **2**. Wrapped by [`idb`](https://github.com/jakearchibald/idb).

| Store | Key | Indexes | Purpose |
| --- | --- | --- | --- |
| `meta` | string | — | Seed-version tracking |
| `users` | `id` | `by-email` (unique) | Accounts |
| `sessions` | `token` | `by-user` | Auth sessions |
| `trips` | `id` | `by-user`, `by-status` | Itineraries |
| `bookings` | `id` | `by-user`, `by-trip` | Hotel + experience reservations |
| `favorites` | `id` | `by-user`, `by-entity` | Saved destinations / hotels |
| `expenses` | `id` | `by-trip`, `by-user` | Budget items |
| `notifications` | `id` | `by-user`, `by-read` | Inbox |
| `comments` | `id` | `by-trip`, `by-activity` | Activity threads |

The DB is opened lazily on first browser access. Upgrades happen inside an `upgrade(db, oldVersion)` callback that incrementally adds missing stores and indexes — so existing users don't lose their data when the schema evolves.

A `resetDb()` helper is exported for tests and the "wipe everything" button in the profile page.

### `src/lib/api/seed.ts` — version-based seeding

Three independent seed versions live in the `meta` store:

| Key | Current | Loads |
| --- | --- | --- |
| `seedVersion` | 1 | `data/user.json`, `data/trips.json` |
| `expensesSeedVersion` | 1 | `data/expenses.json` |
| `notificationsSeedVersion` | 1 | `data/notifications.json` |

When the app boots, each seed runs only if the stored version is below the current version. This keeps re-seeds cheap and idempotent.

### Domain modules

Each module under `src/lib/api/` is a thin object with `async` functions. They all go through `fakeRequest()` and touch IndexedDB directly. The verbs:

| Module | Verbs |
| --- | --- |
| `auth.ts` | `register`, `login`, `logout`, `getCurrentUser`, `updateProfile` |
| `trips.ts` | `listTrips`, `getTrip`, `createTrip`, `updateTrip`, `deleteTrip`, `addActivity`, `updateActivity`, `deleteActivity`, `moveActivity`, `reorderDayActivities`, `addCollaborator`, `removeCollaborator`, `addPhoto`, `removePhoto` |
| `bookings.ts` | `listBookings`, `getBookingById`, `createBooking`, `createItemBooking`, `cancelBooking`, `deleteBooking` |
| `hotels.ts` | `listHotels`, `getHotelById`, `getHotelsByIds`, `getHotelsByDestination`, `getHotelNeighborhoods`, `getHotelAmenities`, `getHotelPropertyTypes`, `getHotelPriceRange` |
| `destinations.ts` | `listDestinations`, `getFeaturedDestinations`, `getDestinationBySlug`, `getCategories`, `getAvailableActivities`, `getRelatedDestinations`, `getAttractionsByDestination`, `getDestinationsByIds`, `getPriceRange`, `getWeatherConditions`, `getDurations` |
| `expenses.ts` | `listExpenses`, `getExpensesByTrip`, `createExpense`, `updateExpense`, `deleteExpense` |
| `comments.ts` | `listComments`, `createComment`, `deleteComment`, `toggleReaction` |
| `favorites.ts` | `listFavorites`, `toggleFavorite` |
| `notifications.ts` | `listNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `dismissNotification` |
| `feed.ts` | `listFeedItems` |
| `reviews.ts` | `listReviews`, `getReviewsByHotel` |
| `people.ts` | `listPeople`, `getPerson` |

### Email outbox

`src/lib/api/email.ts` writes simulated emails (collaboration invites, booking confirmations, etc.) into a `localStorage` "outbox" and surfaces them with a toast. No real mail server is contacted. This keeps invite flows demonstrable end-to-end without a backend.

---

## State Management

### TanStack Query (server cache)

`src/app/providers.tsx` configures the global `QueryClient`:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});
```

Each feature ships a `keys.ts` file with a frozen query-key tree. Mutations use `setQueryData` for optimistic updates (e.g. favorites toggle) and `invalidateQueries` for confirmations. Paginated lists rely on `keepPreviousData` so the grid does not flash empty between page changes.

### Zustand stores

| Store | File | Persists |
| --- | --- | --- |
| `useAuthStore` | `src/stores/auth-store.ts` | `user`, `token` (localStorage `staybook.auth`) |
| `useUiStore` | `src/stores/ui-store.ts` | `sidebarCollapsed` (localStorage `staybook.ui`) |
| `useSocialStore` | `src/stores/social-store.ts` | follow graph (localStorage `staybook.social`) |

Stores are intentionally small. Anything that can live in TanStack Query lives in TanStack Query.

---

## Real-Time Collaboration

### `src/lib/realtime/channel.ts`

A unified pub-sub interface that fans out to two transports:

1. **`BroadcastChannel`** — built into every modern browser, enables instant messaging between tabs and windows of the same origin.
2. **Supabase Realtime** (optional) — enables messaging between completely different browsers and devices.

The module:

- Generates a stable `TAB_ID` per browser tab (sessionStorage).
- Tags every message with `{ tabId, type, payload, ts, id }`.
- Deduplicates messages via a sliding `seen` set (capacity 1000), so a message broadcast through both transports is only delivered once.
- Drops self-echoes by comparing `tabId`.
- Lazily creates a room on the first listener and tears it down when the last listener unsubscribes.
- Buffers outgoing messages in an outbox until the Supabase channel reports `subscribed`.

API:

```ts
broadcast<T>(room, type, payload, senderName?): RealtimeMessage<T>;
subscribe<T>(room, listener): () => void;
getTabId(): string;
```

### Rooms

Defined in `src/features/realtime/rooms.ts`:

```ts
tripRoom(tripId)        // "staybook:trip:<id>"
presenceRoom(tripId)    // "staybook:trip:<id>:presence"
commentsRoom(tripId)    // "staybook:trip:<id>:comments"
userRoom(userId)        // "staybook:user:<id>"
```

### Presence

`usePresence(tripId)` in `src/features/realtime/use-presence.ts`:

- Emits `presence:heartbeat` every 5 seconds with `{ id: tabId, userId, name, avatar, lastSeen }`.
- On `unload` / `pagehide` emits `presence:leave`.
- Prunes peers whose `lastSeen` is older than 30 seconds.

The `PresenceStack` component renders the avatars in the trip planner header.

### Trip realtime

`useTripRealtime(tripId)` (in `src/features/realtime/use-trip-realtime.ts`):

- Listens for `trip:updated`, `activity:added`, `activity:moved`, `activity:reordered`, `activity:deleted`.
- Invalidates the corresponding TanStack Query entry.
- Toasts a contextual message ("Maria reordered Day 2"). If a local mutation is in flight (`useIsMutating()`), the toast notes that the incoming change was merged on top of the user's pending edit.

### Comments

`useComments(tripId, activityId)` and `useCreateComment` / `useToggleReaction` broadcast `comment:added` and `comment:reacted` to the `commentsRoom`, so every collaborator's UI updates without a refresh.

### Cross-device transport (optional)

`src/lib/realtime/supabase.ts` creates a singleton Supabase client only when both env vars are present:

```ts
createClient(url, anonKey, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 20 } },
});
```

No tables. No rows. No auth. Just broadcast channels. If a row of either env var is missing, the entire Supabase branch is skipped, and collaboration is same-browser only via `BroadcastChannel`.

---

## Routing & Pages

### Route groups

- **`(auth)`** — public layout with a two-column hero design. Contains `/login`, `/register`.
- **`(app)`** — protected layout with the sidebar shell. Contains everything else.

### Page map

| Route | Description |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Mocked login with auto-filled demo credentials |
| `/register` | New-account creation |
| `/dashboard` | Live trip cards, analytics, budget overview, recent activity |
| `/dashboard/budget` | Donut + bar + area charts of all spend, multi-currency |
| `/dashboard/bookings` | Upcoming / past / cancelled tabs |
| `/dashboard/saved` | Favorited destinations and hotels |
| `/explore` | Destination discovery (grid view) |
| `/explore?view=map` | Same data, rendered on a Leaflet map |
| `/explore/[slug]` | Destination details, gallery, attractions map, reviews |
| `/booking` | Hotel search + filters + availability |
| `/booking/[hotelId]` | Hotel detail + reserve dialog + guest reviews |
| `/planner` | Trip picker (redirects to the first trip when present) |
| `/planner/[tripId]` | Itinerary board with drag-and-drop, six view modes, comments, presence, invite, AI fill |
| `/trips/[id]` | Public trip preview (read-only share view) |
| `/feed` | Public travel feed with like + follow |
| `/people` | Traveler directory with follow toggle |
| `/profile` | Edit profile, change avatar, currency, push permissions |

### Special files

| File | Role |
| --- | --- |
| `src/app/layout.tsx` | Root `<html>` / `<body>`, fonts, skip link, PWA register, providers |
| `src/app/providers.tsx` | TanStack Query, theme, tooltip, Sonner toaster, AuthBootstrap |
| `src/app/template.tsx` | Per-page transition wrapper |
| `src/app/not-found.tsx` | Custom 404 page |
| `src/app/(auth)/layout.tsx` | Auth split-screen with cover image |
| `src/app/(app)/layout.tsx` | Auth guard + sidebar + topbar shell |

---

## Feature Layer

Each folder in `src/features/` follows the same conventions:

- `api.ts` — re-exports the domain module from `src/lib/api/`.
- `keys.ts` — frozen TanStack Query keys.
- `hooks.ts` — `useThing`, `useCreateThing`, `useUpdateThing`, `useDeleteThing`.
- `components/` (when needed) — feature-specific UI.
- `index.ts` — public surface.

### Feature inventory

| Feature | Headline hooks |
| --- | --- |
| `auth` | `useLogin`, `useRegister`, `useLogout`, `useMe`, `useUpdateProfile` |
| `trips` | `useTrips`, `useTrip`, `useUpcomingTrips`, `useCreateTrip`, `useUpdateTrip`, `useDeleteTrip`, `useAddActivity`, `useUpdateActivity`, `useDeleteActivity`, `useMoveActivity`, `useReorderDay`, `useAddPhoto`, `useRemovePhoto`, `useAddCollaborator`, `useRemoveCollaborator` |
| `bookings` | `useBookings`, `useBooking`, `useCreateBooking`, `useCreateItemBooking`, `useCancelBooking`, `useDeleteBooking` |
| `hotels` | `useListHotels`, `useHotel`, `useHotelsByDestination`, `useHotelFilters` |
| `destinations` | `useDestinations`, `useDestination`, `useFeaturedDestinations`, `useAttractions`, `useRelatedDestinations`, `useDestinationFilters`, `useExploreView` |
| `expenses` | `useExpenses`, `useCreateExpense`, `useUpdateExpense`, `useDeleteExpense` |
| `favorites` | `useFavorites`, `useIsFavorite`, `useToggleFavorite` (optimistic) |
| `comments` | `useComments`, `useCreateComment`, `useDeleteComment`, `useToggleReaction` |
| `notifications` | `useNotifications`, `useUnreadCount`, `useMarkNotificationRead`, `useMarkAllNotificationsRead`, `useDismissNotification`, `useBrowserNotify` |
| `realtime` | `useChannel`, `usePresence`, `useTripRealtime` |

---

## UI, Design System & Theming

### Tokens

`src/styles/tokens.css` defines the entire palette through CSS variables. Light and dark variants are scoped to `:root` and `.dark`:

```css
:root {
  --color-bg: #f7f9fb;
  --color-surface: #ffffff;
  --color-text-primary: #191c1e;
  --color-text-muted: #76777d;
  --color-border: #c6c6cd;
  --color-sky-600: #00668a;
  --color-emerald-500: #009668;
  --color-error: #ba1a1a;
  /* spacing, radius, shadow, duration, typography… */
}

.dark {
  --color-bg: #0f1314;
  --color-surface: #1b1f20;
  --color-text-primary: #eff1f3;
  --color-border: #3a3e40;
  --color-sky-600: #7bd0ff;
  /* … */
}
```

Tailwind 4's `@custom-variant dark (&:where(.dark, .dark *))` makes every `dark:` utility respond to the `.dark` class on `<html>`, which is toggled by `next-themes`.

### Components

`src/components/ui/` ships hand-built primitives layered on Radix:

- `Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `Input`, `Skeleton`, `Spinner`, `Tooltip`, `EmptyState`, `Toaster`.

`src/components/shared/` ships the cross-page glue:

- **`CommandPalette`** — `cmdk`, opens on ⌘K / Ctrl+K, fuzzy-searches trips, destinations, hotels, settings.
- **`ThemeToggle`** — light / dark / system, persisted in localStorage.
- **`NotificationBell`** — unread count badge, dropdown list, mark-as-read, dismiss, real-time bridge.
- **`FavoriteButton`** — optimistic heart toggle for destinations / hotels / attractions.
- **`PwaRegister`** — registers `/sw.js`.
- **`BrowserNotificationsBridge`** — asks for OS permission once, then forwards toast events to the Notification API.
- **`NotificationsRealtimeBridge`** — invalidates the notifications query when a `notification:created` event arrives.
- **`TripRemindersBridge`** — fires local reminders when a trip start date is near.
- **`ChatbotWidget`** — floating AI travel assistant.
- **`VirtualList`** — windowing wrapper backed by `@tanstack/react-virtual`.

### Fonts

`src/app/layout.tsx` loads Plus Jakarta Sans for display, Inter for body, and JetBrains Mono for code via `next/font`.

---

## Maps (Leaflet)

`src/components/maps/leaflet-map.tsx` is a dynamic (`ssr: false`) wrapper around `react-leaflet`. It exposes a typed `markers` and `routes` prop, supports custom `divIcon` markers (six accent colors × three kinds: hotel / attraction / dining), draws a pulse-animated dot for the user's geolocation, and accepts a `flyTo` prop for programmatic recentering.

Tile layers switch on theme: **CARTO Voyager** in light mode and **CARTO Dark Matter** in dark mode, so the map blends with the surrounding UI.

The map appears in three places:

- `/explore?view=map` — destinations.
- `/explore/[slug]` — attractions around a destination.
- `/planner/[tripId]` (Map view) — activities and route polylines for a trip.

---

## PWA & Offline Support

- **`public/manifest.webmanifest`** — name "StayBook — Smart Travel Planner", standalone display, theme colors matching tokens, shortcuts to `/dashboard`, `/explore`, `/planner`.
- **`public/sw.js`** — version `staybook-v2`. Strategies:
  - `/_next/static/**` → cache-first.
  - `/assets/**`, `/icons/**`, `/images/**` → cache-first.
  - Navigations → network-first, fall back to `/offline.html`.
- **`public/offline.html`** — branded offline page served when navigation requests fail.
- **`PwaRegister`** component registers the service worker on first render of the root layout.
- `vercel.json` ships matching cache headers so the service worker and manifest behave correctly when deployed to Vercel.

Already-opened trip pages remain readable offline because their data is in IndexedDB, not on a server.

---

## How to Use the Application

This section walks through every major flow the way a first-time user would experience it.

### 1. Sign in

1. Open `http://localhost:3000` — you land on the marketing page.
2. Click **Sign in**.
3. The email and password fields are pre-filled with `alex@voyager.com` / `voyager2024`.
4. Submit. After a brief simulated network delay, you are redirected to `/dashboard`.
5. To register instead, click **Create an account**, fill in name, email and a password of at least 8 characters, and submit. Your new user is persisted in IndexedDB.

### 2. Dashboard

The dashboard summarises everything in one place:

- **Hero cards** — your next trip, total trips, countries visited, miles flown.
- **Live trip cards** — current and upcoming trips, click any card to open the planner.
- **Budget overview** — donut + sparkline of total spend across trips.
- **Recent activity** — last 40 collaborative events across your trips.
- Side rails: `Saved`, `Budget`, `Bookings`.

### 3. Discover destinations (`/explore`)

1. Use the toolbar to search ("Santorini", "Paris", "Bali").
2. Open the filters panel for price range, weather, duration, activities.
3. Toggle between **Grid** and **Map** with the top-right switch.
4. Click any card to open `/explore/[slug]` — a destination detail page with gallery, highlights, an attractions map, related destinations, and a "Save" heart.

### 4. Book a hotel (`/booking`)

1. Choose a destination, check-in / check-out dates, guests and rooms.
2. Browse the result grid; filter by price, amenities, neighbourhood.
3. Click a hotel card to open `/booking/[hotelId]` — full gallery, amenity matrix, reviews.
4. Click **Reserve** to open the dialog. The fields are pre-filled from the search bar; price totals update live.
5. Confirm to write a booking into IndexedDB. You're redirected to `/dashboard/bookings`, where the new entry appears under **Upcoming**.

### 5. Plan a trip (`/planner/[tripId]`)

The planner is the centerpiece of StayBook. It has six view modes selectable from the top of the page:

- **Board** — Kanban-style day columns. Drag activities between days or reorder within a day. Each day rotates through six accent colours.
- **Timeline** — Vertical day-by-day timeline.
- **Calendar** — Month-view calendar with activities pinned to dates.
- **Map** — Leaflet map of every activity with location, plus connecting polylines.
- **Budget** — Donut + bar + area charts of spend, broken down by day and category.
- **Album** — Trip photo gallery.

Inside any view you can:

- Click an activity to edit time, title, detail, cost, location, status.
- Use **+ Add activity** to open the editor.
- Attach files (PDF / image) to activities — stored as data URLs inside IndexedDB.
- Comment on an activity with emoji reactions.
- Click the **invite** button to add collaborators — they appear in the `PresenceStack` when they open the trip in any browser.
- Click **AI fill** to auto-generate a suggested day.

### 6. Real-time collaboration

To see real-time collaboration:

1. Open the same trip in two tabs (or two browsers if you've set the Supabase env vars).
2. In one tab, drag an activity to a different day.
3. In the other tab, watch the activity move and a toast appear ("Activity moved").
4. Open the **Activity feed** dialog to see a chronological log.

### 7. Budget management

- Inside the planner, the **Budget** view aggregates every activity's `cost` and adds explicit expense entries.
- Expenses can be added, edited and deleted in the planner's expense panel.
- Multi-currency conversion uses static USD-based reference rates in `src/lib/utils/currency.ts`.
- The dashboard `/dashboard/budget` page shows the same data across all trips.

### 8. Notifications

- The bell icon in the topbar shows the unread count.
- Click to see the inbox — mark individual items as read, dismiss them, or mark-all-as-read.
- If you grant the OS permission, the same events are delivered as real Notification-API toasts.

### 9. Profile

`/profile` lets you:

- Update name, location, bio.
- Upload an avatar (stored as a data URL).
- Switch preferred currency.
- Toggle browser-notification permission.
- Wipe local data (calls `resetDb()`).

### 10. Command palette

Press **⌘K** (macOS) or **Ctrl+K** (Windows/Linux) anywhere in the app to open the command palette. Fuzzy-search trips, destinations, hotels and settings.

### 11. Dark mode

Click the theme icon in the topbar to cycle through **System → Light → Dark**. The choice is persisted and respected across reloads.

### 12. Reset state

To wipe everything (useful when changing seeds or testing the cold-start flow):

- **In the app:** Profile → "Wipe local data".
- **In DevTools:** Application → IndexedDB → right-click `staybook` → Delete database, then reload.

---

## Data & Seed Files

All seed data lives in `src/data/` as committed JSON. The seed runner copies it into IndexedDB on first boot.

| File | Size | Contents |
| --- | --- | --- |
| `user.json` | ~470 B | Demo user "Alex Johnson", hashed password, preferences, stats |
| `trips.json` | ~8.6 KB | Pre-built itineraries with day-by-day activities |
| `destinations.json` | ~21 KB | ~15 destinations with metadata |
| `hotels.json` | ~24 KB | ~50 hotels with amenities, rooms, pricing, images |
| `attractions.json` | ~13 KB | POIs linked to destinations |
| `expenses.json` | ~2.1 KB | Sample trip expenses by category |
| `notifications.json` | ~3 KB | Sample inbox items |
| `feed.json` | ~5 KB | Activity feed items |
| `reviews.json` | ~9.2 KB | Hotel reviews |
| `people.json` | ~3.7 KB | Sample user profiles for `/people` |
| `transport.json` | ~2.3 KB | Sample flights / trains / buses |
| `booking.json` | ~100 B | Sample booking |

---

## Deployment

Any platform that supports Next.js 16 will work — Vercel, Netlify, Cloudflare, Fly, or self-host. The app is fully client-side after the initial HTML response; there are **no required environment variables** because the backend lives in the browser.

### Vercel (recommended)

```bash
npx vercel deploy --prod
```

Or import the GitHub repository at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects the framework, runs `npm run build`, and ships a public URL. The bundled `vercel.json` ships the correct cache headers for the service worker, manifest, and icons.

### Self-host

```bash
npm run build
npm run start
```

---

## Known Limitations

Because this is a frontend-only build with a mocked, in-browser backend, a few features are intentionally simulated rather than wired to a real server.

- **Passwords are not cryptographically hashed.** They are Base64-encoded for portability between browser and Node. Replace `hashPassword`/`verifyPassword` in `src/lib/api/seed.ts` before shipping anything real.
- **Real-time collaboration defaults to same-browser only.** Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable cross-device sync via Supabase Realtime. Even then, only ephemeral broadcast messages travel — no tables, no rows, no Supabase-side state.
- **Currency conversion uses fixed reference rates.** `src/lib/utils/currency.ts` ships a static USD-based table instead of calling a live FX API, so conversions are deterministic and offline-friendly. Swap in a rates endpoint to make them live.
- **Email notifications are simulated.** With no mail server, collaboration invites and notification emails are written to an in-browser outbox (`localStorage` + console, see `src/lib/api/email.ts`) and surfaced with a toast, rather than actually leaving the browser.
- **Push notifications are foreground-only.** The service worker precaches the shell, serves visited pages from cache, and shows a branded offline page when a route can't be reached — but true server-pushed notifications require a backend push service. Because trips live in IndexedDB, already-opened itineraries remain readable offline.
- **Sessions are mocked.** Auth tokens are random IDs persisted in IndexedDB with a 14-day expiry; there is no JWT signing server.

---

## License

No license file ships with this repository.