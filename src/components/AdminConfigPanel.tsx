import { FormEvent, useEffect, useMemo, useState } from "react";
import { LockKeyhole, Megaphone, SlidersHorizontal, TriangleAlert } from "lucide-react";
import type { AirportAlert, AirportConfig, UserRole } from "../types";
import {
  addAirportAnnouncement,
  addServiceDisruption,
  readAdminState,
  setManagedLocationStatus,
  summarizeAdminState,
  toggleServiceDisruption,
  type AirportAdminState
} from "../services/adminConfig";
import { analytics } from "../services/analytics";
import { authSessionChangedEvent, readPilotSession, userRoleLabels } from "../services/authSession";

const adminRoles: UserRole[] = ["airport-admin", "beacon-admin"];

function readActiveRole(): UserRole | null {
  return readPilotSession()?.profile.role ?? null;
}

export function AdminConfigPanel({ airport }: { airport: AirportConfig }) {
  const [adminState, setAdminState] = useState<AirportAdminState>(() => readAdminState(airport));
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => readActiveRole());
  const [adminMessage, setAdminMessage] = useState<{ tone: "ready" | "error"; text: string } | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementSeverity, setAnnouncementSeverity] = useState<AirportAlert["severity"]>("low");
  const [disruptionTitle, setDisruptionTitle] = useState("");
  const [disruptionImpact, setDisruptionImpact] = useState("");
  const [disruptionLocation, setDisruptionLocation] = useState(airport.locations[0]?.name ?? "Terminal");

  useEffect(() => {
    setAdminState(readAdminState(airport));
    setDisruptionLocation(airport.locations[0]?.name ?? "Terminal");
  }, [airport]);

  useEffect(() => {
    const syncRole = () => setActiveRole(readActiveRole());

    window.addEventListener(authSessionChangedEvent, syncRole);
    window.addEventListener("storage", syncRole);

    return () => {
      window.removeEventListener(authSessionChangedEvent, syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  const summary = useMemo(() => summarizeAdminState(adminState), [adminState]);
  const operationalLocations = adminState.managedLocations.filter((location) =>
    ["gate", "dining", "restroom", "care", "support", "transportation"].includes(location.category)
  );
  const canManageAirport = activeRole ? adminRoles.includes(activeRole) : false;
  const activeAdminRole = activeRole ?? "airport-admin";

  if (!canManageAirport) {
    return (
      <section className="enterprise-panel admin-console" aria-labelledby="admin-title">
        <div className="panel-heading">
          <LockKeyhole aria-hidden="true" />
          <div>
            <p className="eyebrow">Admin</p>
            <h2 id="admin-title">Airport dashboard</h2>
          </div>
        </div>
        <p>
          Sign in as an Airport Administrator or Beacon Administrator to manage gates, amenities,
          announcements, and service disruptions.
        </p>
        {activeRole ? <p className="settings-note">Current role: {userRoleLabels[activeRole]}</p> : null}
      </section>
    );
  }

  const handleLocationStatus = (locationId: string, status: "open" | "restricted" | "closed") => {
    const nextState = setManagedLocationStatus(adminState, locationId, status);
    setAdminState(nextState);
    setAdminMessage({ tone: "ready", text: "Location status saved." });
    analytics.track("admin_config_viewed", { action: "location_status", airport: airport.iata });
  };

  const handleAnnouncement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      setAdminMessage({ tone: "error", text: "Add an announcement title and message before publishing." });
      return;
    }

    const nextState = addAirportAnnouncement(adminState, {
      title: announcementTitle,
      message: announcementMessage,
      severity: announcementSeverity
    });
    setAdminState(nextState);
    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setAnnouncementSeverity("low");
    setAdminMessage({ tone: "ready", text: "Announcement published." });
    analytics.track("admin_config_viewed", { action: "announcement", airport: airport.iata });
  };

  const handleDisruption = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!disruptionTitle.trim() || !disruptionImpact.trim()) {
      setAdminMessage({ tone: "error", text: "Add a disruption title and traveler impact before logging." });
      return;
    }

    const nextState = addServiceDisruption(adminState, {
      title: disruptionTitle,
      locationName: disruptionLocation,
      impact: disruptionImpact,
      severity: "high"
    });
    setAdminState(nextState);
    setDisruptionTitle("");
    setDisruptionImpact("");
    setAdminMessage({ tone: "ready", text: "Service disruption logged." });
    analytics.track("admin_config_viewed", { action: "service_disruption", airport: airport.iata });
  };

  return (
    <section className="enterprise-panel admin-console" aria-labelledby="admin-title">
      <div className="panel-heading">
        <SlidersHorizontal aria-hidden="true" />
        <div>
          <p className="eyebrow">Admin</p>
          <h2 id="admin-title">Airport dashboard</h2>
        </div>
      </div>
      <p className="settings-note">Signed in as {userRoleLabels[activeAdminRole]}.</p>
      {adminMessage ? (
        <p className={"access-message " + adminMessage.tone} role="status">
          {adminMessage.text}
        </p>
      ) : null}
      <dl className="admin-grid">
        <div><dt>Gates</dt><dd>{summary.gates}</dd></div>
        <div><dt>Restaurants</dt><dd>{summary.restaurants}</dd></div>
        <div><dt>Amenities</dt><dd>{summary.amenities}</dd></div>
        <div><dt>Accessibility</dt><dd>{summary.accessibilityLocations}</dd></div>
        <div><dt>Alerts</dt><dd>{summary.activeAlerts}</dd></div>
        <div><dt>Disruptions</dt><dd>{summary.activeDisruptions}</dd></div>
      </dl>

      <div className="admin-section">
        <h3>Location operations</h3>
        <div className="admin-location-list">
          {operationalLocations.slice(0, 8).map((location) => (
            <label key={location.id}>
              <span><strong>{location.name}</strong><small>{location.category}</small></span>
              <select
                aria-label={location.name + " status"}
                onChange={(event) =>
                  handleLocationStatus(location.id, event.target.value as "open" | "restricted" | "closed")
                }
                value={location.status}
              >
                <option value="open">Open</option>
                <option value="restricted">Restricted</option>
                <option value="closed">Closed</option>
              </select>
            </label>
          ))}
        </div>
      </div>

      <form className="admin-section admin-form" onSubmit={handleAnnouncement}>
        <h3><Megaphone aria-hidden="true" /> Airport announcements</h3>
        <input
          aria-label="Announcement title"
          aria-invalid={adminMessage?.tone === "error" && !announcementTitle.trim()}
          onChange={(event) => setAnnouncementTitle(event.target.value)}
          placeholder="Announcement title"
          value={announcementTitle}
        />
        <textarea
          aria-label="Announcement message"
          aria-invalid={adminMessage?.tone === "error" && !announcementMessage.trim()}
          onChange={(event) => setAnnouncementMessage(event.target.value)}
          placeholder="What should travelers know?"
          value={announcementMessage}
        />
        <select
          aria-label="Announcement severity"
          onChange={(event) => setAnnouncementSeverity(event.target.value as AirportAlert["severity"])}
          value={announcementSeverity}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button type="submit">Publish announcement</button>
        <div className="admin-feed">
          {adminState.announcements.slice(0, 3).map((announcement) => (
            <article key={announcement.id}>
              <strong>{announcement.title}</strong>
              <p>{announcement.message}</p>
              <small>{announcement.severity} priority</small>
            </article>
          ))}
        </div>
      </form>

      <form className="admin-section admin-form" onSubmit={handleDisruption}>
        <h3><TriangleAlert aria-hidden="true" /> Service disruptions</h3>
        <input
          aria-label="Disruption title"
          aria-invalid={adminMessage?.tone === "error" && !disruptionTitle.trim()}
          onChange={(event) => setDisruptionTitle(event.target.value)}
          placeholder="Elevator, TSA, gate, or amenity issue"
          value={disruptionTitle}
        />
        <select
          aria-label="Disruption location"
          onChange={(event) => setDisruptionLocation(event.target.value)}
          value={disruptionLocation}
        >
          {airport.locations.map((location) => (
            <option key={location.id} value={location.name}>{location.name}</option>
          ))}
        </select>
        <textarea
          aria-label="Disruption impact"
          aria-invalid={adminMessage?.tone === "error" && !disruptionImpact.trim()}
          onChange={(event) => setDisruptionImpact(event.target.value)}
          placeholder="Describe the traveler impact and support path."
          value={disruptionImpact}
        />
        <button type="submit">Log disruption</button>
        <div className="admin-feed">
          {adminState.disruptions.map((disruption) => (
            <article key={disruption.id}>
              <strong>{disruption.title}</strong>
              <p>{disruption.locationName}: {disruption.impact}</p>
              <button onClick={() => setAdminState(toggleServiceDisruption(adminState, disruption.id))} type="button">
                {disruption.active ? "Resolve" : "Reopen"}
              </button>
            </article>
          ))}
        </div>
      </form>
    </section>
  );
}
