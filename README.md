# Beacon OS 3.0

Beacon OS 3.0 is a React/Vite prototype for Beacon, an enterprise-grade Environmental Intelligence Platform for airports. It uses the provided Beacon logo and pitch-flyer direction to create a premium first-screen experience rather than a conventional marketing page or dashboard.

## What This Includes

- Firebase-ready email/password authentication.
- Firebase-ready Google sign-in.
- Veteran-friendly access panel with large controls, clear copy, high contrast, and useful error states.
- Animated Beacon boot sequence using the provided logo.
- Airport digital-twin style experience with traveler modes for Veteran PTSD, Sensory, Accessibility, Family, and Business Traveler.
- Environmental intelligence readouts for crowding, noise, wait time, route distance, and support zones.
- Airport operations simulation panel with range controls.
- Mobile-responsive layout and reduced-motion support.
- Vitest tests for account access and traveler mode switching.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add Firebase web app values to `.env.local`.
4. Enable Email/Password and Google providers in Firebase Authentication.
5. Run `npm run dev`.

## Verification

Use these checks before deployment:

- `npm run test`
- `npm run build`
- `npm run lint`
- `npm run format`

## Architecture Notes

Authentication is isolated under `src/lib`. Product experience components live under `src/components`. The UI keeps the first viewport focused on the operational experience: logo boot, airport intelligence surface, account access, and operations simulation.

## Security Notes

Firebase credentials must stay in environment variables. Do not commit `.env.local`. Firebase Authentication should enforce authorized domains and provider restrictions before production use.

## Next Engineering Steps

- Replace the CSS map simulation with a real React Three Fiber airport digital twin.
- Add route simulation state and real airport graph data.
- Add Firestore user profiles for accessibility preferences.
- Add analytics events for mode selection and route simulation.
- Add AppDeploy build/deploy configuration once the deployment target is connected.
