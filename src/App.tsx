import { useMemo, useState } from "react";
import { AuthPanel } from "./components/AuthPanel";
import { BeaconLogo } from "./components/BeaconLogo";
import { IntelligenceSurface } from "./components/IntelligenceSurface";
import { OperationsPanel } from "./components/OperationsPanel";
import { TravelerModeSelector } from "./components/TravelerModeSelector";
import { travelerModes } from "./data/travelerModes";
import type { OperationsState, TravelerModeId } from "./types";

const defaultOperations: OperationsState = {
  crowding: 54,
  noise: 42,
  waitTime: 18,
  support: 72
};

export function App() {
  const [selectedMode, setSelectedMode] = useState<TravelerModeId>("veteran");
  const [operations, setOperations] = useState<OperationsState>(defaultOperations);
  const activeMode = useMemo(
    () => travelerModes.find((mode) => mode.id === selectedMode) ?? travelerModes[0],
    [selectedMode]
  );

  return (
    <main className="min-h-screen bg-[#07090b] text-slate-50">
      <section className="app-shell">
        <div className="hero-grid">
          <div className="command-column">
            <BeaconLogo />
            <div className="intro-block">
              <p className="eyebrow">Environmental Intelligence Platform</p>
              <h1>Beacon OS 3.0</h1>
              <p>
                Live airport awareness for travelers who need calm routes, clear signals,
                and confidence before the terminal gets loud.
              </p>
            </div>
            <TravelerModeSelector
              activeMode={selectedMode}
              modes={travelerModes}
              onChange={setSelectedMode}
            />
          </div>

          <IntelligenceSurface mode={activeMode} operations={operations} />

          <aside className="side-column" aria-label="Account and operations controls">
            <AuthPanel />
            <OperationsPanel operations={operations} onChange={setOperations} />
          </aside>
        </div>
      </section>
    </main>
  );
}
