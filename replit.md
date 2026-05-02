# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Mobile App — 1st Koko Spot (`artifacts/mobile`)

Expo/React Native food ordering app for a West African restaurant.

### Features
- Supabase backend (products, orders, order_items, profiles tables)
- Supabase Auth (email/password sign-in + sign-up with auth gate)
- Paystack payment integration (GHS currency, WebView-based checkout)
- Dark mode (Light / Dark / System — persisted via AsyncStorage)
- Netflix-style promo carousel + Flash Deals countdown
- Category filtering, product detail pages, cart
- All profile sub-pages: Saved Addresses, Payment Methods, Promo Codes, Loyalty Points, Notifications, Dark Mode, Language, Help Center, Privacy Policy, Terms of Service, Delete Account

### EAS / App Store Config
- App name: "1st Koko Spot"
- Bundle ID (iOS): `com.firstkokospot.app`
- Package (Android): `com.firstkokospot.app`
- Scheme: `firstkokospot`
- See `artifacts/mobile/APP_STORE_TODO.md` for full launch checklist

### Key Files
- `artifacts/mobile/app.json` — Expo config with bundle IDs
- `artifacts/mobile/eas.json` — EAS build profiles
- `artifacts/mobile/context/AuthContext.tsx` — Supabase auth
- `artifacts/mobile/context/ThemeContext.tsx` — Dark mode state
- `artifacts/mobile/lib/supabase.ts` — Supabase client
- `artifacts/mobile/APP_STORE_TODO.md` — App Store launch checklist

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
