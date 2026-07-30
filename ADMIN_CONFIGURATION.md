# Admin Configuration

Sprint 5 expands the administrative configuration surface from read-only counts into an airport-scoped management workspace.

## Configurable Areas

- Gates
- Restaurants
- Amenities
- Accessibility locations
- Map inventory summary
- Airport alerts
- Airport announcements
- Service disruptions
- Location operating status
- Feature flags

## Current Implementation

The admin panel uses typed airport data and local airport-scoped persistence for pilot demonstrations. It is visible only to local pilot sessions with Airport Administrator or Beacon Administrator roles. Administrators can mark managed locations open, restricted, or closed; publish announcements; log service disruptions; and resolve or reopen disruptions.

## Production Requirements

For a live pilot, connect admin actions to authenticated cloud storage or airport-approved operations APIs. Use Firebase custom claims or the selected identity provider to enforce Airport Administrator and Beacon Administrator access.
