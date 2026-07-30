import { BarChart3, BellPlus, MapPinPlus, Route, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";
import { preferenceLabels } from "../mockData";
import type {
  AccessibilityStatus,
  AirportLocation,
  AssistanceRequest,
  CalculatedRoute,
  ContextualAlert,
  LocationType,
  OperationalAlertType,
  RouteConnection
} from "../types";
import { VisualReviewScreen } from "./VisualReviewScreen";

type AdminDashboardProps = {
  locations: AirportLocation[];
  connections: RouteConnection[];
  alerts: ContextualAlert[];
  assistanceRequests: AssistanceRequest[];
  accessibilityStatus: AccessibilityStatus;
  route: CalculatedRoute | null;
  onBack: () => void;
  onExecutiveInsights: () => void;
  onLocationsChange: (locations: AirportLocation[]) => void;
  onConnectionsChange: (connections: RouteConnection[]) => void;
  onAlertsChange: (alerts: ContextualAlert[]) => void;
  onAssistanceRequestsChange: (requests: AssistanceRequest[]) => void;
  onAccessibilityStatusChange: (status: AccessibilityStatus) => void;
};

const locationTypeOptions: LocationType[] = [
  "parking",
  "entry",
  "ticketing",
  "security",
  "concourse",
  "gate",
  "restroom",
  "baggage",
  "transportation",
  "quiet",
  "information",
  "vertical",
  "hallway"
];

const operationalAlertTypeOptions: Array<{ id: OperationalAlertType; label: string }> = [
  { id: "construction", label: "Construction" },
  { id: "gate-change", label: "Gate Change" },
  { id: "busy-checkpoint", label: "Busy Checkpoint" },
  { id: "elevator-unavailable", label: "Elevator Unavailable" },
  { id: "route-closure", label: "Route Closure" },
  { id: "noise-condition", label: "Noise Condition" },
  { id: "crowded-corridor", label: "Crowded Corridor" },
  { id: "amenity-unavailable", label: "Amenity Unavailable" }
];

function labelFor(locations: AirportLocation[], id: string): string {
  return locations.find((location) => location.id === id)?.name ?? id;
}

function nextId(label: string): string {
  const safe = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return safe || `location-${Date.now()}`;
}

export function AdminDashboard({
  locations,
  connections,
  alerts,
  assistanceRequests,
  accessibilityStatus,
  route,
  onBack,
  onExecutiveInsights,
  onLocationsChange,
  onConnectionsChange,
  onAlertsChange,
  onAssistanceRequestsChange,
  onAccessibilityStatusChange
}: AdminDashboardProps) {
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const editingAlert = alerts.find((alert) => alert.id === editingAlertId) ?? null;
  const activeAlerts = alerts.filter((alert) => alert.active).length;
  const closedRoutes = connections.filter((connection) => connection.closed).length;
  const crowdedRoutes = connections.filter((connection) => connection.crowdLevel >= 4).length;
  const mostRequestedDestinations = ["Gate A1", "Gate B2", "Restroom", "Quiet Space"];
  const selectedPreferenceSummary = [
    preferenceLabels.wheelchair,
    preferenceLabels.avoidCrowds,
    preferenceLabels.reducedStimulation,
    preferenceLabels.reassurance
  ];

  function addLocation(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const type = String(formData.get("type") ?? "concourse") as LocationType;

    if (!name) {
      return;
    }

    onLocationsChange([
      ...locations,
      {
        id: nextId(name),
        name,
        type,
        x: 50,
        y: 50,
        description: description || "New demo location added by airport staff.",
        accessibility: ["Staff updated"],
        unavailable: false
      }
    ]);
  }

  function updateConnection(connectionId: string, updates: Partial<RouteConnection>) {
    onConnectionsChange(
      connections.map((connection) => (connection.id === connectionId ? { ...connection, ...updates } : connection))
    );
  }

  function createAlert(formData: FormData) {
    const type = String(formData.get("type") ?? "construction") as OperationalAlertType;
    const title = String(formData.get("title") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const locationId = String(formData.get("locationId") ?? locations[0]?.id);
    const severity = String(formData.get("severity") ?? "information") as ContextualAlert["severity"];

    if (!title || !message) {
      return;
    }

    const nextAlert: ContextualAlert = {
      id: editingAlert?.id ?? `alert-${Date.now()}`,
      type,
      title,
      message,
      locationId,
      nearbyLocationIds: editingAlert?.nearbyLocationIds,
      connectionId: editingAlert?.connectionId,
      priorityCategory: editingAlert?.priorityCategory,
      severity,
      startTime: String(formData.get("startTime") ?? "").trim(),
      endTime: String(formData.get("endTime") ?? "").trim(),
      active: formData.get("active") === "on"
    };

    onAlertsChange(
      editingAlert ? alerts.map((alert) => (alert.id === editingAlert.id ? nextAlert : alert)) : [nextAlert, ...alerts]
    );
    setEditingAlertId(null);
  }

  function updateElevatorAvailability(available: boolean) {
    onAccessibilityStatusChange({ ...accessibilityStatus, elevatorsAvailable: available });
    const existingAlert = alerts.find(
      (alert) => alert.type === "elevator-unavailable" && alert.locationId === "elevators"
    );

    if (existingAlert) {
      onAlertsChange(
        alerts.map((alert) => (alert.id === existingAlert.id ? { ...alert, active: !available } : alert))
      );
      return;
    }

    if (!available) {
      onAlertsChange([
        {
          id: "admin-elevator-unavailable",
          type: "elevator-unavailable",
          title: "Elevator unavailable",
          message: "Beacon selected an alternate step-free path that avoids this elevator.",
          locationId: "elevators",
          nearbyLocationIds: ["security-checkpoint", "concourse-entrance"],
          severity: "caution",
          active: true,
          startTime: "",
          endTime: ""
        },
        ...alerts
      ]);
    }
  }

  function updateRequest(requestId: string, status: AssistanceRequest["status"]) {
    onAssistanceRequestsChange(
      assistanceRequests.map((request) => (request.id === requestId ? { ...request, status } : request))
    );
  }

  return (
    <section className="admin-dashboard" aria-labelledby="admin-title">
      <div className="admin-shell">
        <aside className="admin-side-nav" aria-label="Admin dashboard sections">
          <strong>Beacon Operations</strong>
          <a href="#overview-title">Overview</a>
          <button className="admin-nav-action" onClick={onExecutiveInsights} type="button">
            Executive Insights
          </button>
          <a href="#locations-title">Locations</a>
          <a href="#routes-title">Routes</a>
          <a href="#alerts-title">Alerts</a>
          <a href="#assistance-title">Assistance Requests</a>
          <a href="#accessibility-title">Accessibility Conditions</a>
          <a href="#visual-review-title">Visual Review</a>
          <button className="secondary-action" onClick={onBack} type="button">
            Passenger Demo
          </button>
        </aside>

        <div className="admin-workspace">
          <div className="admin-hero">
            <div>
              <p className="eyebrow">Demo airport operations</p>
              <h1 id="admin-title">Airport Operations Console</h1>
              <p>
                Monitor simulated traveler support, route conditions, alerts, and accessibility readiness for the GSP
                proof of concept.
              </p>
            </div>
            <div className="admin-hero-status" aria-label="Operational readiness">
              <span>Live demo mode</span>
              <strong>{assistanceRequests.filter((request) => request.status !== "Resolved").length} open requests</strong>
            </div>
          </div>

      <section className="admin-section" aria-labelledby="overview-title" id="overview">
        <div className="section-heading">
          <BarChart3 aria-hidden="true" />
          <div>
            <h2 id="overview-title">Overview</h2>
            <p>Mock metrics for leadership and operations review.</p>
          </div>
        </div>
        <div className="metric-grid">
          <article>
            <span>Active travelers</span>
            <strong>42</strong>
          </article>
          <article>
            <span>Routes completed today</span>
            <strong>318</strong>
          </article>
          <article>
            <span>Assistance requests</span>
            <strong>{assistanceRequests.filter((request) => request.status !== "Resolved").length}</strong>
          </article>
          <article>
            <span>Active alerts</span>
            <strong>{activeAlerts}</strong>
          </article>
          <article>
            <span>Temporarily closed routes</span>
            <strong>{closedRoutes}</strong>
          </article>
          <article>
            <span>Crowded route segments</span>
            <strong>{crowdedRoutes}</strong>
          </article>
        </div>
        <div className="admin-chart-grid">
          <article>
            <h3>Most requested destinations</h3>
            {mostRequestedDestinations.map((destination, index) => (
              <span className="bar-row" key={destination}>
                <span>{destination}</span>
                <i style={{ width: `${92 - index * 14}%` }} />
              </span>
            ))}
          </article>
          <article>
            <h3>Accessibility preferences selected</h3>
            {selectedPreferenceSummary.map((preference, index) => (
              <span className="bar-row" key={preference}>
                <span>{preference}</span>
                <i style={{ width: `${86 - index * 12}%` }} />
              </span>
            ))}
          </article>
        </div>
      </section>

      <section className="admin-section" aria-labelledby="locations-title" id="locations">
        <div className="section-heading">
          <MapPinPlus aria-hidden="true" />
          <div>
            <h2 id="locations-title">Manage Locations</h2>
            <p>Add, edit, or temporarily mark locations unavailable.</p>
          </div>
        </div>
        <form
          className="admin-form compact"
          onSubmit={(event) => {
            event.preventDefault();
            addLocation(new FormData(event.currentTarget));
            event.currentTarget.reset();
          }}
        >
          <label>
            Location name
            <input name="name" placeholder="Example: Family Room" />
          </label>
          <label>
            Type
            <select name="type">
              {locationTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <input name="description" placeholder="Short traveler-facing description" />
          </label>
          <button type="submit">Add location</button>
        </form>
        <div className="admin-table">
          {locations.map((location) => (
            <article key={location.id}>
              <div>
                <strong>{location.name}</strong>
                <span>{location.type} | {location.accessibility.join(", ")}</span>
              </div>
              <label>
                Description
                <input
                  aria-label={`Description for ${location.name}`}
                  onChange={(event) =>
                    onLocationsChange(
                      locations.map((item) =>
                        item.id === location.id ? { ...item, description: event.target.value } : item
                      )
                    )
                  }
                  value={location.description}
                />
              </label>
              <label>
                Accessibility information
                <input
                  aria-label={`Accessibility information for ${location.name}`}
                  onChange={(event) =>
                    onLocationsChange(
                      locations.map((item) =>
                        item.id === location.id
                          ? { ...item, accessibility: event.target.value.split(",").map((value) => value.trim()) }
                          : item
                      )
                    )
                  }
                  value={location.accessibility.join(", ")}
                />
              </label>
              <label className="switch-row">
                <input
                  checked={Boolean(location.unavailable)}
                  onChange={(event) =>
                    onLocationsChange(
                      locations.map((item) =>
                        item.id === location.id ? { ...item, unavailable: event.target.checked } : item
                      )
                    )
                  }
                  type="checkbox"
                />
                Mark unavailable
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="routes-title" id="routes">
        <div className="section-heading">
          <Route aria-hidden="true" />
          <div>
            <h2 id="routes-title">Manage Routes</h2>
            <p>Close route segments or adjust accessibility and stimulation metadata.</p>
          </div>
        </div>
        <div className="route-admin-list">
          {connections.map((connection) => (
            <article key={connection.id}>
              <div>
                <strong>
                  {labelFor(locations, connection.from)} to {labelFor(locations, connection.to)}
                </strong>
                <span>{connection.distanceFeet} ft | {connection.estimatedMinutes} min | {connection.description}</span>
              </div>
              <label className="switch-row">
                <input
                  checked={connection.closed}
                  onChange={(event) => updateConnection(connection.id, { closed: event.target.checked })}
                  type="checkbox"
                />
                Temporarily closed
              </label>
              <label className="switch-row">
                <input
                  checked={connection.crowdLevel >= 4}
                  onChange={(event) => updateConnection(connection.id, { crowdLevel: event.target.checked ? 5 : 2 })}
                  type="checkbox"
                />
                Mark crowded
              </label>
              <label className="switch-row">
                <input
                  checked={connection.reducedStimulation}
                  onChange={(event) => updateConnection(connection.id, { reducedStimulation: event.target.checked })}
                  type="checkbox"
                />
                Reduced stimulation
              </label>
              <label className="switch-row">
                <input
                  checked={connection.wheelchairAccessible}
                  onChange={(event) => updateConnection(connection.id, { wheelchairAccessible: event.target.checked })}
                  type="checkbox"
                />
                Wheelchair accessible
              </label>
              <label className="switch-row">
                <input
                  checked={connection.hasStairs}
                  onChange={(event) => updateConnection(connection.id, { hasStairs: event.target.checked })}
                  type="checkbox"
                />
                Includes stairs
              </label>
              <label className="switch-row">
                <input
                  checked={connection.hasElevator}
                  onChange={(event) => updateConnection(connection.id, { hasElevator: event.target.checked })}
                  type="checkbox"
                />
                Includes elevator
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="alerts-title" id="alerts">
        <div className="section-heading">
          <BellPlus aria-hidden="true" />
          <div>
            <h2 id="alerts-title">Manage Alerts</h2>
            <p>Create and update simulated traveler alerts.</p>
          </div>
        </div>
        <form
          className="admin-form"
          key={editingAlert?.id ?? "new-alert"}
          onSubmit={(event) => {
            event.preventDefault();
            createAlert(new FormData(event.currentTarget));
            event.currentTarget.reset();
          }}
        >
          <label>
            Type
            <select defaultValue={editingAlert?.type ?? "construction"} name="type">
              {operationalAlertTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Alert title
            <input defaultValue={editingAlert?.title ?? ""} name="title" placeholder="Example: Route closed" />
          </label>
          <label>
            Short message
            <textarea
              defaultValue={editingAlert?.message ?? ""}
              name="message"
              placeholder="Short alert shown to travelers"
            />
          </label>
          <label>
            Affected location
            <select defaultValue={editingAlert?.locationId ?? locations[0]?.id} name="locationId">
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Severity
            <select defaultValue={editingAlert?.severity ?? "information"} name="severity">
              <option value="information">Information</option>
              <option value="caution">Caution</option>
              <option value="assistance">Assistance</option>
            </select>
          </label>
          <label>
            Optional start time
            <input defaultValue={editingAlert?.startTime ?? ""} name="startTime" placeholder="HH:MM or ISO time" />
          </label>
          <label>
            Optional end time
            <input defaultValue={editingAlert?.endTime ?? ""} name="endTime" placeholder="HH:MM or ISO time" />
          </label>
          <label className="switch-row">
            <input defaultChecked={editingAlert?.active ?? true} name="active" type="checkbox" />
            Active
          </label>
          <button type="submit">{editingAlert ? "Save Alert" : "Create Alert"}</button>
          {editingAlert ? (
            <button className="secondary-action" onClick={() => setEditingAlertId(null)} type="button">
              Cancel Edit
            </button>
          ) : null}
        </form>
        <div className="alert-admin-list">
          {alerts.map((alert) => (
            <article className={`alert-card ${alert.severity}`} key={alert.id}>
              <div>
                <strong>{alert.title}</strong>
                <span>{labelFor(locations, alert.locationId)} | {alert.startTime} to {alert.endTime}</span>
                <p>{alert.message}</p>
              </div>
              <label className="switch-row">
                <input
                  checked={alert.active}
                  onChange={(event) =>
                    onAlertsChange(
                      alerts.map((item) => (item.id === alert.id ? { ...item, active: event.target.checked } : item))
                    )
                  }
                  type="checkbox"
                />
                Active
              </label>
              <button
                aria-label={`Edit ${alert.title}`}
                className="secondary-action"
                onClick={() => setEditingAlertId(alert.id)}
                type="button"
              >
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="assistance-title" id="assistance">
        <div className="section-heading">
          <UsersRound aria-hidden="true" />
          <div>
            <h2 id="assistance-title">Assistance Requests</h2>
            <p>Mock queue for traveler support dispatch.</p>
          </div>
        </div>
        <div className="request-list">
          {assistanceRequests.map((request) => (
            <article key={request.id}>
              <div>
                <strong>{request.requestType}</strong>
                <span>
                  {request.travelerLocation} | {request.submittedAt} | {request.priority} priority | Assigned to{" "}
                  {request.assignedStaff}
                </span>
              </div>
              <label>
                Status
                <select
                  aria-label={`Status for ${request.requestType}`}
                  onChange={(event) => updateRequest(request.id, event.target.value as AssistanceRequest["status"])}
                  value={request.status}
                >
                  <option>New</option>
                  <option>Acknowledged</option>
                  <option>Staff Dispatched</option>
                  <option>Resolved</option>
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="accessibility-title" id="accessibility">
        <div className="section-heading">
          <ShieldCheck aria-hidden="true" />
          <div>
            <h2 id="accessibility-title">Accessibility Information</h2>
            <p>Update traveler-facing accessibility and environmental conditions.</p>
          </div>
        </div>
        <div className="accessibility-admin-grid">
          <label className="switch-row">
            <input
              checked={accessibilityStatus.elevatorsAvailable}
              onChange={(event) => updateElevatorAvailability(event.target.checked)}
              type="checkbox"
            />
            Elevator availability
          </label>
          <label className="switch-row">
            <input
              checked={accessibilityStatus.accessibleRestroomsAvailable}
              onChange={(event) =>
                onAccessibilityStatusChange({
                  ...accessibilityStatus,
                  accessibleRestroomsAvailable: event.target.checked
                })
              }
              type="checkbox"
            />
            Accessible restroom availability
          </label>
          <label className="switch-row">
            <input
              checked={accessibilityStatus.quietSpaceAvailable}
              onChange={(event) =>
                onAccessibilityStatusChange({ ...accessibilityStatus, quietSpaceAvailable: event.target.checked })
              }
              type="checkbox"
            />
            Quiet space availability
          </label>
          <label>
            Sensory conditions
            <select
              onChange={(event) =>
                onAccessibilityStatusChange({
                  ...accessibilityStatus,
                  sensoryConditions: event.target.value as AccessibilityStatus["sensoryConditions"]
                })
              }
              value={accessibilityStatus.sensoryConditions}
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <label>
            Crowd conditions
            <select
              onChange={(event) =>
                onAccessibilityStatusChange({
                  ...accessibilityStatus,
                  crowdConditions: event.target.value as AccessibilityStatus["crowdConditions"]
                })
              }
              value={accessibilityStatus.crowdConditions}
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <label>
            Construction or noise concerns
            <textarea
              onChange={(event) =>
                onAccessibilityStatusChange({ ...accessibilityStatus, constructionNotes: event.target.value })
              }
              value={accessibilityStatus.constructionNotes}
            />
          </label>
          <label>
            Temporary obstacles
            <textarea
              onChange={(event) =>
                onAccessibilityStatusChange({ ...accessibilityStatus, temporaryObstacles: event.target.value })
              }
              value={accessibilityStatus.temporaryObstacles}
            />
          </label>
        </div>
      </section>
      <VisualReviewScreen route={route} />
        </div>
      </div>
    </section>
  );
}
