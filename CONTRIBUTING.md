# Contributing

## Local Development

1. Install dependencies with `pnpm install`.
2. Run the app with `pnpm run dev`.
3. Verify changes with:
   - `pnpm run test`
   - `pnpm run lint`
   - `pnpm run build`

## Code Quality

- Use strict TypeScript and avoid `any`.
- Keep feature logic in typed utilities or services when it can be tested without rendering UI.
- Keep components focused and accessible.
- Preserve keyboard navigation, visible focus states, and screen-reader-friendly labels.
- Do not commit `.env.local`, build output, coverage, or generated TypeScript artifacts.

## Branching

Use sprint or feature branches, commit meaningful changes, and push completed work to GitHub for review.
