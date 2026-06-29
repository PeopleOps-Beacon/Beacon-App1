import type { TravelerMode, TravelerModeId } from "../types";

type Props = {
  activeMode: TravelerModeId;
  modes: TravelerMode[];
  onChange: (mode: TravelerModeId) => void;
};

export function TravelerModeSelector({ activeMode, modes, onChange }: Props) {
  return (
    <section className="mode-selector" aria-label="Traveler mode">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = mode.id === activeMode;

        return (
          <button
            aria-pressed={isActive}
            className={isActive ? "mode-card active" : "mode-card"}
            key={mode.id}
            onClick={() => onChange(mode.id)}
            style={{ "--accent": mode.accent } as React.CSSProperties}
            type="button"
          >
            <Icon aria-hidden="true" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </section>
  );
}
