import { ArrowRight, BarChart3, Brain, HeartHandshake, Plane, ShieldCheck, Sparkles, Users } from "lucide-react";
import { beaconLogoUrl } from "../brand/brandAssets";
import { Button } from "../components/ui/Button";

export function LandingPage({ onEnterProduct, onLaunchDemo }: { onEnterProduct: () => void; onLaunchDemo: () => void }) {
  const benefits = [
    { icon: <Users aria-hidden="true" />, title: "Traveler clarity", body: "Personalized routing, accessibility-aware search, quiet spaces, favorites, and calm guidance for stressful terminal moments." },
    { icon: <Plane aria-hidden="true" />, title: "Airport confidence", body: "Operational visibility into flow, incidents, service demand, accessibility requests, and staff task queues." },
    { icon: <ShieldCheck aria-hidden="true" />, title: "Accessible by design", body: "Clear labels, reduced motion, high contrast, large text, sensory and mobility preferences, and accessible route weighting." },
    { icon: <HeartHandshake aria-hidden="true" />, title: "Veteran support", body: "A professional veteran-centered experience with quiet routes, break recommendations, crowd avoidance, and support scenarios." },
    { icon: <Brain aria-hidden="true" />, title: "Intelligent assistance", body: "Mocked AI recommendations for routes, destinations, dining, restrooms, quiet areas, exits, and traveler stress scoring." },
    { icon: <BarChart3 aria-hidden="true" />, title: "Executive visibility", body: "Presentation-ready dashboards for heatmaps, analytics, incidents, accessibility monitoring, task queues, and simulated events." }
  ];

  return (
    <section className="landing-page motion-page brand-landing" aria-labelledby="landing-title">
      <div className="landing-hero brand-landing-hero">
        <div className="brand-landing-copy">
          <p className="eyebrow">Beacon OS Executive Experience</p>
          <h1 id="landing-title">Airport intelligence that feels calm, premium, and decisive.</h1>
          <p>
            Beacon brings traveler-safe navigation, accessibility support, AI guidance, and airport operations
            intelligence into one executive-ready workspace built around trust and clarity.
          </p>
          <div className="landing-actions">
            <Button onClick={onLaunchDemo}>Launch executive demo <ArrowRight aria-hidden="true" /></Button>
            <Button onClick={onEnterProduct} variant="secondary">Enter pilot console</Button>
          </div>
        </div>
        <div className="brand-landing-visual" aria-label="Beacon brand identity">
          <img alt="Beacon logo" decoding="async" loading="lazy" src={beaconLogoUrl} />
          <span>Confidence in motion</span>
        </div>
      </div>

      <div className="landing-section mission-section">
        <Sparkles aria-hidden="true" />
        <div>
          <h2>Mission</h2>
          <p>
            Help every traveler understand their next best move while giving airport leaders a live,
            accessible, data-informed view of the terminal.
          </p>
        </div>
      </div>

      <div className="landing-section">
        <h2>How Beacon guides the journey</h2>
        <div className="landing-steps">
          <span>1. Confirm airport and traveler needs</span>
          <span>2. Search a gate, service, or amenity</span>
          <span>3. Review the clearest recommended route</span>
          <span>4. Monitor live support needs from operations</span>
        </div>
      </div>

      <div className="landing-benefit-grid">
        {benefits.map((benefit) => (
          <article className="landing-benefit-card" key={benefit.title}>
            {benefit.icon}
            <h3>{benefit.title}</h3>
            <p>{benefit.body}</p>
          </article>
        ))}
      </div>

      <div className="landing-section contact-placeholder">
        <h2>Ready for a pilot conversation</h2>
        <p>Partnership placeholder: airport teams, airlines, TSA stakeholders, accessibility organizations, veteran service organizations, and investors.</p>
        <Button onClick={onLaunchDemo}>Start presentation mode</Button>
      </div>
    </section>
  );
}
