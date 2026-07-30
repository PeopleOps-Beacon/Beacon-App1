import { Bell, Brain, Database, Eye, Footprints, Languages, Navigation, Route, Settings, ShieldCheck, SlidersHorizontal, Type, Users, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { routePreferenceLabels } from "../data/enterprise";
import type { AccessibilityFeature, RoutePreference, UserPreferences } from "../types";
import { Button } from "./ui/Button";

type Props = {
  isOpen: boolean;
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
  onReset: () => void;
  onToggle: (isOpen: boolean) => void;
};

const routePreferenceChoices: RoutePreference[] = [
  "fastest",
  "accessible",
  "quietest",
  "family",
  "least-walking",
  "fewest-elevators",
  "fewest-stairs",
  "wheelchair"
];

const accessibilityNeedChoices: Array<{ id: AccessibilityFeature; label: string }> = [
  { id: "wheelchair-accessible", label: "Wheelchair" },
  { id: "step-free", label: "Mobility impairment" },
  { id: "quiet", label: "Anxiety reduction" },
  { id: "low-sensory", label: "Autism / sensory" },
  { id: "visual-assistance", label: "Vision impairment" },
  { id: "hearing-loop", label: "Hearing impairment" },
  { id: "service-animal-friendly", label: "Service animal" },
  { id: "family-friendly", label: "Family support" }
];

type EnterpriseSettings = {
  analyticsSharing: boolean;
  privacyMode: boolean;
};

const enterpriseSettingsKey = "beacon-enterprise-settings";
const defaultEnterpriseSettings: EnterpriseSettings = {
  analyticsSharing: true,
  privacyMode: false
};

function readEnterpriseSettings(): EnterpriseSettings {
  if (typeof window === "undefined") {
    return defaultEnterpriseSettings;
  }

  try {
    const stored = window.localStorage.getItem(enterpriseSettingsKey);
    return stored ? { ...defaultEnterpriseSettings, ...JSON.parse(stored) } : defaultEnterpriseSettings;
  } catch {
    return defaultEnterpriseSettings;
  }
}

export function SettingsPanel({ isOpen, preferences, onChange, onReset, onToggle }: Props) {
  const [enterpriseSettings, setEnterpriseSettings] = useState(readEnterpriseSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(enterpriseSettingsKey, JSON.stringify(enterpriseSettings));
    } catch {
      // Settings remain usable even if local storage is unavailable.
    }
  }, [enterpriseSettings]);

  const toggleAccessibilityNeed = (need: AccessibilityFeature) => {
    const needs = preferences.accessibilityNeeds.includes(need)
      ? preferences.accessibilityNeeds.filter((item) => item !== need)
      : [...preferences.accessibilityNeeds, need];

    onChange({ accessibilityNeeds: needs });
  };

  const updateEnterpriseSetting = (setting: keyof EnterpriseSettings, value: boolean) => {
    setEnterpriseSettings((current) => ({ ...current, [setting]: value }));
  };

  const handleDemoReset = () => {
    ["beacon-enterprise-role", "beacon-guided-tour-dismissed", "beacon-error-log"].forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Demo reset should never block preference recovery.
      }
    });
    onReset();
  };

  const handleDataReset = () => {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {
      // Reset still restores in-memory preferences if browser storage is unavailable.
    }
    setEnterpriseSettings(defaultEnterpriseSettings);
    onReset();
  };

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
              <option value="system">System</option>
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
              {routePreferenceChoices.map((preference) => (
                <option key={preference} value={preference}>
                  {routePreferenceLabels[preference]}
                </option>
              ))}
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
          <fieldset className="preference-fieldset">
            <legend>Accessibility needs</legend>
            <div className="preference-chip-grid">
              {accessibilityNeedChoices.map((need) => (
                <label key={need.id}>
                  <input
                    checked={preferences.accessibilityNeeds.includes(need.id)}
                    onChange={() => toggleAccessibilityNeed(need.id)}
                    type="checkbox"
                  />
                  {need.label}
                </label>
              ))}
            </div>
          </fieldset>
          <Toggle
            checked={preferences.aiRecommendationsEnabled}
            icon={<Brain aria-hidden="true" />}
            label="AI recommendations"
            onChange={(value) => onChange({ aiRecommendationsEnabled: value })}
          />
          <Toggle
            checked={preferences.smartNotificationsEnabled}
            icon={<Bell aria-hidden="true" />}
            label="Smart notifications"
            onChange={(value) => onChange({ smartNotificationsEnabled: value })}
          />
          <Toggle
            checked={preferences.reduceWalkingDistance}
            icon={<Footprints aria-hidden="true" />}
            label="Reduce walking distance"
            onChange={(value) => onChange({ reduceWalkingDistance: value })}
          />
          <Toggle
            checked={preferences.preferAccessibleRoutes}
            icon={<Route aria-hidden="true" />}
            label="Prefer accessible routes"
            onChange={(value) => onChange({ preferAccessibleRoutes: value })}
          />
          <Toggle
            checked={preferences.avoidCrowds}
            icon={<Users aria-hidden="true" />}
            label="Avoid crowds"
            onChange={(value) => onChange({ avoidCrowds: value })}
          />
          <Toggle
            checked={preferences.avoidNoise}
            icon={<VolumeX aria-hidden="true" />}
            label="Avoid noise"
            onChange={(value) => onChange({ avoidNoise: value })}
          />
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
            checked={!preferences.reducedMotion}
            icon={<SlidersHorizontal aria-hidden="true" />}
            label="Animation control"
            onChange={(value) => onChange({ reducedMotion: !value })}
          />
          <Toggle
            checked={preferences.notificationsEnabled}
            icon={<Bell aria-hidden="true" />}
            label="Notifications"
            onChange={(value) => onChange({ notificationsEnabled: value })}
          />
          <Toggle
            checked={enterpriseSettings.privacyMode}
            icon={<ShieldCheck aria-hidden="true" />}
            label="Privacy mode"
            onChange={(value) => updateEnterpriseSetting("privacyMode", value)}
          />
          <Toggle
            checked={enterpriseSettings.analyticsSharing}
            icon={<Database aria-hidden="true" />}
            label="Share demo analytics"
            onChange={(value) => updateEnterpriseSetting("analyticsSharing", value)}
          />
          <p className="settings-note">
            <Navigation aria-hidden="true" /> Smart routes and <Languages aria-hidden="true" /> translations
            are configured locally for pilot demos.
          </p>
          <div className="settings-action-row">
            <Button onClick={onReset} variant="ghost">
              Reset preferences
            </Button>
            <Button onClick={handleDemoReset} variant="secondary">
              Demo reset
            </Button>
            <Button onClick={handleDataReset} variant="secondary">
              Data reset
            </Button>
          </div>
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
