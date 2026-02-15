# Nosso Enxoval

## Overview

"Nosso Enxoval" is a wedding home essentials and gift checklist mobile application built with React Native (Expo) and an Express.js backend. It helps couples organize their new home essentials while allowing guests and family to participate by choosing items to gift, preventing duplicate gifts.

The app is entirely in Brazilian Portuguese (pt-BR) and supports two user roles:
- **Couple (Noivos)**: Full control — add, edit, delete items; mark as purchased; see who gifted each item; view overall progress.
- **Guests (Convidados)**: View the list, choose items to gift, mark items as "reserved" with their name and optional message.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)
- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture
- **Routing**: expo-router with file-based routing (`app/` directory). Uses Stack navigation with modal presentations for forms (gift-item, add-item, thank-you screens use `formSheet` presentation)
- **State Management**: React Context (`AppContext`) combined with TanStack React Query for server state. Auth state persisted via AsyncStorage
- **UI**: Custom components with react-native-reanimated for animations, react-native-gesture-handler, expo-haptics for tactile feedback, expo-linear-gradient for gradients
- **Fonts**: Inter and Playfair Display via @expo-google-fonts
- **Key Screens**:
  - `index.tsx` — Welcome/landing with role selection
  - `couple-login.tsx` / `guest-login.tsx` — Code-based authentication modals
  - `couple-dashboard.tsx` / `guest-dashboard.tsx` — Role-specific dashboards showing room-based item organization with progress stats
  - `room/[roomId].tsx` — Room detail view with item list
  - `gift-item.tsx` — Guest gifting flow (form sheet modal)
  - `add-item.tsx` — Couple item creation (form sheet modal)
  - `thank-you.tsx` — Post-gift confirmation

### Backend (Express.js)
- **Runtime**: Node.js with Express v5, TypeScript compiled via tsx (dev) or esbuild (prod)
- **API Design**: RESTful JSON API under `/api/` prefix
- **Authentication**: Simple code-based verification (no sessions/JWT). Couple code: `1234`, Guest code: `casamento2026`. Hardcoded in `server/routes.ts`
- **Key Endpoints**:
  - `POST /api/auth/verify` — Validate access codes
  - `GET /api/items` — List all items
  - `POST /api/items` — Create item (couple)
  - `PATCH /api/items/:id` — Update item status/details
  - `DELETE /api/items/:id` — Remove item
  - `POST /api/items/:id/reserve` — Guest reserves an item
  - `POST /api/items/:id/gifted` — Mark as purchased
  - `POST /api/items/:id/unreserve` — Cancel reservation
- **CORS**: Configured dynamically based on Replit environment variables, also allows localhost origins for dev

### Database
- **PostgreSQL** via `pg` driver with Drizzle ORM
- **Schema** (`shared/schema.ts`):
  - `users` table: id (UUID), username, password (exists in schema but not actively used for auth)
  - `items` table: id (UUID), room (text), name (text), status (text, default 'available'), guest_name, guest_message, reserved_at (bigint)
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Seeding**: `server/storage.ts` seeds default items on first run if the items table is empty. ~35 default household items across 7 rooms

### Shared Code
- `shared/schema.ts` — Drizzle schema definitions and Zod validation schemas, shared between server and client
- `lib/data.ts` — Room definitions and TypeScript types used on the frontend
- Path aliases: `@/*` maps to root, `@shared/*` maps to `./shared/*`

### Build & Deployment
- **Dev**: Two processes — `expo:dev` for the mobile/web frontend, `server:dev` for the Express backend
- **Prod**: Frontend built as static web export via custom `scripts/build.js`, backend bundled with esbuild to `server_dist/`
- The Express server serves the static web build in production and includes a landing page template

### Design System
- Warm, wedding-themed color palette defined in `constants/colors.ts` (golds, soft pinks, cream backgrounds)
- Item statuses: `available` (gray), `reserved` (yellow), `gifted` (green) with corresponding light variants
- Components: ProgressBar, StatusBadge, ErrorBoundary, KeyboardAwareScrollViewCompat

## External Dependencies

### Database
- **PostgreSQL**: Connected via `DATABASE_URL` environment variable. Used with Drizzle ORM (`drizzle-orm/node-postgres`)

### Key NPM Packages
- **expo** (~54.0.27) — Mobile framework
- **expo-router** (~6.0.17) — File-based routing
- **express** (^5.0.1) — Backend HTTP server
- **drizzle-orm** (^0.39.3) + **drizzle-kit** — Database ORM and migration tooling
- **@tanstack/react-query** (^5.83.0) — Server state management
- **pg** (^8.16.3) — PostgreSQL client
- **zod** + **drizzle-zod** — Schema validation

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `EXPO_PUBLIC_DOMAIN` — API server domain for client-server communication
- `REPLIT_DEV_DOMAIN` — Used for CORS and Expo proxy configuration
- `REPLIT_DOMAINS` — Additional allowed CORS origins