import type {
  AirportCondition,
  AirportConfig,
  RouteOption,
  SmartNotification,
  TravelerModeId
} from "../types";

export function createSmartNotifications(
  airport: AirportConfig,
  conditions: AirportCondition[],
  routeOptions: RouteOption[],
  travelerMode: TravelerModeId
): SmartNotification[] {
  const now = new Date().toISOString();
  const conditionNotifications = conditions.map((condition) => ({
    id: `condition-${condition.id}`,
    title: condition.title,
    body:
      condition.waitMinutes && condition.category === "security"
        ? `Security wait time has increased to ${condition.waitMinutes} minutes.`
        : condition.description,
    tone: condition.severity === "high" ? "warning" : "info",
    priority: condition.severity === "high" ? "high" : "medium",
    dismissed: false,
    createdAt: now
  }) satisfies SmartNotification);

  const routeNotification: SmartNotification[] =
    routeOptions[0]?.conditionWarnings.length > 0
      ? [
          {
            id: "route-condition-warning",
            title: "Route adjusted",
            body: `${routeOptions[0].label} is accounting for ${routeOptions[0].conditionWarnings[0]}.`,
            tone: "warning",
            priority: "high",
            dismissed: false,
            createdAt: now
          }
        ]
      : [];

  const modeNotification: SmartNotification =
    travelerMode === "sensory" || travelerMode === "veteran"
      ? {
          id: "quiet-room-nearby",
          title: "Quiet support nearby",
          body: "Quiet room located along supported terminal routes.",
          tone: "info",
          priority: "medium",
          modeTarget: travelerMode,
          dismissed: false,
          createdAt: now
        }
      : {
          id: "accessible-restroom-nearby",
          title: "Accessible restroom nearby",
          body: `${airport.iata} has accessible restroom locations available in search and map layers.`,
          tone: "success",
          priority: "low",
          modeTarget: travelerMode,
          dismissed: false,
          createdAt: now
        };

  return [
    {
      id: "offline-ready",
      title: "Offline maps ready",
      body: `${airport.iata} terminal data is prepared for local pilot use.`,
      tone: "success",
      priority: "low",
      dismissed: false,
      createdAt: now
    },
    ...conditionNotifications,
    ...routeNotification,
    modeNotification
  ];
}
