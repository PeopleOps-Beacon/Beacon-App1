import { Bell } from "lucide-react";
import type { SmartNotification } from "../types";

export function NotificationCenter({
  enabled,
  notifications,
  onDismiss
}: {
  enabled: boolean;
  notifications: SmartNotification[];
  onDismiss: (notificationId: string) => void;
}) {
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
      {enabled
        ? notifications
            .filter((notification) => !notification.dismissed)
            .map((notification) => (
            <article className={`notification ${notification.tone}`} key={notification.id}>
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
              <small>{notification.priority} priority</small>
              <button onClick={() => onDismiss(notification.id)} type="button">
                Dismiss
              </button>
            </article>
          ))
        : null}
    </section>
  );
}
