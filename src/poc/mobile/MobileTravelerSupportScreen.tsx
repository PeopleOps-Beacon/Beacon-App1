import { Accessibility, Route, Settings, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import type { PreferenceId, TravelerProfile, TravelerProfileId } from "../types";

type PreferenceGroup = {
  title: string;
  preferences: PreferenceId[];
};

type MobileTravelerSupportScreenProps = {
  onApplyProfile: (profileId: TravelerProfileId) => void;
  onBack: () => void;
  onPrepareRoute: () => void;
  onSelectCustom: () => void;
  onTogglePreference: (preference: PreferenceId) => void;
  preferenceGroups: PreferenceGroup[];
  preferenceLabels: Record<PreferenceId, string>;
  preferences: PreferenceId[];
  profileId: TravelerProfileId;
  routeError: string | null;
  travelerProfiles: TravelerProfile[];
};

export function MobileTravelerSupportScreen({
  onApplyProfile,
  onBack,
  onPrepareRoute,
  onSelectCustom,
  onTogglePreference,
  preferenceGroups,
  preferenceLabels,
  preferences,
  profileId,
  routeError,
  travelerProfiles
}: MobileTravelerSupportScreenProps) {
  return (
    <section className="mobile-support-screen" aria-labelledby="preferences-title">
      <div className="mobile-flow-progress" aria-label="Route planning progress">
        <span>Step 3 of 4</span>
        <b />
      </div>
      <div className="mobile-screen-heading">
        <Sparkles aria-hidden="true" />
        <span>
          <h1 id="preferences-title">What support would help?</h1>
          <p>Choose one route style. Detailed preferences appear only when you customize.</p>
        </span>
      </div>

      <div className="mobile-support-choice-list" role="group" aria-label="Route support choices">
        {travelerProfiles.map((profile) => (
          <button
            aria-pressed={profileId === profile.id}
            className={profileId === profile.id ? "selected" : ""}
            key={profile.id}
            onClick={() => onApplyProfile(profile.id)}
            type="button"
          >
            <UserRound aria-hidden="true" />
            <span>
              <strong>{profile.name}</strong>
              <small>{profile.summary}</small>
            </span>
          </button>
        ))}
        <button
          aria-pressed={profileId === "custom"}
          className={profileId === "custom" ? "selected" : ""}
          onClick={onSelectCustom}
          type="button"
        >
          <Settings aria-hidden="true" />
          <span>
            <strong>Customize My Route</strong>
            <small>Adjust mobility, sensory, reading, cognitive, and pacing support.</small>
          </span>
        </button>
      </div>

      <section className="mobile-security-option" aria-label="Security route option">
        <ShieldCheck aria-hidden="true" />
        <span>
          <strong>TSA PreCheck</strong>
          <small>Use the simulated TSA PreCheck entrance when available.</small>
        </span>
        <label>
          <input
            checked={preferences.includes("tsaPreCheck")}
            onChange={() => onTogglePreference("tsaPreCheck")}
            type="checkbox"
          />
          <span className="sr-only">{preferenceLabels.tsaPreCheck}</span>
        </label>
      </section>

      {profileId === "custom" ? (
        <section className="mobile-preference-sheet" aria-label="Custom route support settings">
          <div className="mobile-section-title">
            <Accessibility aria-hidden="true" />
            <span>
              <strong>Detailed Preferences</strong>
              <small>Only shown when you customize your route.</small>
            </span>
          </div>
          {preferenceGroups.map((group) => (
            <fieldset className="mobile-preference-group" key={group.title}>
              <legend>{group.title}</legend>
              {group.preferences.map((preference) => (
                <label key={preference}>
                  <input
                    checked={preferences.includes(preference)}
                    onChange={() => onTogglePreference(preference)}
                    type="checkbox"
                  />
                  <span>{preferenceLabels[preference]}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </section>
      ) : null}

      <div className="mobile-fixed-action-row">
        <button className="secondary-action" onClick={onBack} type="button">
          Back
        </button>
        <button aria-label="Generate route" className="primary-action" onClick={onPrepareRoute} type="button">
          Prepare Route
          <Route aria-hidden="true" />
        </button>
      </div>
      {routeError ? (
        <p className="form-error" role="alert">
          {routeError}
        </p>
      ) : null}
    </section>
  );
}
