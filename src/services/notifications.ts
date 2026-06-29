import type { NotificationItem } from "../types";

export function createMockNotifications(airportCode: string): NotificationItem[] {
  return [
    {
      id: "offline-ready",
      title: "Offline maps ready",
      body: `${airportCode} terminal data is cached for local pilot use.`,
      tone: "success"
    },
    {
      id: "accessibility-alert",
      title: "Accessibility reminder",
      body: "Step-free routes are prioritized when Accessibility Mode is active.",
      tone: "info"
    },
    {
      id: "pilot-mode",
      title: "Pilot data",
      body: "Live airport APIs are not connected yet; navigation uses local graph data.",
      tone: "warning"
    }
  ];
}
