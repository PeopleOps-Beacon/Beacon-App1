# Beacon OS Release Notes

## Sprint 5 - Pilot-Ready MVP Pass

### Added

- Email/password session workflow with Remember Me and account creation.
- Password reset path for Firebase and safe pilot-mode messaging.
- User profile editing, role selection, secure logout, and account deletion flow.
- Device-local pilot sessions that do not store passwords.
- React error boundary with recovery view and diagnostics logging.
- System status panel for internet, positioning, airport data, routing, and API fallback readiness.
- Airport administration dashboard with local management for location status, announcements, and service disruptions.
- Analytics dashboard for active users, airports viewed, routes generated, accessibility updates, errors, session duration, feature usage, and recent events.
- Pilot user, admin, deployment, and release documentation.
- Production service-worker registration for app-shell offline recovery.
- Accessibility needs controls for wheelchair, mobility, anxiety reduction, autism/sensory, vision, hearing, service animal, and family support.

### Improved

- Route preference settings now include all smart-route options and update active route selection.
- Accessibility needs now select the closest safe route profile automatically.
- Operations simulator now influences conditions, smart notifications, and route recommendations.
- Removed unfinished dashboard copy.

### External Production Prerequisites

- Connect live airport data feeds and authenticated admin storage.
- Enforce production roles through Firebase custom claims or an approved identity provider.
- Complete full test, lint, build, accessibility, and manual QA runs in an unrestricted environment.


## Sprint 6 - AI Intelligence and Personalization

### Added

- Beacon AI service facade with mocked route suggestions, destination recommendations, break suggestions, quiet-area, dining, restroom, exit, congestion, travel-time, and stress-score methods.
- Profile-aware route recommendation engine returning recommended route, alternative route, estimated time, accessibility notes, crowd level, noise level, and recommendation reason.
- Expanded traveler profiles for Veteran PTSD, Wheelchair, Family, Business Traveler, Sensory Sensitive, and International modes.
- Smart notification model with category, severity, priority, read/unread state, timestamp, and sorting support.
- Recommendation cards with local favorite actions and destination selection.
- Local favorites service and recent-destination service with a 10-item recents cap.
- AI dashboard widgets for airport status, walking time, crowd, noise, stress, suggested destination, break recommendation, and active notifications.
- Mock airport intelligence for crowd heatmaps, construction zones, closed walkways, wait times, parking occupancy, and weather alerts.
- Settings toggles for AI recommendations, smart notifications, reduced walking distance, accessible routes, crowd avoidance, and noise avoidance.

### Improved

- Search now handles broader airport synonyms, categories, partial matches, and small typos.
- Route selection can automatically use profile and preference signals when AI recommendations are enabled.
- Notifications now expose pilot-ready metadata in the UI.

### Validation

- TypeScript diagnostics: zero errors through the local compiler API.
- ESLint: zero messages through the local ESLint API.
- Normal package-script execution remains blocked in the Codex sandbox; run `pnpm run test`, `pnpm run lint`, and `pnpm run build` in the open PowerShell window before production review.


## Sprint 7 - Operations Intelligence and Enterprise Dashboard

### Added

- Role system for Traveler, Airport Operations, Guest Services, Accessibility Coordinator, Airport Administrator, Emergency Response, and Demo Mode.
- Demo Role Selector for local development and executive walkthroughs.
- Lazy-loaded Operations Dashboard with widgets for current travelers, average wait time, crowd density, accessibility requests, notifications, incidents, construction zones, closed areas, and staff alerts.
- Live event simulation for gate changes, medical emergencies, fire alarms, construction, restroom closures, elevator outages, congestion, weather delays, flight delays, and cancellations.
- Crowd heatmap, analytics dashboard, incident center, accessibility monitoring, staff task queue, and notification timeline.
- Airport alert aggregation service for static and simulated alerts.
- Advanced search filters for restaurants, retail, restrooms, services, accessibility, transportation, emergency, lounges, and parking with sorting by distance, accessibility, popularity, and walking time.
- Deterministic demo data generator for 500 travelers, 50 staff, 100 notifications, 25 incidents, 100 destinations, crowd levels, and heatmaps.

### Improved

- Enterprise dashboard is code-split with React.lazy.
- Operations panels use memoized components and memoized selectors for generated data, events, alerts, and search results.
- Alerts surface through the shared Airport Alerts service.


## Sprint 8 - Executive Demo and Enterprise Polish

### Added

- Executive landing page with mission, product workflow, traveler, airport, accessibility, veteran, AI, and enterprise dashboard messaging.
- Executive Demo Mode with eight presenter scenarios: veteran PTSD, wheelchair traveler, family, blind/low-vision traveler, business traveler, senior traveler, first-time airport visitor, and airport operations.
- Guided Product Tour with dismiss and restart behavior.
- Enterprise design system and animation helper modules.
- Enhanced traveler dashboard with personalized greeting, destination, airport status, walking time, accessibility summary, AI recommendation, favorites, recents, mock weather, and mock flight-style status.
- Expanded enterprise settings for system theme, animation control, privacy mode, analytics sharing, demo reset, and data reset.
- Centralized ErrorService and upgraded recovery boundary integration.
- Loading state components and Beacon branding assets, footer, about panel, favicon, and manifest.

### Validation

- TypeScript diagnostics: zero errors via compiler API.
- ESLint: zero messages via ESLint API.
- Package-script tests/build should be run in the user PowerShell window because this Codex sandbox blocks process spawning.
