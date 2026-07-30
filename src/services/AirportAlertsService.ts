import { airportAlerts } from "../data/enterprise";
import type { AirportConfig, SmartNotificationSeverity } from "../types";
import type { LiveAirportEvent } from "./EventSimulationService";

export type EnterpriseAlertCategory =
  | "emergency"
  | "gate-announcement"
  | "weather"
  | "maintenance"
  | "transportation"
  | "parking"
  | "security"
  | "accessibility";

export type EnterpriseAirportAlert = {
  id: string;
  airportId: string;
  title: string;
  category: EnterpriseAlertCategory;
  severity: SmartNotificationSeverity;
  issuedAt: string;
  message: string;
  source: "airport" | "simulation";
};

function categoryFromEvent(event: LiveAirportEvent): EnterpriseAlertCategory {
  if (event.type === "Medical Emergency" || event.type === "Fire Alarm") return "emergency";
  if (event.type === "Gate Change" || event.type === "Flight Delay" || event.type === "Flight Cancellation") return "gate-announcement";
  if (event.type === "Weather Delay") return "weather";
  if (event.type === "Elevator Out of Service") return "accessibility";
  if (event.type === "Heavy Congestion") return "security";
  return "maintenance";
}

function normalizeStaticSeverity(severity: string): SmartNotificationSeverity {
  return severity === "critical" || severity === "high" || severity === "medium" || severity === "low" ? severity : "medium";
}

export const AirportAlertsService = {
  getAlerts(airport: AirportConfig, events: LiveAirportEvent[] = []): EnterpriseAirportAlert[] {
    const staticAlerts = airportAlerts
      .filter((alert) => alert.airportId === airport.id)
      .map((alert): EnterpriseAirportAlert => ({
        id: alert.id,
        airportId: alert.airportId,
        title: alert.title,
        category: alert.category === "transportation" ? "transportation" : alert.category === "accessibility" ? "accessibility" : alert.category === "weather" ? "weather" : "maintenance",
        severity: normalizeStaticSeverity(alert.severity),
        issuedAt: alert.issuedAt,
        message: alert.message,
        source: "airport"
      }));
    const eventAlerts = events
      .filter((event) => event.priority === "critical" || event.priority === "high")
      .map((event): EnterpriseAirportAlert => ({
        id: "alert-" + event.id,
        airportId: airport.id,
        title: event.title,
        category: categoryFromEvent(event),
        severity: event.priority,
        issuedAt: event.createdAt,
        message: event.description + " Location: " + event.locationName + ".",
        source: "simulation"
      }));

    return [...eventAlerts, ...staticAlerts].sort(
      (first, second) => new Date(second.issuedAt).getTime() - new Date(first.issuedAt).getTime()
    );
  }
};
