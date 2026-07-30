import type { AirportLocation, CalculatedRoute, RouteConnection } from "../types";
import { TerminalMap } from "./TerminalMap";

type RoutePreviewMapProps = {
  locations: AirportLocation[];
  connections: RouteConnection[];
  route: CalculatedRoute | null;
  startId: string | null;
  destinationId: string | null;
};

export function RoutePreviewMap({ locations, connections, route, startId, destinationId }: RoutePreviewMapProps) {
  return (
    <section className="route-preview-map" aria-label="Small route preview map">
      <TerminalMap
        connections={connections}
        displayMode="preview"
        locations={locations}
        route={route}
        selectedDestinationId={destinationId ?? undefined}
        selectedStartId={startId ?? undefined}
        showCaption={false}
        showConditions={false}
        showMapStatus={false}
        showProgressSummary={false}
      />
    </section>
  );
}
