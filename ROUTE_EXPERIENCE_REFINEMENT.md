# Beacon Route Experience Refinement

This audit documents the route-experience changes requested before passenger-route code is edited.

## Fixed Beacon Brand Tokens

- Logo: Existing Beacon lighthouse mark and full Beacon logo from `public/brand/`.
- Name: Beacon.
- Tagline: Navigation designed around the traveler.
- Palette: Beacon black `#030405`, graphite `#111315` / `#11151c`, warm white text, Beacon gold `#f5b72f`, amber `#ffcf66` / `#ffd96d`, and deep gold `#9d6516`.
- Typography: Existing Inter/system UI stack.
- Icon style: Existing lucide line icons.
- Background treatment: Dark graphite surfaces, restrained grid texture, and subtle gold emphasis.
- Personality: Premium, trustworthy, modern, calm, accessibility-forward, and airport-appropriate.

## Current Route Screen Issues

- The route result page combines the route summary, map, route profile, full directions, contextual alerts, and actions in one view.
- The map shows every airport location and label, which competes with the selected route.
- Accessibility preferences appear as a long text list instead of a compact route profile.
- Route instructions are all visible at once before navigation begins.
- Alerts appear beside directions and map content, creating too many simultaneous priorities.
- Assistance is modal-only and does not have a focused passenger screen.

## Information To Separate

- Route Summary: start, destination, time, distance, route profile, one alert, preview map, begin action.
- Step Navigation: one instruction, distance, reassurance, progress, previous/next/map/help actions.
- Focused Map: current route, start, destination, current location, route landmarks, one condition.
- Contextual Alerts: route-relevant alert cards only.
- Assistance: large calm list items with direct request options and emergency disclaimer.

## Implementation Plan

1. Add focused route components that keep each screen small and purpose-built.
2. Extend the map component so preview and focused route views can hide non-route locations.
3. Wire the passenger screen state for route summary, navigation, map, alerts, assistance, and arrival.
4. Replace the floating help action with a four-item bottom navigation for passenger screens.
5. Add mobile-first styling that keeps the passenger experience centered on desktop.
6. Update tests around route generation, bottom navigation, assistance, and arrival.
7. Validate tests, linting, build, and local preview behavior.
