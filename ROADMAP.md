# Beacon OS Roadmap

## Sprint 1 - App Foundation

Built the React, TypeScript, and Vite foundation for Beacon OS 3.0, including Firebase-ready account access, traveler mode selection, airport intelligence styling, operations controls, and baseline tests.

## Sprint 2 - Core Navigation MVP

Status: in progress on `sprint-2-core-navigation-mvp`.

### Built

- Scalable airport location model with sample Terminal A data.
- Centralized React Context state for traveler mode, destination, current location, recent searches, navigation state, operations, and preferences.
- Intelligent destination search with fuzzy matching, keyword matching, keyboard navigation, clear action, and recent searches.
- Interactive SVG terminal map with clickable and keyboard-selectable locations, mock current position, highlighted destination, zoom, pan, and route rendering.
- Destination details panel with accessibility features, terminal/floor, walking estimate, supported traveler modes, and nearby amenities.
- Mock navigation panel with distance, estimated walk time, step count, route steps, traveler-mode guidance, and arrival confirmation.

### Architectural Decisions

- Keep navigation domain logic in `src/utils` so future real indoor positioning or airport APIs can replace mock route generation without rewriting UI components.
- Use React Context for Sprint 2 state because the MVP state is cohesive and does not yet require an external store.
- Store map coordinates as normalized SVG percentages so future GIS or beacon positioning data can be transformed into the same UI model.

### Known Limitations

- Route geometry is mocked and does not account for walls, closed paths, or live airport conditions.
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
- Settings panel, favorites, pinned destinations, category browser, airport information panel, mock notification framework, and offline readiness helpers.
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
- Mock flight information module with flight search, detail state, and future API-ready service boundary.
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

## Sprint 5 Candidates

- Replace generated graph edges with real airport indoor graph data.
- Add real accessibility-safe path constraints, closures, and live route alternatives.
- Add indoor positioning and Bluetooth beacon data hooks.
- Register production service worker caching for offline maps and search.
- Connect airport API data for gates, delays, amenities, and service availability.
