# Beacon Component Guide

## Reusable UI

- `Button`: consistent command button with primary, secondary, and ghost variants.
- `Card`: section wrapper for framed content.
- `Badge`: compact status and tag display.

## Feature Components

- `AirportSelector`: switches pilot airport configuration without reload.
- `SearchBar`: searchable combobox with keyboard navigation and recent results.
- `AirportMap`: SVG map with route overlay, zoom, pan, and keyboard-selectable locations.
- `DestinationCard`: selected destination details, accessibility features, favorites, and pins.
- `NavigationPanel`: turn-by-turn route guidance and arrival state.
- `SettingsPanel`: persisted traveler profile, accessibility, display, notification, and reset controls.
- `CategoryBrowser`: browse by airport category and jump to nearby locations.
- `AirportInfoPanel`: configuration-powered airport information screens.
- `NotificationCenter`: smart notification architecture for pilot alerts, including severity, category, timestamp, unread, and clear state.
- `AIDashboardWidgets`: compact AI status panel for airport status, walking time, crowd, noise, stress, active notifications, suggested destination, and break recommendation.
- `RecommendationCards`: reusable recommendation-card list with name, distance, accessibility, walking time, description, favorite action, and destination selection.
- `DemoRoleSelector`: development role switcher for traveler and enterprise demo experiences.
- `CrowdHeatmap`: color-coded operational crowd zone display.
- `AnalyticsDashboard`: responsive mock analytics charts for enterprise review.
- `IncidentCenter`: incident list with priority, status, location, time, team, and resolution notes.
- `AccessibilityDashboard`: operational accessibility metrics for elevators, restrooms, assistance requests, routes, and closures.
- `TaskQueue`: staff task queue with priority, assignment, status, and ETA.
- `NotificationTimeline`: chronological event feed with priority, category, and date filters.
- `OperationsDashboard`: lazy-loaded enterprise page composing all Sprint 7 operational modules.
- `LandingPage`: executive SaaS-style overview for investor and airport stakeholder presentations.
- `DemoMode`: presenter-controlled scenario walkthrough for traveler and operations stories.
- `GuidedTour`: dismissible and restartable product tour.
- `ExecutiveTravelerDashboard`: polished traveler dashboard with greeting, destination, status, weather, AI, favorites, and recents.
- `LoadingStates`: skeleton, progress, map, analytics, search, and notification loaders.
- `AboutBeacon` and `BeaconFooter`: cohesive branding, version, about, and copyright surfaces.
- `OfflineStatus`: local offline-readiness status.
- `RouteComparison`: compares smart route options before navigation.
- `ConditionsPanel`: shows simulated live operations conditions.
- `FlightWidget`: flight search and detail display.
- `EmergencyPanel`: rapid access to emergency/support destinations.
- `ServicesDirectory`: searchable airport services with navigate actions.
- `AlertsCenter`: airport alert display.
- `MapLayerToggles`: independent overlay controls.
- `VoiceGuidancePanel`: spoken-instruction queue.
- `AdminConfigPanel`: data-driven administrative configuration summary.
- `DiagnosticsPanel`: feature flags and local analytics visibility.

## Component Standards

- Components should accept typed props and avoid importing global state directly unless they are app-level containers.
- Keep browser persistence and analytics in services, not UI components.
- Favor accessible native controls: buttons, labels, selects, details, and landmarks.
- Add tests for business logic and user-critical workflows.
