import type { AnalyticsEvent, AnalyticsEventName } from "../types";

const events: AnalyticsEvent[] = [];

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
  clear() {
    events.length = 0;
  }
};
