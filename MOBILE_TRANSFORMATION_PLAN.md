# Beacon Mobile Transformation Plan

## Current Beacon Feature Inventory

- Passenger route planning: starting point, destination, route support, route review, and active navigation.
- Traveler profiles: Fastest Route, Mobility Support, Calm and Simple Route, and custom preferences.
- Accessibility preferences: wheelchair routing, avoid stairs, elevator-aware paths, quiet space stops, restroom stops, larger text, simplified directions, reassurance, crowd avoidance, reduced stimulation, and additional time.
- Route intelligence: route generation, estimated time and distance, route summary, focused map, full route view, step progression, route recalculation messaging, contextual alerts, and arrival confirmation.
- Assistance: airport staff, navigation help, accessibility assistance, medical emergency, security concern, and lost/separated request types with clear proof-of-concept disclaimers.
- Presentation mode: GSP executive walkthrough and other prepared demonstration journeys.
- Airport operations/admin: alert management, location management, route management, accessibility conditions, and assistance request tracking.
- Brand system: Beacon logo, Beacon name, tagline, gold accents, dark premium surfaces, cream text, line icon language, and accessibility-first personality.

## Web-Specific Patterns To Replace

- Desktop-style sticky header and admin navigation in the passenger interface.
- Multi-column location and support grids that feel like a web page compressed onto a phone.
- A four-item bottom navigation that omits Plan and Trips.
- Route planning screens that read as form pages rather than one-decision mobile screens.
- Route and assistance surfaces styled as web cards instead of native-style screens, sheets, and fixed action areas.

## Selected Migration Approach

Beacon will keep the existing Vite/React business logic and introduce a native-feeling mobile passenger layer that is ready for a Capacitor wrapper. A full Expo/React Native conversion is not practical in this task because the repository has an established React web build, no Expo workspace, and no installed native dependency set. The chosen approach preserves working route/admin logic while moving the passenger experience toward native mobile structure, safe areas, app-style tabs, fixed controls, session persistence, and haptic-ready interactions.

## Build Plan

- Keep airport staff administration as a web dashboard.
- Add a passenger-only mobile app shell with safe-area spacing and native-style top chrome.
- Replace passenger bottom navigation with Home, Plan, Journey, Trips, and Help.
- Rebuild Home as a concise mobile airport companion screen.
- Rebuild planning as one decision per screen: current location, destination, support, and route review.
- Preserve route summary, active navigation, landmark visuals, focused map, assistance, contextual alerts, guided mode, and arrival.
- Add session persistence for route planning and active journey state.
- Keep Beacon visual identity unchanged.
