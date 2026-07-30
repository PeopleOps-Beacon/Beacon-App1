import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "./ui/Button";

const tourStorageKey = "beacon-guided-tour-dismissed";

const tourSteps = [
  { title: "Dashboard", body: "Start with the personalized traveler and enterprise dashboard for airport context." },
  { title: "Navigation", body: "Search, select destinations, and compare accessible, quiet, family, and fast routes." },
  { title: "Traveler Profiles", body: "Switch among veteran, sensory, accessibility, family, business, and international profiles." },
  { title: "AI Recommendations", body: "Review Beacon AI route suggestions, break points, quiet areas, dining, restrooms, and exits." },
  { title: "Favorites", body: "Save important destinations and reuse recent locations during the demo." },
  { title: "Accessibility Settings", body: "Tune mobility, sensory, vision, hearing, high contrast, large text, and route preferences." },
  { title: "Operations Dashboard", body: "Use Demo Mode or airport roles to show heatmaps, incidents, tasks, accessibility metrics, and analytics." },
  { title: "Notifications", body: "Show operational alerts, gate changes, TSA updates, and accessibility service messages." },
  { title: "Analytics", body: "Close with executive KPIs, usage signals, service demand, and operational savings estimates." }
];

function readDismissed(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(tourStorageKey) === "true";
}

export function GuidedTour() {
  const [isDismissed, setIsDismissed] = useState(() => readDismissed());
  const [stepIndex, setStepIndex] = useState(0);
  const step = tourSteps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / tourSteps.length) * 100), [stepIndex]);

  useEffect(() => {
    window.localStorage.setItem(tourStorageKey, String(isDismissed));
  }, [isDismissed]);

  if (isDismissed) {
    return (
      <section className="guided-tour compact" aria-label="Guided product tour">
        <Button onClick={() => setIsDismissed(false)} variant="ghost">
          <RotateCcw aria-hidden="true" /> Restart guided tour
        </Button>
      </section>
    );
  }

  return (
    <section className="guided-tour motion-card" aria-labelledby="guided-tour-title">
      <div className="panel-heading">
        <Sparkles aria-hidden="true" />
        <div>
          <p className="eyebrow">Guided Tour</p>
          <h2 id="guided-tour-title">{step.title}</h2>
        </div>
      </div>
      <p>{step.body}</p>
      <div className="tour-progress" aria-label={"Tour progress " + progress + "%"}>
        <span style={{ width: progress + "%" }} />
      </div>
      <div className="tour-actions">
        <Button disabled={stepIndex === 0} onClick={() => setStepIndex((index) => Math.max(0, index - 1))} variant="secondary">
          <ArrowLeft aria-hidden="true" /> Back
        </Button>
        <Button onClick={() => setStepIndex((index) => Math.min(tourSteps.length - 1, index + 1))} variant="secondary">
          Next <ArrowRight aria-hidden="true" />
        </Button>
        <Button onClick={() => setIsDismissed(true)} variant="ghost">
          <X aria-hidden="true" /> Dismiss
        </Button>
      </div>
    </section>
  );
}
