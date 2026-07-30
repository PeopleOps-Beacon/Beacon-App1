import { CheckCircle2, Compass, Search, Sparkles } from "lucide-react";
import { beaconLogoUrl } from "../brand/brandAssets";

export function BrandWelcomePanel() {
  return (
    <section className="brand-welcome-panel motion-card" aria-labelledby="brand-welcome-title">
      <div className="brand-welcome-hero">
        <img alt="Beacon logo" decoding="async" loading="lazy" src={beaconLogoUrl} />
      </div>
      <div>
        <p className="eyebrow">Welcome to Beacon</p>
        <h2 id="brand-welcome-title">Start with confidence</h2>
        <p>
          Choose an airport, pick a traveler profile, then search for a destination. Beacon will recommend the clearest next step.
        </p>
      </div>
      <div className="setup-progress" aria-label="Beacon setup progress">
        <span style={{ width: "66%" }} />
      </div>
      <div className="brand-tip-grid">
        <span><Compass aria-hidden="true" /> Airport selected</span>
        <span><CheckCircle2 aria-hidden="true" /> Profile ready</span>
        <span><Search aria-hidden="true" /> Search next</span>
        <span><Sparkles aria-hidden="true" /> Ctrl K anytime</span>
      </div>
    </section>
  );
}
