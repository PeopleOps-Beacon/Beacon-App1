import { motion } from "framer-motion";
import { Activity, MapPinned, Navigation, Volume2 } from "lucide-react";
import type { OperationsState, TravelerMode } from "../types";

type Props = {
  mode: TravelerMode;
  operations: OperationsState;
};

export function IntelligenceSurface({ mode, operations }: Props) {
  const routeDistance = Math.max(320, 900 - operations.support * 5 + operations.crowding * 2);

  return (
    <section className="intelligence-surface" aria-labelledby="surface-title">
      <div className="surface-header">
        <div>
          <p className="eyebrow">Live Terminal Twin</p>
          <h2 id="surface-title">{mode.routeIntent}</h2>
          <p>{mode.description}</p>
        </div>
        <span className="mode-pill" style={{ borderColor: mode.accent }}>
          {mode.label}
        </span>
      </div>

      <div className="terminal-map" style={{ "--accent": mode.accent } as React.CSSProperties}>
        <div className="concourse concourse-a">A Gates</div>
        <div className="concourse concourse-b">Security</div>
        <div className="concourse concourse-c">Support</div>
        <motion.div
          aria-hidden="true"
          className="route-line"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="traveler-dot"
          animate={{ x: [0, 82, 158], y: [0, -24, 30] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>

      <div className="readout-grid">
        <Readout icon={Activity} label="Crowding" value={`${operations.crowding}%`} />
        <Readout icon={Volume2} label="Noise" value={`${operations.noise} dB`} />
        <Readout icon={Navigation} label="Wait Time" value={`${operations.waitTime} min`} />
        <Readout icon={MapPinned} label="Route" value={`${Math.round(routeDistance)} ft`} />
      </div>
    </section>
  );
}

type ReadoutProps = {
  icon: typeof Activity;
  label: string;
  value: string;
};

function Readout({ icon: Icon, label, value }: ReadoutProps) {
  return (
    <div className="readout">
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
