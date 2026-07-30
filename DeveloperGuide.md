# Beacon Developer Guide

## Local Development

Use the bundled Codex runtime path when pnpm is not available globally:

```powershell
$env:Path = "C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;$env:Path"
cd "C:\Users\Owner\OneDrive\Documents\Beacon-OS"
pnpm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

## Validation

Run before handoff:

```powershell
pnpm.cmd run test
pnpm.cmd run build
```

## Architecture Notes

- Keep UI components modular and typed.
- Keep browser persistence and simulated external data in services.
- Use `src/theme/designSystem.ts` as the Design System source for shared visual decisions.
- Use `ErrorService` for recoverable error capture.
- Keep executive demo data clearly mocked until real integrations are approved.

## Performance Notes

- Enterprise operations dashboard is lazy-loaded.
- Presentation pages are modular and rendered only when selected.
- Dashboard and operations widgets use memoization where data generation is expensive.
- Reduced motion is respected for animation-heavy surfaces.

## Accessibility Notes

- Prefer native buttons, labels, selects, landmarks, and headings.
- Preserve visible focus states and large touch targets.
- Keep reduced-motion behavior intact.
- Add browser-based accessibility automation before live pilot release.

## Sprint 8 Demo Operations

- Launch the executive landing page from the pilot console's Executive overview action.
- Launch presenter-controlled scenarios from Launch demo mode, then apply a scenario to update the traveler mode and destination.
- Restart the guided tour from the traveler profile column after it has been dismissed.
- Use `src/theme/designSystem.ts` as the Design System source for shared typography, spacing, color, radius, elevation, component, alert, and status decisions.
- Use `src/theme/animations.ts` and the motion utility classes for subtle page, card, notification, modal, search, loading, and route transitions.
- Use `src/components/LoadingStates.tsx` when adding new async surfaces so dashboards, maps, analytics, notifications, and search do not shift abruptly.
- Use `src/services/ErrorService.ts` for recoverable exception, storage, missing-data, route, timeout, and network simulation capture before adding new error UI.
