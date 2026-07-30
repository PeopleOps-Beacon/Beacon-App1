# Beacon Sprint 7 - Operations Intelligence and Enterprise Dashboard

## Summary

Sprint 7 turns Beacon into a dual-purpose demo platform for travelers and airport enterprise stakeholders. It adds role-based experiences, live operational simulation, airport management dashboards, analytics, incident visibility, accessibility monitoring, staff task queues, and notification timelines while preserving the Sprint 1-6 traveler workflow.

## User Roles

Supported demo roles:

- Traveler
- Airport Operations
- Airport Guest Services
- Airport Accessibility Coordinator
- Airport Administrator
- Emergency Response
- Demo Mode

Role state lives in `src/context/UserRoleContext.tsx` with the hook in `src/hooks/useUserRole.ts`. The visible development switcher is `src/components/DemoRoleSelector.tsx`.

## Dashboard Architecture

The enterprise workspace is lazy-loaded from `src/pages/OperationsDashboard.tsx` and composed from reusable panels:

- `CrowdHeatmap.tsx`
- `AnalyticsDashboard.tsx`
- `IncidentCenter.tsx`
- `AccessibilityDashboard.tsx`
- `TaskQueue.tsx`
- `NotificationTimeline.tsx`

## Event Simulation

`src/services/EventSimulationService.ts` generates live demo events every few seconds when Demo Mode is active, including gate changes, emergencies, closures, elevator outages, congestion, weather delays, flight delays, and cancellations.

## Operations Services

- `DemoDataGenerator.ts`: creates enterprise-scale demo travelers, staff, notifications, incidents, destinations, crowd levels, heatmaps, analytics, accessibility metrics, and task queues.
- `AirportAlertsService.ts`: merges configured airport alerts with high-priority simulated alerts.
- `EventSimulationService.ts`: creates, advances, summarizes, and maps live events into timeline entries.

## Demo Mode

Demo Mode is the default local role so the enterprise dashboard is immediately visible during stakeholder reviews. Switching to Traveler returns the app to the traveler-first experience while preserving all navigation, AI, accessibility, authentication, and admin features from earlier sprints.

## Validation Notes

Sprint 7 includes tests for role switching, operations dashboard rendering, event simulation, alerts, incident center, analytics dashboard, accessibility dashboard, task queue, and crowd heatmap.
