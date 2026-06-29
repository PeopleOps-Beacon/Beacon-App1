import { Bell } from "lucide-react";
import type { NotificationItem } from "../types";

export function NotificationCenter({
  enabled,
  notifications
}: {
  enabled: boolean;
  notifications: NotificationItem[];
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
        ? notifications.map((notification) => (
            <article className={`notification ${notification.tone}`} key={notification.id}>
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
            </article>
          ))
        : null}
    </section>
  );
}
