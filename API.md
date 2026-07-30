# Beacon API Integration Layer

Beacon uses service boundaries for airport, auth, admin, analytics, notification, diagnostics, and voice workflows. Sprint 5 keeps those boundaries local for pilot reliability while preparing them for production providers.

## Capabilities

- Request abstraction through `resilientApiRequest`.
- In-memory response caching.
- Retry loop for future remote calls.
- Typed `ApiResult<T>` responses.
- Centralized error handling surface.
- System status checks for offline/API fallback readiness.

## Future Production Shape

The local pilot client can be replaced with a provider that adds:

- OAuth or token authentication.
- Airport API base URLs.
- Request tracing.
- Backoff policies.
- Durable cache storage.
- Network/offline fallbacks.
- Live feeds for gate changes, TSA waits, delays, alerts, emergency notifications, and accessibility service interruptions.

No UI component calls browser fetch directly; feature services sit between the app and future APIs.
