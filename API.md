# Beacon API Integration Layer

Sprint 4 adds a mock API layer in `src/services/apiClient.ts`.

## Capabilities

- Request abstraction through `mockApiRequest`.
- In-memory response caching.
- Retry loop for future remote calls.
- Typed `ApiResult<T>` responses.
- Centralized error handling surface.

## Future Production Shape

The mock client can be replaced with a provider that adds:

- OAuth or token authentication.
- Airport API base URLs.
- Request tracing.
- Backoff policies.
- Real cache storage.
- Network/offline fallbacks.

No UI component calls browser fetch directly; feature services sit between the app and future APIs.
