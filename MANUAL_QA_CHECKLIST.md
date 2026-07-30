# Beacon OS Manual QA Checklist

Use this checklist before any airport demo or live pilot release. Accessibility issues are release blockers.

## Authentication

- Email login creates or restores a session.
- Create account starts a session and does not store a password in pilot mode.
- Remember Me persists only when selected.
- Password reset shows safe messaging in pilot mode and sends email when Firebase is configured.
- Profile edit, role change, secure logout, and account deletion complete without a crash.

## Traveler Workflow

- Airport switching updates airport name, map, locations, services, and alerts.
- Destination search finds TSA, gates, restrooms, elevators, restaurants, quiet rooms, sensory locations, and accessibility services.
- Route comparison shows fastest, accessible, quietest, family, least walking, fewest elevators, fewest stairs, and wheelchair options.
- Mark arrived completes the active navigation flow.

## Accessibility

- Keyboard users can reach every control and see focus state.
- Screen readers announce headings, forms, combobox options, buttons, alerts, and route state.
- High contrast, large text, reduced motion, and calm theme remain readable.
- Touch targets are usable on mobile viewports.
- Accessibility needs select appropriate route profiles for wheelchair, mobility, anxiety, sensory, vision, hearing, service animal, and family support needs.

## Administration

- Traveler role cannot access airport management controls.
- Airport Administrator and Beacon Administrator roles can update location status, announcements, and disruptions.
- Empty admin forms show validation feedback.
- Resolved disruptions can be reopened.

## Reliability

- Offline status is visible when the network is unavailable.
- System Status reports internet, positioning, airport data, routing, and API fallback readiness.
- Route failures, API timeouts, and render failures show recovery messaging instead of a blank app.
- Production build registers the service worker and serves the app shell after refresh.

## Performance

- Initial page load is under 3 seconds on the pilot device/network.
- Route calculation completes under 2 seconds for common destinations.
- Map interactions remain responsive on desktop and mobile.
