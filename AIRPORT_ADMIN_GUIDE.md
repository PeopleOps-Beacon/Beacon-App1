# Beacon OS Airport Administrator Guide

## Roles

Beacon supports three pilot roles:

- Traveler
- Airport Administrator
- Beacon Administrator

Role selection is available in the account panel. Production role enforcement should use Firebase custom claims or an approved identity provider.

## Airport Dashboard

The airport dashboard allows administrators to manage pilot operations data for the selected airport:

- Gates
- Restaurants
- Amenities
- Accessibility locations
- Map inventory summary
- Airport alerts
- Airport announcements
- Service disruptions

## Location Operations

Use Location operations to mark gates, restaurants, restrooms, support points, care rooms, and transportation locations as open, restricted, or closed. Changes are saved locally per airport for pilot demonstration.

## Announcements

Use Airport announcements for traveler-facing notices. Announcements include a title, message, and severity.

## Service Disruptions

Use Service disruptions for elevator outages, TSA changes, gate issues, amenity interruptions, or accessibility service interruptions. Active disruptions appear in the admin dashboard count and can be resolved or reopened.

## Production Notes

For a live airport pilot, connect this interface to approved airport operations APIs or an authenticated administrative backend. Do not rely on local browser storage for authoritative production operations data.
