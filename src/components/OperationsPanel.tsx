import { SlidersHorizontal } from "lucide-react";
import type { OperationsState } from "../types";

type Props = {
  operations: OperationsState;
  onChange: (operations: OperationsState) => void;
};

const controls: Array<{ key: keyof OperationsState; label: string; suffix: string; min: number; max: number }> = [
  { key: "crowding", label: "Crowding", suffix: "%", min: 0, max: 100 },
  { key: "noise", label: "Noise", suffix: " dB", min: 20, max: 95 },
  { key: "waitTime", label: "Wait time", suffix: " min", min: 0, max: 60 },
  { key: "support", label: "Support coverage", suffix: "%", min: 0, max: 100 }
];

export function OperationsPanel({ operations, onChange }: Props) {
  return (
    <section className="panel operations-panel" aria-labelledby="operations-title">
      <div className="panel-heading">
        <SlidersHorizontal aria-hidden="true" />
        <div>
          <p className="eyebrow">Simulation</p>
          <h2 id="operations-title">Airport operations</h2>
        </div>
      </div>

      <div className="control-stack">
        {controls.map((control) => (
          <label key={control.key}>
            <span>
              {control.label}
              <strong>
                {operations[control.key]}
                {control.suffix}
              </strong>
            </span>
            <input
              max={control.max}
              min={control.min}
              onChange={(event) =>
                onChange({ ...operations, [control.key]: Number(event.target.value) })
              }
              type="range"
              value={operations[control.key]}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
