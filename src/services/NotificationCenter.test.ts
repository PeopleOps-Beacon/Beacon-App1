import { describe, expect, it } from "vitest";
import { NotificationCenterService } from "./NotificationCenter";

describe("NotificationCenterService", () => {
  it("creates unread notifications with severity metadata", () => {
    const notification = NotificationCenterService.create({
      id: "security-wait",
      title: "Security wait increased",
      body: "Main checkpoint wait is now 25 minutes.",
      category: "security-wait",
      severity: "high"
    });

    expect(notification.read).toBe(false);
    expect(notification.priority).toBe("high");
    expect(notification.tone).toBe("warning");
  });

  it("sorts critical notifications before low priority updates", () => {
    const low = NotificationCenterService.create({ id: "dining", title: "Dining", body: "Coffee nearby.", category: "dining", severity: "low" });
    const critical = NotificationCenterService.create({ id: "emergency", title: "Emergency", body: "Follow staff guidance.", category: "system", severity: "critical" });

    expect(NotificationCenterService.sort([low, critical])[0].id).toBe("emergency");
  });

  it("marks notifications as read without losing metadata", () => {
    const notification = NotificationCenterService.create({ id: "route", title: "Quiet route", body: "Alternate route available.", category: "quiet-route" });
    const read = NotificationCenterService.markRead(notification);

    expect(read.read).toBe(true);
    expect(read.readAt).toBeDefined();
    expect(read.category).toBe("quiet-route");
  });
});
