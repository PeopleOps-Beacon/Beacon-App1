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

## Sprint 3 Candidates

- Replace mock path generation with graph-based indoor routing.
- Add real accessibility-safe path constraints and live route alternatives.
- Add indoor positioning and Bluetooth beacon data hooks.
- Add notification and analytics events for destination selection, route start, and arrival.
- Connect airport API data for gates, delays, amenities, and service availability.
