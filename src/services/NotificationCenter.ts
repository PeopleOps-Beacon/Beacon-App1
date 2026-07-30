import type { SmartNotification, SmartNotificationCategory, SmartNotificationSeverity } from "../types";

type NotificationInput = {
  id: string;
  title: string;
  body: string;
  category: SmartNotificationCategory;
  severity?: SmartNotificationSeverity;
  priority?: SmartNotification["priority"];
  tone?: SmartNotification["tone"];
  modeTarget?: SmartNotification["modeTarget"];
};

function toneForSeverity(severity: SmartNotificationSeverity): SmartNotification["tone"] {
  return severity === "high" || severity === "critical" ? "warning" : severity === "low" ? "success" : "info";
}

function priorityForSeverity(severity: SmartNotificationSeverity): SmartNotification["priority"] {
  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium") return "medium";
  return "low";
}

export const NotificationCenterService = {
  create(input: NotificationInput): SmartNotification {
    const severity = input.severity ?? "medium";

    return {
      id: input.id,
      title: input.title,
      body: input.body,
      category: input.category,
      modeTarget: input.modeTarget,
      severity,
      tone: input.tone ?? toneForSeverity(severity),
      priority: input.priority ?? priorityForSeverity(severity),
      dismissed: false,
      read: false,
      createdAt: new Date().toISOString()
    };
  },
  markRead(notification: SmartNotification): SmartNotification {
    return { ...notification, read: true, readAt: new Date().toISOString() };
  },
  unread(notifications: SmartNotification[]): SmartNotification[] {
    return notifications.filter((notification) => !notification.read && !notification.dismissed);
  },
  sort(notifications: SmartNotification[]): SmartNotification[] {
    const weights: Record<SmartNotification["priority"], number> = { critical: 4, high: 3, medium: 2, low: 1 };

    return [...notifications].sort(
      (first, second) =>
        weights[second.priority] - weights[first.priority] ||
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    );
  }
};
