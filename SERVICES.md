# Beacon Services

## Current Services

- `analytics.ts`: local event provider and summary dashboard source for sessions, routes, airports, accessibility updates, feature usage, errors, and session duration.
- `adminConfig.ts`: airport-scoped administrative state for location status, announcements, disruptions, and dashboard summaries.
- `apiClient.ts`: resilient API request abstraction with caching and retries.
- `authSession.ts`: pilot session persistence, role labels, and local profile helpers without password storage.
- `enterpriseServices.ts`: airport alerts, conditions, flight search, and services directory access.
- `ErrorService.ts`: centralized recoverable error capture, local error log persistence, network-failure simulation, and friendly recovery-message helpers.
- `notifications.ts`: contextual smart-notification generation.
- `storage.ts`: local storage read/write wrappers.
- `voice.ts`: text-to-speech instruction queue scaffolding.
- `diagnostics.ts`: local diagnostic log abstraction.

## Service Boundaries

Services are intentionally UI-agnostic. They accept typed inputs and return typed outputs so future integrations can replace local pilot data with production providers without changing component contracts.

## Sprint 8 Service Notes

Sprint 8 keeps presentation logic modular: demo scenarios remain in `DemoMode.tsx`, design decisions live in `src/theme`, and recoverable failures flow through `ErrorService`. Keep future API, monitoring, and analytics provider integrations behind these service boundaries so the executive demo layer can remain stable while production systems are added.
