import { WifiOff } from "lucide-react";
import type { AirportConfig } from "../types";
import { createOfflineManifest, isOfflineReady } from "../utils/offline";

export function OfflineStatus({ airport }: { airport: AirportConfig }) {
  const manifest = createOfflineManifest(airport);
  const ready = isOfflineReady(airport);

  return (
    <section className="offline-status" aria-labelledby="offline-title">
      <div className="panel-heading">
        <WifiOff aria-hidden="true" />
        <div>
          <p className="eyebrow">Offline</p>
          <h2 id="offline-title">{ready ? "Offline-ready" : "Needs data"}</h2>
        </div>
      </div>
      <p>{manifest.length} local assets and data scopes prepared for service worker caching.</p>
    </section>
  );
}
