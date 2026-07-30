import type { AnalyticsEvent, AnalyticsEventName } from "../types";

const sessionStartedAt = new Date();
const events: AnalyticsEvent[] = [
  {
    name: "session_started",
    properties: {},
    timestamp: sessionStartedAt.toISOString()
  }
];

function minutesBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

function countEvents(name: AnalyticsEventName): number {
  return events.filter((event) => event.name === name).length;
}

export const analytics = {
  track(name: AnalyticsEventName, properties: AnalyticsEvent["properties"] = {}) {
    events.push({
      name,
      properties,
      timestamp: new Date().toISOString()
    });
  },
  list() {
    return [...events];
  },
  summarize() {
    const airportsViewed = new Set(
      events
        .map((event) => event.properties.airport)
        .filter((airport): airport is string => typeof airport === "string")
    );
    const featureUsage = events.reduce<Record<string, number>>((counts, event) => {
      counts[event.name] = (counts[event.name] ?? 0) + 1;
      return counts;
    }, {});
    const activeUsers = Math.max(1, countEvents("auth_login"));

    return {
      activeUsers,
      airportsViewed: airportsViewed.size,
      routesGenerated: countEvents("navigation_started"),
      accessibilityPreferences:
        countEvents("settings_updated") +
        events.filter((event) => event.name === "traveler_mode_changed" && event.properties.mode === "accessibility").length,
      featureUsage,
      errors: countEvents("error_captured"),
      sessionDurationMinutes: minutesBetween(sessionStartedAt, new Date())
    };
  },
  clear() {
    events.length = 0;
    events.push({
      name: "session_started",
      properties: {},
      timestamp: new Date().toISOString()
    });
  }
};
