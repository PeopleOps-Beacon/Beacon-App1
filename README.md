# Beacon OS 3.0

Beacon OS 3.0 is a React, TypeScript, and Vite pilot application for airport environmental intelligence and traveler-aware indoor navigation.

The current build supports multi-airport pilot configuration, searchable terminal destinations, graph-based route generation, traveler mode personalization, accessibility settings, saved destinations, airport information pages, local notification scaffolding, and offline-readiness helpers.

## Current Capabilities

- Pilot airport switching for GSP, AVL, and CLT.
- Airport-scoped maps, locations, accessibility resources, and information pages.
- Intelligent destination search with fuzzy matching, synonyms, categories, keywords, terminal names, and gate numbers.
- Interactive SVG terminal map with zoom, pan, current position, destination highlighting, and route overlays.
- Graph-based navigation engine using Dijkstra shortest path.
- Turn-by-turn route instructions with distance, estimated time, and remaining distance.
- Traveler modes for Veteran PTSD, Sensory, Accessibility, Family, Business, and International travelers.
- Persisted traveler preferences, themes, reduced motion, large text, high contrast, notifications, favorites, and pinned destinations.
- Firebase-ready account access in preview mode.
- Local analytics, mock notifications, and offline manifest helpers.
- Smart route comparison, simulated airport conditions, mock flights, services directory, emergency assistance, map layers, voice guidance scaffolding, and admin configuration summary.

## Setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` if Firebase auth should be connected.
3. Add Firebase web app values to `.env.local`.
4. Run `pnpm run dev`.

## Verification

Use these checks before deployment:

- `pnpm run test`
- `pnpm run lint`
- `pnpm run build`

## Project Docs

- `ROADMAP.md`: sprint history, architectural decisions, limitations, and next steps.
- `ARCHITECTURE.md`: platform architecture and data flow.
- `COMPONENTS.md`: reusable UI and feature component guide.
- `CONTRIBUTING.md`: local development and quality expectations.
- `API.md`: mock API client and future integration boundary.
- `SERVICES.md`: service abstraction guide.
- `ADMIN_CONFIGURATION.md`: admin configuration scope and future editing model.

## Security Notes

Firebase credentials must stay in environment variables. Do not commit `.env.local`. Firebase Authentication should enforce authorized domains and provider restrictions before production use.
