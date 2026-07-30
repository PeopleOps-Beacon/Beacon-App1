# Beacon OS Roadmap

## Sprint 1 - App Foundation

Built the React, TypeScript, and Vite foundation for Beacon OS 3.0, including Firebase-ready account access, traveler mode selection, airport intelligence styling, operations controls, and baseline tests.

## Sprint 2 - Core Navigation MVP

Status: implemented on `sprint-2-core-navigation-mvp`.

### Built

- Scalable airport location model with sample Terminal A data.
- Centralized React Context state for traveler mode, destination, current location, recent searches, navigation state, operations, and preferences.
- Intelligent destination search with fuzzy matching, keyword matching, keyboard navigation, clear action, and recent searches.
- Interactive SVG terminal map with clickable and keyboard-selectable locations, pilot current position, highlighted destination, zoom, pan, and route rendering.
- Destination details panel with accessibility features, terminal/floor, walking estimate, supported traveler modes, and nearby amenities.
- Navigation panel with distance, estimated walk time, step count, route steps, traveler-mode guidance, and arrival confirmation.

### Architectural Decisions

- Keep navigation domain logic in `src/utils` so future real indoor positioning or airport APIs can replace pilot route generation without rewriting UI components.
- Use React Context for Sprint 2 state because the MVP state is cohesive and does not yet require an external store.
- Store map coordinates as normalized SVG percentages so future GIS or beacon positioning data can be transformed into the same UI model.

### Known Limitations

- Route geometry is generated from pilot terminal data and does not account for walls, closed paths, or live airport conditions.
- The map is a simplified SVG, not a real indoor GIS map.
- Firebase credentials remain environment-driven and are not required for local preview mode.

## Sprint 3 - Platform Architecture & Pilot Readiness

Status: implemented on `sprint-3-platform-pilot-readiness`.

### Built

- Multi-airport configuration for GSP, AVL, and CLT with airport-specific branding, terminals, maps, accessibility resources, information pages, and locally scoped location data.
- Seamless airport switching with persisted selection and airport-scoped locations, notifications, offline metadata, and map/search context.
- Graph-based navigation engine using Dijkstra shortest path over generated airport nodes and edges.
- Turn-by-turn route instructions with remaining distance metadata, estimated time, and progress-ready route state.
- Expanded traveler preferences with persisted theme, walking speed, sensory sensitivity, large text, reduced motion, high contrast, language, and notification settings.
- Settings panel, favorites, pinned destinations, category browser, airport information panel, local notification framework, and offline readiness helpers.
- Analytics service abstraction for feature usage, search, destination, mode, navigation, settings, airport switching, and favorites events.
- Reusable UI primitives for button, card, and badge styles.

### Architectural Decisions

- Airport configuration owns locations and information pages so pilot deployments can be added without changing app-level navigation code.
- Dijkstra routing lives in `src/utils/pathfinder.ts` and emits the same `Route` contract used by the UI, leaving room for A*, dynamic rerouting, or live constraints in Sprint 4.
- Local storage persistence is wrapped in `src/services/storage.ts` to keep browser APIs out of feature components and simplify future cloud sync.
- Notification and analytics services are intentionally local abstractions; no external providers are connected yet.

### Known Limitations

- Floor maps are still rendered through the configurable SVG layer rather than imported asset files or GIS.
- Offline support prepares manifests and local data scopes but does not register a production service worker yet.
- Routing graph is generated from proximity and does not yet model walls, closures, escalator direction, or live congestion.

## Sprint 4 Candidates

## Sprint 4 - Enterprise Features & Smart Guidance

Status: implemented on `sprint-4-enterprise-smart-guidance`.

### Built

- Smart route comparison for fastest, accessible, quietest, family, least walking, fewest elevators, fewest stairs, and wheelchair-optimized route options.
- Simulated airport operations conditions that influence route warnings and smart notifications.
- Contextual notification engine with priority, mode targeting, dismissal, and history-ready metadata.
- Pilot flight information module with flight search, detail state, and future API-ready service boundary.
- Personalized dashboard, emergency assistance shortcuts, services directory, alerts center, map layer toggles, voice guidance queue, admin configuration panel, diagnostics, and feature flags.
- Multilingual resource dictionaries for English, Spanish, French, German, and Japanese.
- API client abstraction with caching, retries, typed results, and error path.
- Expanded settings for route preference, language, voice guidance, theme, accessibility, notifications, walking speed, and sensory sensitivity.

### Architectural Decisions

- Smart routing wraps the existing graph route contract with route scoring, route difficulty, accessibility score, and condition warnings.
- API, analytics, notification, diagnostics, voice, and enterprise data access are separate services so Sprint 5 can connect production providers with minimal UI churn.
- Admin configuration is data-driven and read-only for this sprint, preserving a safe pilot demonstration surface.

### Known Limitations

- Conditions are simulated and not connected to live airport operations feeds.
- Voice guidance creates a typed queue but does not invoke browser speech synthesis yet.
- The admin module is read-only and unauthenticated.

## Sprint 5 - Pilot-Ready MVP

Status: completed for local pilot demonstration hardening.

### Built

- Firebase-compatible account access with local pilot sessions, account creation, Remember Me, password reset, profile editing, role selection, secure logout, and account deletion flow.
- Application recovery boundary, diagnostics logging, and visible system status checks for internet, positioning, airport data, routing, and API fallback readiness.
- Airport administration workspace for gates, restaurants, amenities, accessibility locations, announcements, and service disruptions with airport-scoped local persistence.
- Analytics dashboard for active users, airports viewed, routes generated, accessibility updates, errors, session duration, feature usage, and recent events.
- Pilot user guide, airport administrator guide, deployment guide, release notes, and manual QA checklist.
- Production service-worker registration for app-shell offline recovery.
- Accessibility needs controls that map wheelchair, mobility, sensory, anxiety, vision, hearing, and family support needs to safe route profiles.

### External Production Prerequisites

- Connect approved live airport data feeds and authenticated administrative storage.
- Enforce roles through Firebase custom claims or the selected identity provider.
- Complete unrestricted test, lint, build, WCAG 2.2 AA, and manual QA passes.

### Phase 1 Review Findings

- Architecture remains a client-side React/Vite app with React Context state, typed local airport data, and service boundaries for future APIs.
- No database schema or API routes exist yet; airport/admin state is local pilot data.
- Authentication is Firebase-compatible, but production authorization still requires provider-backed roles or Firebase custom claims.
- Accessibility gaps found in combobox state, admin validation feedback, and role visibility have been addressed in this pass.
- Route comparison previously rebuilt navigation graphs for every route option; graph reuse is now in place for the smart-routing comparison.
- E2E and automated accessibility tests are still missing and remain release blockers before a live pilot.

## Sprint 5 Candidates

- Replace generated graph edges with real airport indoor graph data.
- Add real accessibility-safe path constraints, closures, and live route alternatives.
- Add indoor positioning and Bluetooth beacon data hooks.
- Register production service worker caching for offline maps and search.
- Connect airport API data for gates, delays, amenities, and service availability.


## Sprint 7 - Operations Intelligence and Enterprise Dashboard

Status: implemented for local enterprise demonstration.

### Built

- Role-based experience layer with demo switching for traveler and airport personnel roles.
- Operations dashboard with reusable widgets for traveler volume, waits, crowd density, accessibility, notifications, incidents, construction, closures, and staff alerts.
- Live event simulation engine for airport operational events while Demo Mode is active.
- Crowd heatmap, airport analytics, incident management, accessibility monitoring, staff task queue, and notification timeline.
- Airport alerts service combining configured alerts and simulated high-priority events.
- Advanced search filters and sorting across restaurants, retail, restrooms, services, accessibility, transportation, emergency, lounges, and parking.
- Demo data generator for enterprise-scale mock travelers, staff, notifications, incidents, destinations, crowd levels, and heatmaps.

### Known Limitations

- Operational events, travelers, staff, incidents, analytics, and heatmaps are mocked for demonstration.
- Role switching is local demo state, not production authorization.
- Real-time integrations still require approved airport operations, flight, security, facilities, and accessibility data feeds.


## Sprint 8 - Executive Demo and Enterprise Polish

Status: implemented for investor-ready and airport-demo polish.

### Built

- Executive landing page and CTA flow.
- Presenter-controlled executive demo mode with automated scenario context.
- Guided product tour for first-time users and stakeholder walkthroughs.
- Enterprise design system tokens, subtle animations, reduced-motion support, loading components, branding surfaces, and centralized error handling.
- Enhanced traveler dashboard and expanded settings for presentation, privacy, reset, and theme controls.

### Recommended Sprint 9 Priorities

- Replace deterministic demo data with a configurable demo script builder.
- Add downloadable executive one-pager and pilot proposal artifacts.
- Add real API integration adapters behind the existing service boundaries.
- Add automated accessibility tests with axe and browser-based keyboard traversal.
- Split additional dashboard/vendor chunks if production bundle budgets require it.
