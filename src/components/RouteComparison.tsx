import { GitCompareArrows } from "lucide-react";
import type { RouteOption, RoutePreference } from "../types";
import { formatDistance } from "../utils/navigation";

type Props = {
  options: RouteOption[];
  selectedPreference: RoutePreference;
  onSelect: (preference: RoutePreference) => void;
};

export function RouteComparison({ options, selectedPreference, onSelect }: Props) {
  return (
    <section className="enterprise-panel route-comparison" aria-labelledby="route-options-title">
      <div className="panel-heading">
        <GitCompareArrows aria-hidden="true" />
        <div>
          <p className="eyebrow">Smart Guidance</p>
          <h2 id="route-options-title">Route options</h2>
        </div>
      </div>
      {options.length === 0 ? (
        <p>Select a destination to compare intelligent routes.</p>
      ) : (
        <div className="route-option-list">
          {options.map((option) => (
            <button
              aria-pressed={option.preference === selectedPreference}
              className={option.preference === selectedPreference ? "route-option active" : "route-option"}
              key={option.preference}
              onClick={() => onSelect(option.preference)}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>
                {option.estimatedWalkMinutes} min · {formatDistance(option.distanceFeet)} ·{" "}
                {option.turnCount} turns
              </span>
              <small>
                Accessibility {option.accessibilityScore}% · {option.difficulty}
              </small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
