import { BadgeCheck, Info } from "lucide-react";
import { beaconLogoUrl } from "../brand/brandAssets";

export function AboutBeacon() {
  return (
    <section className="about-beacon" aria-labelledby="about-beacon-title">
      <div className="about-brand-lockup">
        <img alt="Beacon logo" decoding="async" loading="lazy" src={beaconLogoUrl} />
      </div>
      <div className="panel-heading">
        <Info aria-hidden="true" />
        <div>
          <p className="eyebrow">About Beacon</p>
          <h2 id="about-beacon-title">Executive airport intelligence</h2>
        </div>
      </div>
      <p>
        Beacon helps travelers and airport teams make confident decisions with accessible routing,
        operational awareness, and presentation-ready intelligence.
      </p>
      <div className="brand-meta-grid">
        <span><BadgeCheck aria-hidden="true" /> Version 3.0 pilot</span>
        <span>Veteran-owned professionalism</span>
      </div>
    </section>
  );
}

export function BeaconFooter() {
  return (
    <footer className="beacon-footer" aria-label="Beacon branding">
      <strong>Beacon OS</strong>
      <span>Premium airport accessibility intelligence - Executive demo build</span>
    </footer>
  );
}
