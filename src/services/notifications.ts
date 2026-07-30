import type {
  AirportCondition,
  AirportConfig,
  RouteOption,
  SmartNotification,
  SmartNotificationCategory,
  TravelerModeId
} from "../types";
import { NotificationCenterService } from "./NotificationCenter";

function categoryForCondition(condition: AirportCondition): SmartNotificationCategory {
  if (condition.category === "crowd") return "heavy-crowd";
  if (condition.category === "construction" || condition.category === "closure") return "construction";
  if (condition.category === "security") return "security-wait";
  if (condition.category === "restroom") return "accessible-restroom";
  if (condition.category === "noise") return "quiet-route";
  return "system";
}

export function createSmartNotifications(
  airport: AirportConfig,
  conditions: AirportCondition[],
  routeOptions: RouteOption[],
  travelerMode: TravelerModeId
): SmartNotification[] {
  const conditionNotifications = conditions.map((condition) =>
    NotificationCenterService.create({
      id: "condition-" + condition.id,
      title: condition.title,
      body:
        condition.waitMinutes && condition.category === "security"
          ? "Security wait time has increased to " + condition.waitMinutes + " minutes."
          : condition.description,
      category: categoryForCondition(condition),
      severity: condition.severity
    })
  );

  const routeNotification: SmartNotification[] =
    routeOptions[0]?.conditionWarnings.length > 0
      ? [
          NotificationCenterService.create({
            id: "route-condition-warning",
            title: "Route adjusted",
            body: routeOptions[0].label + " is accounting for " + routeOptions[0].conditionWarnings[0] + ".",
            category: "route",
            severity: "high"
          })
        ]
      : [];

  const modeNotification =
    travelerMode === "sensory" || travelerMode === "veteran"
      ? NotificationCenterService.create({
          id: "quiet-room-nearby",
          title: "Quiet support nearby",
          body: "Quiet room located along supported terminal routes.",
          category: "quiet-route",
          severity: "medium",
          modeTarget: travelerMode
        })
      : NotificationCenterService.create({
          id: "accessible-restroom-nearby",
          title: "Accessible restroom nearby",
          body: airport.iata + " has accessible restroom locations available in search and map layers.",
          category: "accessible-restroom",
          severity: "low",
          modeTarget: travelerMode
        });

  return NotificationCenterService.sort([
    NotificationCenterService.create({
      id: "offline-ready",
      title: "Offline maps ready",
      body: airport.iata + " terminal data is prepared for local pilot use.",
      category: "system",
      severity: "low"
    }),
    NotificationCenterService.create({
      id: "time-to-depart",
      title: "Time to depart check",
      body: "Beacon will keep route and airport status visible while you prepare to move.",
      category: "time-to-depart",
      severity: "medium"
    }),
    ...conditionNotifications,
    ...routeNotification,
    modeNotification
  ]);
}
