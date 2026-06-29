import { Volume2 } from "lucide-react";
import { createVoiceQueue } from "../services/voice";
import type { Route, UserPreferences } from "../types";

export function VoiceGuidancePanel({
  route,
  preferences
}: {
  route: Route | null;
  preferences: UserPreferences;
}) {
  const queue = createVoiceQueue(
    route,
    preferences.preferredLanguage,
    preferences.voiceRate,
    preferences.voiceVolume
  );

  return (
    <section className="enterprise-panel" aria-labelledby="voice-title">
      <div className="panel-heading">
        <Volume2 aria-hidden="true" />
        <div>
          <p className="eyebrow">Voice</p>
          <h2 id="voice-title">Guidance queue</h2>
        </div>
      </div>
      {!preferences.voiceGuidanceEnabled ? <p>Voice guidance is disabled.</p> : null}
      {preferences.voiceGuidanceEnabled ? (
        <ol className="voice-list">
          {queue.slice(0, 3).map((instruction) => (
            <li key={instruction.id}>{instruction.text}</li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
