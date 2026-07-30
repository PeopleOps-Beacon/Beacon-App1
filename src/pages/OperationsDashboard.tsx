import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, Bell, Clock, Construction, DoorClosed, Siren, Users, UserRoundCheck, Waypoints } from "lucide-react";
import { AccessibilityDashboard } from "../components/AccessibilityDashboard";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { CrowdHeatmap } from "../components/CrowdHeatmap";
import { IncidentCenter } from "../components/IncidentCenter";
import { NotificationTimeline } from "../components/NotificationTimeline";
import { TaskQueue } from "../components/TaskQueue";
import { useUserRole } from "../hooks/useUserRole";
import { AirportAlertsService } from "../services/AirportAlertsService";
import { DemoDataGenerator } from "../services/DemoDataGenerator";
import { EventSimulationService, type LiveAirportEvent } from "../services/EventSimulationService";
import type { AirportConfig } from "../types";

type Widget = {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "low" | "medium" | "high" | "critical";
};

function widgetTone(value: number): Widget["tone"] {
  if (value >= 80) return "critical";
  if (value >= 65) return "high";
  if (value >= 35) return "medium";
  return "low";
}

export function OperationsDashboard({ airport }: { airport: AirportConfig }) {
  const { isDemoMode, roleDescription, roleLabel } = useUserRole();
  const demoData = useMemo(() => DemoDataGenerator.generate(airport), [airport]);
  const [liveEvents, setLiveEvents] = useState<LiveAirportEvent[]>(() => EventSimulationService.createInitialEvents(airport));

  useEffect(() => {
    setLiveEvents(EventSimulationService.createInitialEvents(airport));
  }, [airport]);

  useEffect(() => {
    if (!isDemoMode) {
      return undefined;
    }

    let tick = 0;
    const intervalId = window.setInterval(() => {
      tick += 1;
      setLiveEvents((events) => EventSimulationService.advanceEvents(airport, events, tick));
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [airport, isDemoMode]);

  const liveTimelineEvents = useMemo(
    () => liveEvents.map((event) => EventSimulationService.toTimelineEvent(event)),
    [liveEvents]
  );
  const eventSummary = useMemo(() => EventSimulationService.summarize(liveEvents), [liveEvents]);
  const alerts = useMemo(() => AirportAlertsService.getAlerts(airport, liveEvents), [airport, liveEvents]);
  const metrics = {
    ...demoData.metrics,
    notifications: demoData.metrics.notifications + liveEvents.length + alerts.length,
    incidents: demoData.metrics.incidents + eventSummary.incidents,
    staffAlerts: demoData.metrics.staffAlerts + eventSummary.critical + eventSummary.high
  };
  const widgets: Widget[] = [
    { label: "Current Travelers", value: metrics.currentTravelers, icon: <Users aria-hidden="true" />, tone: widgetTone(metrics.currentTravelers / 5) },
    { label: "Average Wait Time", value: metrics.averageWaitTime + " min", icon: <Clock aria-hidden="true" />, tone: widgetTone(metrics.averageWaitTime * 3) },
    { label: "Crowd Density", value: metrics.crowdDensity + "%", icon: <Activity aria-hidden="true" />, tone: widgetTone(metrics.crowdDensity) },
    { label: "Accessibility Requests", value: metrics.accessibilityRequests, icon: <UserRoundCheck aria-hidden="true" />, tone: "medium" },
    { label: "Notifications", value: metrics.notifications, icon: <Bell aria-hidden="true" />, tone: "medium" },
    { label: "Incidents", value: metrics.incidents, icon: <Siren aria-hidden="true" />, tone: eventSummary.critical > 0 ? "critical" : "high" },
    { label: "Construction Zones", value: metrics.constructionZones, icon: <Construction aria-hidden="true" />, tone: "medium" },
    { label: "Closed Areas", value: metrics.closedAreas, icon: <DoorClosed aria-hidden="true" />, tone: metrics.closedAreas > 2 ? "high" : "medium" },
    { label: "Staff Alerts", value: metrics.staffAlerts, icon: <Waypoints aria-hidden="true" />, tone: metrics.staffAlerts > 8 ? "high" : "medium" }
  ];
  const timelineEvents = [...liveTimelineEvents, ...demoData.notifications].slice(0, 40);

  return (
    <section className="operations-dashboard" aria-labelledby="operations-dashboard-title">
      <div className="operations-hero">
        <div>
          <p className="eyebrow">Enterprise Operations</p>
          <h2 id="operations-dashboard-title">Operations dashboard</h2>
          <p>{roleLabel}: {roleDescription}</p>
        </div>
        <span className={isDemoMode ? "demo-status active" : "demo-status"}>
          {isDemoMode ? "Live demo simulation on" : "Live demo simulation paused"}
        </span>
      </div>

      <div className="operations-widget-grid">
        {widgets.map((widget) => (
          <article className={"operations-widget " + (widget.tone ?? "low")} key={widget.label}>
            {widget.icon}
            <span>{widget.label}</span>
            <strong>{widget.value}</strong>
          </article>
        ))}
      </div>

      <div className="operations-alert-strip" aria-label="Airport alert summary">
        {alerts.slice(0, 4).map((alert) => (
          <article className={"alert " + alert.severity} key={alert.id}>
            <strong>{alert.title}</strong>
            <p>{alert.message}</p>
            <small>{alert.category} - {alert.source}</small>
          </article>
        ))}
      </div>

      <div className="operations-grid two-column">
        <CrowdHeatmap zones={demoData.crowdZones} />
        <AccessibilityDashboard metrics={demoData.accessibility} />
      </div>
      <div className="operations-grid two-column">
        <IncidentCenter incidents={demoData.incidents} liveEvents={liveEvents} />
        <TaskQueue tasks={demoData.tasks} />
      </div>
      <AnalyticsDashboard analytics={demoData.analytics} />
      <NotificationTimeline events={timelineEvents} />
    </section>
  );
}
