# Beacon OS Deployment Guide

## Required Checks

Before deploying Beacon for a pilot, run:

- pnpm run test
- pnpm run lint
- pnpm run build

Accessibility is a release blocker. Complete keyboard, screen reader, focus, color contrast, reduced motion, and touch target QA before pilot release. Run an automated accessibility suite and manual assistive-technology pass in an unrestricted environment.

## Environment Variables

Copy .env.example to .env.local for local Firebase testing. Production values should be managed in the hosting environment, not committed to the repository.

Required Firebase keys:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_APP_ID

## Production Configuration

Production builds register `/beacon-service-worker.js` for app-shell caching. Verify the service worker after each deployment and update the cache name when changing cached shell assets.


- Enforce Firebase authorized domains.
- Configure Firebase Authentication providers and password reset templates.
- Use role claims or a backend authorization layer for Airport Administrator and Beacon Administrator access.
- Connect airport data, alert, TSA wait, gate, amenity, and disruption feeds to approved APIs.
- Replace local browser admin persistence with authenticated cloud storage.
- Enable monitoring for app errors, API timeouts, route failures, service-worker failures, and authentication failures.
- Preserve backups for airport configuration and admin changes.

## Health Checks

Beacon includes visible checks for internet connectivity, device positioning support, airport data readiness, routing readiness, and API fallback state. Production monitoring should also collect server/API health outside the browser.
