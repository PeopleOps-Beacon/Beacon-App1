import { memo } from "react";
import { Siren } from "lucide-react";
import type { OperationsIncident } from "../services/DemoDataGenerator";
import type { LiveAirportEvent } from "../services/EventSimulationService";

function formatTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function IncidentCenterComponent({ incidents, liveEvents = [] }: { incidents: OperationsIncident[]; liveEvents?: LiveAirportEvent[] }) {
  const liveIncidents = liveEvents
    .filter((event) => event.category === "incident" || event.priority === "critical")
    .map((event): OperationsIncident => ({
      id: event.id,
      type: event.type === "Medical Emergency" ? "Medical" : event.type === "Fire Alarm" ? "Security" : "Maintenance",
      priority: event.priority,
      status: "open",
      location: event.locationName,
      time: event.createdAt,
      assignedTeam: event.priority === "critical" ? "Emergency Response" : "Operations",
      resolutionNotes: event.description
    }));
  const visibleIncidents = [...liveIncidents, ...incidents].slice(0, 8);

  return (
    <section className="operations-card incident-center" aria-labelledby="incident-center-title">
      <div className="panel-heading compact">
        <Siren aria-hidden="true" />
        <div>
          <p className="eyebrow">Incidents</p>
          <h3 id="incident-center-title">Incident center</h3>
        </div>
      </div>
      <div className="operations-list">
        {visibleIncidents.map((incident) => (
          <article className={"incident-row " + incident.priority} key={incident.id}>
            <div>
              <strong>{incident.type}</strong>
              <p>{incident.location}</p>
            </div>
            <dl>
              <div><dt>Priority</dt><dd>{incident.priority}</dd></div>
              <div><dt>Status</dt><dd>{incident.status}</dd></div>
              <div><dt>Time</dt><dd>{formatTime(incident.time)}</dd></div>
              <div><dt>Team</dt><dd>{incident.assignedTeam}</dd></div>
            </dl>
            <small>{incident.resolutionNotes}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export const IncidentCenter = memo(IncidentCenterComponent);
