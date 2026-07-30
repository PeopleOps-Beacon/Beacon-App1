# Beacon

Beacon is an accessibility-focused airport wayfinding and traveler-support proof of concept. It demonstrates personalized route planning, landmark-based guidance, contextual journey alerts, traveler services, assistance workflows, and simulated airport operations in a responsive web application.

The active experience is centered on a fictionalized Greenville-Spartanburg International Airport (GSP) journey. Additional airport configurations support product demonstrations for Asheville Regional Airport (AVL) and Charlotte Douglas International Airport (CLT). Airport routes, operating conditions, flights, alerts, assistance requests, analytics, and administrative actions are simulated unless explicitly documented otherwise.

Beacon is not endorsed by an airport, does not provide emergency services, and does not currently connect to live airport, airline, indoor-positioning, or dispatch systems.

## Technology Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS
- Vitest and Testing Library
- Firebase Authentication SDK (optional configuration)
- Framer Motion and GSAP
- Three.js, React Three Fiber, and Drei
- Lucide React icons
- pnpm with a committed lockfile
- Browser local storage and session storage for demo persistence

Beacon is currently a responsive web application. The mobile experience is implemented in React under `src/poc/mobile`; there is no Flutter, native iOS, or native Android project in this repository.

## Prerequisites

- Node.js 20 LTS or newer is recommended.
- pnpm is required. It can be enabled through Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Installation

1. Clone the private repository and enter the project root:

```bash
git clone <private-repository-url>
cd Beacon-OS
```

2. Install the exact dependency graph from the lockfile:

```bash
pnpm install --frozen-lockfile
```

3. Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

4. Replace placeholder Firebase values only if Firebase sign-in is needed. The pilot/demo authentication flow works without Firebase configuration.

5. Start the application:

```bash
pnpm run dev
```

Vite will print the local preview URL, normally `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env.local`. Never commit `.env.local` or another credential-bearing environment file.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Optional | Firebase web API key used by the optional Firebase authentication integration. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Optional | Firebase authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | Optional | Firebase project identifier. |
| `VITE_FIREBASE_APP_ID` | Optional | Firebase web application identifier. |

All four Firebase variables must be supplied together to initialize Firebase. When they are absent, Beacon remains available in local pilot/demo mode.

Vite exposes variables prefixed with `VITE_` to browser code. Do not place server secrets, private keys, service-account credentials, or privileged database credentials in a `VITE_` variable.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start the Vite development server. |
| `pnpm run build` | Type-check the project and create a production build in `dist/`. |
| `pnpm run test` | Run the Vitest test suite once. |
| `pnpm run lint` | Run ESLint across the project. |
| `pnpm run format` | Format project files with Prettier. |

## Current Features

- Mobile-first passenger journey with home, trips, traveler services, support, and navigation tabs.
- Starting-point and destination selection with search and category browsing.
- Graph-based route calculation with time, distance, accessibility, crowd, noise, closure, and elevator metadata.
- Traveler profiles and preferences for mobility support, sensory support, stair avoidance, wheelchair access, larger text, simpler directions, additional time, reassurance, restroom stops, and quiet-space stops.
- Route comparison and preference-aware routing.
- Step-by-step active navigation with progress, route maps, landmark imagery, and concise instructions.
- Step-aware contextual guidance generated from the active step, nearby landmark, traveler preferences, route conditions, and destination.
- Simulated route conditions including congestion, construction, closures, gate changes, elevator outages, noise, and amenity availability.
- GSP landmark previews using documented supplied media plus clearly labeled simulated visuals.
- Simulated traveler assistance requests with emergency-service disclaimers.
- Traveler services, favorites, recent destinations, notifications, and informational content.
- Role-aware pilot sign-in for travelers, airport administrators, and Beacon administrators.
- Optional Firebase authentication initialization when all required Firebase variables are present.
- Airport administration screens for locations, route segments, alerts, accessibility conditions, announcements, disruptions, and assistance requests.
- Simulated executive insights, analytics, operational intelligence, incident management, task queues, crowd visualization, and system status.
- Configurable airport data for GSP, AVL, and CLT demonstrations.
- Responsive layouts, keyboard support, semantic controls, visible focus states, reduced-motion support, and larger-text options.
- Production service-worker registration for basic app-shell caching.
- Automated tests covering route logic, operational alerts, contextual guidance, services, dashboards, mobile screens, and key passenger workflows.

## Project Structure

```text
Beacon-OS/
├── public/                     Static assets, brand files, manifest, and service worker
├── src/
│   ├── assets/                 Beacon, GSP, and simulated journey imagery
│   ├── brand/                  Brand asset registry
│   ├── components/             Shared product, traveler, admin, and operations UI
│   ├── context/                Application and role contexts
│   ├── data/                   Airport, location, traveler-mode, and enterprise demo data
│   ├── hooks/                  Shared React hooks
│   ├── lib/                    Optional external library configuration
│   ├── pages/                  Landing, demo, and operations pages
│   ├── poc/                    Active Beacon wayfinding proof of concept
│   │   ├── components/         Journey, route, map, alert, admin, and insight components
│   │   └── mobile/             Responsive mobile web application shell and screens
│   ├── services/               Auth, alerts, analytics, AI, recommendations, and demo services
│   ├── test/                   Shared test setup
│   ├── theme/                  Design system and animation definitions
│   ├── types/                  Shared TypeScript declarations
│   └── utils/                  Navigation, routing, search, offline, and operations utilities
├── stage2-visual-audit/        Visual-review evidence and audit documentation
├── .env.example                Placeholder-only optional Firebase configuration
├── package.json                Scripts and dependency declarations
├── pnpm-lock.yaml              Reproducible dependency lockfile
├── vite.config.ts              Vite configuration
├── vitest.config.ts            Test configuration
└── *.md                        Architecture, deployment, operations, product, and QA documentation
```

Important implementation entry points:

- `src/main.tsx` mounts the React application.
- `src/App.tsx` mounts the active Beacon wayfinding experience.
- `src/poc/BeaconWayfindingApp.tsx` coordinates the passenger journey and admin handoff.
- `src/poc/routeEngine.ts` contains graph-based route calculation and operational alert selection.
- `src/poc/contextualGuidance.ts` produces step-aware journey guidance.
- `src/poc/mockData.ts` contains fictionalized airport journey data and simulated conditions.
- `src/poc/components/TerminalMap.tsx` renders the terminal and route visualization.
- `src/poc/components/AdminDashboard.tsx` provides the local demonstration admin experience.
- `src/lib/firebase.ts` initializes optional Firebase authentication.

## Data and Persistence

The current repository has no production database, database schema, ORM configuration, or migration files. Application data is supplied by TypeScript demo fixtures and service modules. Selected pilot-session and preference data may be stored in browser local storage or session storage.

A production implementation will need a backend, durable database, authorization model, audit logging, data-retention policy, secret management, and migrations before real airport or traveler data is used.

## Known Incomplete Features

- Indoor positioning, live location updates, and automatic rerouting are simulated.
- Airport maps and route geometry are simplified and are not operational navigation data.
- Flight status, gate changes, congestion, closures, elevator status, alerts, and service availability are simulated.
- Assistance requests do not contact airport staff, emergency services, or dispatch systems.
- Admin changes and operational actions are not backed by a production database.
- Firebase is optional and limited to client authentication setup; production identity, authorization, and account administration are incomplete.
- Executive metrics, analytics, AI recommendations, incidents, task queues, and operational dashboards use demonstration data.
- Full offline operation is incomplete; the service worker provides basic app-shell caching only.
- Native iOS, native Android, Flutter, App Store, and Google Play packaging are not included.
- Live airline, airport-operations, indoor-map, accessibility-service, and notification-provider integrations are not implemented.
- Production privacy, security, accessibility, airport approval, media-rights, and operational-readiness reviews remain required.

## Documentation

Additional project documentation includes:

- `ARCHITECTURE.md`
- `DEPLOYMENT_GUIDE.md`
- `DeveloperGuide.md`
- `MOBILE_APP_RUNBOOK.md`
- `AIRPORT_ADMIN_GUIDE.md`
- `ADMIN_CONFIGURATION.md`
- `API.md`
- `SERVICES.md`
- `ROADMAP.md`
- `RELEASE_NOTES.md`
- `MANUAL_QA_CHECKLIST.md`
- `BRANDING_CONSTRAINTS.md`
- `BEACON_BRAND_CONSTRAINTS.md`
- `GSP_MEDIA_ASSET_REVIEW.md`
- `GSP_PHOTOGRAPHY_REQUEST_LIST.md`
- `VISUAL_PREVIEW_GUIDE.md`

## Security and Repository Transfer

- Keep the GitHub repository private.
- Never commit `.env`, `.env.local`, credentials, access tokens, private keys, certificates, local databases, logs, dependency folders, build output, or transfer archives.
- Review staged changes with `git diff --cached` before every commit.
- Use the destination repository's secret manager or deployment platform for real environment values.
- Rotate any credential immediately if it is ever committed, even if the commit is later removed.

## Brand and Data Disclaimer

Beacon brand constraints are documented in `BRANDING_CONSTRAINTS.md` and `BEACON_BRAND_CONSTRAINTS.md`. GSP media usage is documented in `GSP_MEDIA_ASSET_REVIEW.md`.

The project does not claim official airport endorsement. Do not use the demonstration for real-world navigation, safety-critical routing, emergency response, or operational decisions.
