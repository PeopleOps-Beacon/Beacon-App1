# Beacon OS User Guide

## Traveler Workflow

1. Select the airport from the airport selector.
2. Choose the traveler mode that best matches the trip: Veteran PTSD, Sensory, Accessibility, Family, Business, or International.
3. Open settings to adjust accessibility needs, route preference, walking speed, language, voice guidance, high contrast, large text, reduced motion, notifications, and sensory sensitivity.
4. Search for a destination such as TSA, Gate A7, coffee, restroom, elevator, quiet room, or accessibility support.
5. Review the recommended route, route alternatives, distance, walk time, accessibility score, and condition warnings.
6. Use the map layers to locate restrooms, dining, accessibility services, transportation, security, medical, shopping, parking, charging, and pet relief.
7. Use emergency assistance if urgent support is needed.
8. Mark arrival when the route is complete.

## Account Access

Beacon supports Firebase email/password and Google sign-in when Firebase credentials are configured. In local pilot mode, Beacon creates a device-local pilot session without storing passwords.

Available account actions:

- Email login
- Google login
- Remember Me
- Password reset
- Profile edit
- Role selection
- Secure logout
- Account deletion

## Offline And Error Recovery

Beacon keeps local airport data available for pilot use. Production builds register an offline service worker for the app shell. The System Status panel shows internet, positioning, airport data, routing, and API readiness. If a screen fails to render, Beacon opens a recovery view instead of crashing.
