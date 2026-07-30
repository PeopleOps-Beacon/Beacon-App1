import { memo } from "react";
import { Grid3X3 } from "lucide-react";
import type { CrowdZone } from "../services/DemoDataGenerator";

function CrowdHeatmapComponent({ zones }: { zones: CrowdZone[] }) {
  return (
    <section className="operations-card crowd-heatmap" aria-labelledby="crowd-heatmap-title">
      <div className="panel-heading compact">
        <Grid3X3 aria-hidden="true" />
        <div>
          <p className="eyebrow">Heatmap</p>
          <h3 id="crowd-heatmap-title">Crowd density</h3>
        </div>
      </div>
      <div className="heatmap-grid">
        {zones.map((zone) => (
          <article className={"heatmap-zone " + zone.level} key={zone.id}>
            <strong>{zone.name}</strong>
            <span>{zone.level}</span>
            <small>{zone.occupancy}% capacity</small>
          </article>
        ))}
      </div>
      <div className="heatmap-legend" aria-label="Crowd level legend">
        <span className="low">Low</span>
        <span className="medium">Medium</span>
        <span className="high">High</span>
        <span className="critical">Critical</span>
      </div>
    </section>
  );
}

export const CrowdHeatmap = memo(CrowdHeatmapComponent);
