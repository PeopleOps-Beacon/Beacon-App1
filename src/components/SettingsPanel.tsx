import { Bell, Eye, Languages, Navigation, Settings, ShieldCheck, Type, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import type { UserPreferences } from "../types";
import { Button } from "./ui/Button";

type Props = {
  isOpen: boolean;
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
  onReset: () => void;
  onToggle: (isOpen: boolean) => void;
};

export function SettingsPanel({ isOpen, preferences, onChange, onReset, onToggle }: Props) {
  return (
    <section className="settings-panel" aria-labelledby="settings-title">
      <div className="panel-heading">
        <Settings aria-hidden="true" />
        <div>
          <p className="eyebrow">Pilot Settings</p>
          <h2 id="settings-title">Traveler profile</h2>
        </div>
      </div>
      <Button onClick={() => onToggle(!isOpen)} variant="secondary">
        {isOpen ? "Hide settings" : "Open settings"}
      </Button>

      {isOpen ? (
        <div className="settings-grid">
          <label>
            Theme
            <select
              onChange={(event) =>
                onChange({ theme: event.target.value as UserPreferences["theme"] })
              }
              value={preferences.theme}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="calm">PTSD Calm</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </label>
          <label>
            Route preference
            <select
              onChange={(event) =>
                onChange({
                  preferredRouteType: event.target.value as UserPreferences["preferredRouteType"]
                })
              }
              value={preferences.preferredRouteType}
            >
              <option value="fastest">Fastest</option>
              <option value="accessible">Most accessible</option>
              <option value="quietest">Quietest</option>
              <option value="family">Family friendly</option>
              <option value="least-walking">Least walking</option>
              <option value="wheelchair">Wheelchair optimized</option>
            </select>
          </label>
          <label>
            Walking speed
            <select
              onChange={(event) =>
                onChange({
                  preferredWalkingSpeed: event.target.value as UserPreferences["preferredWalkingSpeed"]
                })
              }
              value={preferences.preferredWalkingSpeed}
            >
              <option value="slow">Slow</option>
              <option value="standard">Standard</option>
              <option value="fast">Fast</option>
            </select>
          </label>
          <label>
            Language
            <select
              onChange={(event) =>
                onChange({
                  preferredLanguage: event.target.value as UserPreferences["preferredLanguage"]
                })
              }
              value={preferences.preferredLanguage}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </label>
          <label>
            Sensory sensitivity
            <select
              onChange={(event) =>
                onChange({
                  sensorySensitivity: event.target.value as UserPreferences["sensorySensitivity"]
                })
              }
              value={preferences.sensorySensitivity}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <Toggle
            checked={preferences.voiceGuidanceEnabled}
            icon={<Volume2 aria-hidden="true" />}
            label="Voice guidance"
            onChange={(value) => onChange({ voiceGuidanceEnabled: value })}
          />
          <Toggle
            checked={preferences.highContrast}
            icon={<Eye aria-hidden="true" />}
            label="High contrast"
            onChange={(value) => onChange({ highContrast: value })}
          />
          <Toggle
            checked={preferences.largeText}
            icon={<Type aria-hidden="true" />}
            label="Large text"
            onChange={(value) => onChange({ largeText: value })}
          />
          <Toggle
            checked={preferences.reducedMotion}
            icon={<ShieldCheck aria-hidden="true" />}
            label="Reduced motion"
            onChange={(value) => onChange({ reducedMotion: value })}
          />
          <Toggle
            checked={preferences.notificationsEnabled}
            icon={<Bell aria-hidden="true" />}
            label="Mock notifications"
            onChange={(value) => onChange({ notificationsEnabled: value })}
          />
          <p className="settings-note">
            <Navigation aria-hidden="true" /> Smart routes and <Languages aria-hidden="true" /> translations
            are configured locally for pilot demos.
          </p>
          <Button onClick={onReset} variant="ghost">
            Reset preferences
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function Toggle({
  checked,
  icon,
  label,
  onChange
}: {
  checked: boolean;
  icon: ReactNode;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>
        {icon}
        {label}
      </span>
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
    </label>
  );
}
