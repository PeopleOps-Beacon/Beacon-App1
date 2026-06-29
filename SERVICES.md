# Beacon Services

## Current Services

- `analytics.ts`: local event provider for airport, route, search, navigation, notification, and settings events.
- `apiClient.ts`: mock API request abstraction with caching and retries.
- `enterpriseServices.ts`: airport alerts, conditions, flight search, and services directory access.
- `notifications.ts`: contextual smart-notification generation.
- `storage.ts`: local storage read/write wrappers.
- `voice.ts`: text-to-speech instruction queue scaffolding.
- `diagnostics.ts`: local diagnostic log abstraction.

## Service Boundaries

Services are intentionally UI-agnostic. They accept typed inputs and return typed outputs so future integrations can replace mock data without changing component contracts.
