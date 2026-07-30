import { Activity, MapPinOff, RouteOff, ServerCrash, WifiOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AirportConfig, NavigationState } from "../types";
import { isOfflineReady } from "../utils/offline";

type StatusTone = "ok" | "warning" | "error";

type StatusItem = {
  id: "network" | "gps" | "airport-data" | "routing" | "api";
  label: string;
  detail: string;
  tone: StatusTone;
};

function getOnlineStatus(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.onLine !== "boolean") {
    return true;
  }

  return navigator.onLine;
}

function hasGpsSupport(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

export function SystemStatusPanel({
  airport,
  navigation
}: {
  airport: AirportConfig;
  navigation: NavigationState;
}) {
  const [isOnline, setIsOnline] = useState(getOnlineStatus);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checks = useMemo<StatusItem[]>(() => {
    const dataReady = isOfflineReady(airport);
    const routeReady = !navigation.isNavigating || Boolean(navigation.route);
    const gpsReady = hasGpsSupport();

    return [
      {
        id: "network",
        label: "Internet",
        detail: isOnline ? "Connected for live airport updates." : "Offline mode active with local airport data.",
        tone: isOnline ? "ok" : "warning"
      },
      {
        id: "gps",
        label: "Positioning",
        detail: gpsReady
          ? "Device positioning available; indoor map fallback remains ready."
          : "GPS unavailable; Beacon is using the terminal map fallback.",
        tone: gpsReady ? "ok" : "warning"
      },
      {
        id: "airport-data",
        label: "Airport data",
        detail: dataReady
          ? airport.iata + " locations and map data are loaded."
          : airport.iata + " airport data is incomplete.",
        tone: dataReady ? "ok" : "error"
      },
      {
        id: "routing",
        label: "Routing",
        detail: routeReady ? "Route engine is available." : "Route generation failed; select another destination.",
        tone: routeReady ? "ok" : "error"
      },
      {
        id: "api",
        label: "Airport APIs",
        detail: isOnline ? "Request retry and cache layer ready." : "API calls will use cached pilot data until online.",
        tone: isOnline ? "ok" : "warning"
      }
    ];
  }, [airport, isOnline, navigation.isNavigating, navigation.route]);

  const iconMap = {
    network: WifiOff,
    gps: MapPinOff,
    "airport-data": ServerCrash,
    routing: RouteOff,
    api: Activity
  };

  return (
    <section className="enterprise-panel system-status-panel" aria-labelledby="system-status-title">
      <div className="panel-heading">
        <Activity aria-hidden="true" />
        <div>
          <p className="eyebrow">Reliability</p>
          <h2 id="system-status-title">System status</h2>
        </div>
      </div>
      <div className="status-list">
        {checks.map((check) => {
          const StatusIcon = iconMap[check.id];
          return (
            <article className={"status-item " + check.tone} key={check.id}>
              <StatusIcon aria-hidden="true" />
              <div>
                <strong>{check.label}</strong>
                <p>{check.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
