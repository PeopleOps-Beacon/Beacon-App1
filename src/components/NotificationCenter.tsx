import { Bell, CheckCircle2 } from "lucide-react";
import { NotificationCenterService } from "../services/NotificationCenter";
import type { SmartNotification } from "../types";

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function NotificationCenter({
  enabled,
  notifications,
  onDismiss
}: {
  enabled: boolean;
  notifications: SmartNotification[];
  onDismiss: (notificationId: string) => void;
}) {
  const visibleNotifications = NotificationCenterService.sort(
    notifications.filter((notification) => !notification.dismissed)
  );
  const unreadCount = NotificationCenterService.unread(notifications).length;

  return (
    <section className="notification-center" aria-labelledby="notification-title">
      <div className="panel-heading">
        <Bell aria-hidden="true" />
        <div>
          <p className="eyebrow">Notifications</p>
          <h2 id="notification-title">Pilot alerts</h2>
        </div>
      </div>
      {!enabled ? <p>Notifications are off in traveler settings.</p> : null}
      {enabled ? <p className="notification-summary">{unreadCount} unread updates</p> : null}
      {enabled && visibleNotifications.length === 0 ? <p>No active airport alerts.</p> : null}
      {enabled
        ? visibleNotifications.map((notification) => (
            <article className={
              "notification " + notification.tone + " severity-" + notification.severity + (notification.read ? " read" : " unread")
            } key={notification.id}>
              <div className="notification-meta-row">
                <span>{notification.category.replace(/-/g, " ")}</span>
                <span>{notification.severity}</span>
                <time dateTime={notification.createdAt}>{formatTimestamp(notification.createdAt)}</time>
              </div>
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
              <small>{notification.priority} priority</small>
              <button onClick={() => onDismiss(notification.id)} type="button">
                <CheckCircle2 aria-hidden="true" /> Clear
              </button>
            </article>
          ))
        : null}
    </section>
  );
}
