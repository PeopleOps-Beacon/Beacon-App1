import type { AirportConfig, SmartNotificationSeverity } from "../types";
import type { TimelineCategory, TimelineEvent } from "./DemoDataGenerator";

export type LiveEventType =
  | "Gate Change"
  | "Medical Emergency"
  | "Fire Alarm"
  | "Construction"
  | "Closed Restroom"
  | "Elevator Out of Service"
  | "Heavy Congestion"
  | "Weather Delay"
  | "Flight Delay"
  | "Flight Cancellation";

export type LiveAirportEvent = {
  id: string;
  type: LiveEventType;
  title: string;
  description: string;
  category: TimelineCategory;
  priority: SmartNotificationSeverity;
  locationName: string;
  createdAt: string;
};

const templates: Array<Omit<LiveAirportEvent, "id" | "locationName" | "createdAt">> = [
  { type: "Gate Change", title: "Gate change posted", description: "A departing flight has moved gates.", category: "gate-change", priority: "medium" },
  { type: "Medical Emergency", title: "Medical response requested", description: "Medical team has been dispatched.", category: "incident", priority: "critical" },
  { type: "Fire Alarm", title: "Fire alarm investigation", description: "Emergency response is verifying an alarm panel.", category: "alert", priority: "critical" },
  { type: "Construction", title: "Construction zone active", description: "Temporary barriers are affecting corridor flow.", category: "alert", priority: "medium" },
  { type: "Closed Restroom", title: "Restroom closed", description: "Cleaning team has closed a restroom temporarily.", category: "alert", priority: "medium" },
  { type: "Elevator Out of Service", title: "Elevator outage", description: "Accessible routes should use the alternate elevator bank.", category: "alert", priority: "high" },
  { type: "Heavy Congestion", title: "Crowd density rising", description: "Crowding is above the demo threshold in this zone.", category: "crowd", priority: "high" },
  { type: "Weather Delay", title: "Weather delay", description: "Inbound aircraft may be delayed by local weather.", category: "alert", priority: "medium" },
  { type: "Flight Delay", title: "Flight delay posted", description: "One flight has a new departure time.", category: "gate-change", priority: "medium" },
  { type: "Flight Cancellation", title: "Flight cancellation", description: "Customer support should prepare rebooking assistance.", category: "alert", priority: "high" }
];

function pickLocation(airport: AirportConfig, index: number): string {
  return airport.locations[index % airport.locations.length]?.name ?? airport.name;
}

export const EventSimulationService = {
  createEvent(airport: AirportConfig, index = 0): LiveAirportEvent {
    const template = templates[index % templates.length];
    return {
      ...template,
      id: "live-event-" + Date.now() + "-" + index,
      locationName: pickLocation(airport, index),
      createdAt: new Date().toISOString()
    };
  },
  createInitialEvents(airport: AirportConfig, count = 4): LiveAirportEvent[] {
    return Array.from({ length: count }, (_, index) => ({
      ...this.createEvent(airport, index),
      id: "initial-event-" + airport.id + "-" + index,
      createdAt: new Date(Date.now() - index * 90000).toISOString()
    }));
  },
  advanceEvents(airport: AirportConfig, currentEvents: LiveAirportEvent[], tick: number, maxEvents = 12): LiveAirportEvent[] {
    return [this.createEvent(airport, tick), ...currentEvents].slice(0, maxEvents);
  },
  toTimelineEvent(event: LiveAirportEvent): TimelineEvent {
    return {
      id: event.id,
      title: event.title,
      body: event.description + " Location: " + event.locationName + ".",
      category: event.category,
      priority: event.priority,
      timestamp: event.createdAt
    };
  },
  summarize(events: LiveAirportEvent[]) {
    return {
      critical: events.filter((event) => event.priority === "critical").length,
      high: events.filter((event) => event.priority === "high").length,
      incidents: events.filter((event) => event.category === "incident").length,
      crowd: events.filter((event) => event.category === "crowd").length
    };
  }
};
