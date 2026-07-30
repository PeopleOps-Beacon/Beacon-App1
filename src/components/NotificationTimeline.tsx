import { memo, useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import type { SmartNotificationSeverity } from "../types";
import type { TimelineCategory, TimelineEvent } from "../services/DemoDataGenerator";

const priorities: Array<"all" | SmartNotificationSeverity> = ["all", "critical", "high", "medium", "low"];
const categories: Array<"all" | TimelineCategory> = ["all", "alert", "recommendation", "gate-change", "crowd", "system", "incident"];
const dates = ["all", "hour", "today"] as const;

function formatTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function isInDateFilter(value: string, dateFilter: typeof dates[number]): boolean {
  if (dateFilter === "all") return true;

  const timestamp = new Date(value).getTime();
  const now = Date.now();
  if (dateFilter === "hour") return now - timestamp <= 60 * 60000;

  return new Date(value).toDateString() === new Date().toDateString();
}

function NotificationTimelineComponent({ events }: { events: TimelineEvent[] }) {
  const [priority, setPriority] = useState<"all" | SmartNotificationSeverity>("all");
  const [category, setCategory] = useState<"all" | TimelineCategory>("all");
  const [dateFilter, setDateFilter] = useState<typeof dates[number]>("all");
  const filteredEvents = useMemo(
    () =>
      events
        .filter((event) => priority === "all" || event.priority === priority)
        .filter((event) => category === "all" || event.category === category)
        .filter((event) => isInDateFilter(event.timestamp, dateFilter))
        .sort((first, second) => new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime())
        .slice(0, 12),
    [category, dateFilter, events, priority]
  );

  return (
    <section className="operations-card notification-timeline" aria-labelledby="notification-timeline-title">
      <div className="panel-heading compact">
        <ListFilter aria-hidden="true" />
        <div>
          <p className="eyebrow">Timeline</p>
          <h3 id="notification-timeline-title">Notification timeline</h3>
        </div>
      </div>
      <div className="timeline-filters">
        <label>
          Priority
          <select onChange={(event) => setPriority(event.target.value as "all" | SmartNotificationSeverity)} value={priority}>
            {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Category
          <select onChange={(event) => setCategory(event.target.value as "all" | TimelineCategory)} value={category}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Date
          <select onChange={(event) => setDateFilter(event.target.value as typeof dates[number])} value={dateFilter}>
            {dates.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="timeline-list">
        {filteredEvents.map((event) => (
          <article className={"timeline-event " + event.priority} key={event.id}>
            <span>{formatTime(event.timestamp)}</span>
            <strong>{event.title}</strong>
            <p>{event.body}</p>
            <small>{event.category} - {event.priority}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export const NotificationTimeline = memo(NotificationTimelineComponent);
