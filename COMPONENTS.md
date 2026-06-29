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
- `NotificationCenter`: mock notification architecture for pilot alerts.
- `OfflineStatus`: local offline-readiness status.
- `RouteComparison`: compares smart route options before navigation.
- `ConditionsPanel`: shows simulated live operations conditions.
- `FlightWidget`: mock flight search and detail display.
- `EmergencyPanel`: rapid access to emergency/support destinations.
- `ServicesDirectory`: searchable airport services with navigate actions.
- `AlertsCenter`: airport alert display.
- `MapLayerToggles`: independent overlay controls.
- `VoiceGuidancePanel`: mock spoken-instruction queue.
- `AdminConfigPanel`: data-driven administrative configuration summary.
- `DiagnosticsPanel`: feature flags and local analytics visibility.

## Component Standards

- Components should accept typed props and avoid importing global state directly unless they are app-level containers.
- Keep browser persistence and analytics in services, not UI components.
- Favor accessible native controls: buttons, labels, selects, details, and landmarks.
- Add tests for business logic and user-critical workflows.
