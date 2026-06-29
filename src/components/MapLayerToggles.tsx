import { Layers3 } from "lucide-react";
import { mapLayers } from "../data/enterprise";
import type { MapLayerId } from "../types";

export function MapLayerToggles({
  activeLayers,
  onToggle
}: {
  activeLayers: MapLayerId[];
  onToggle: (layer: MapLayerId) => void;
}) {
  return (
    <section className="enterprise-panel" aria-labelledby="layers-title">
      <div className="panel-heading">
        <Layers3 aria-hidden="true" />
        <div>
          <p className="eyebrow">Map</p>
          <h2 id="layers-title">Layers</h2>
        </div>
      </div>
      <div className="layer-grid">
        {mapLayers.map((layer) => (
          <label key={layer.id}>
            <input
              checked={activeLayers.includes(layer.id)}
              onChange={() => onToggle(layer.id)}
              type="checkbox"
            />
            {layer.label}
          </label>
        ))}
      </div>
    </section>
  );
}
