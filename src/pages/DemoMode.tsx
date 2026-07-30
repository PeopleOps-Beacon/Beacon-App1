import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bell, Brain, MapPinned, Route, Users, X } from "lucide-react";
import type { AirportConfig, AirportLocation, TravelerModeId } from "../types";
import { Button } from "../components/ui/Button";

type DemoScenario = {
  id: string;
  title: string;
  profile: string;
  mode: TravelerModeId;
  destinationKeyword: string;
  notification: string;
  recommendation: string;
  routeSelection: string;
  airportEvent: string;
};

const scenarios: DemoScenario[] = [
  { id: "veteran", title: "Veteran with PTSD", profile: "Avoid crowds, avoid noise, frequent breaks", mode: "veteran", destinationKeyword: "quiet", notification: "Quiet route available", recommendation: "Stop at the quiet room before the gate", routeSelection: "Quietest route", airportEvent: "Heavy congestion detected near dining" },
  { id: "wheelchair", title: "Traveler using Wheelchair", profile: "Step-free, elevator-forward, accessible only", mode: "accessibility", destinationKeyword: "gate", notification: "Elevator outage with alternate route", recommendation: "Use accessible corridor and staffed elevator bank", routeSelection: "Wheelchair optimized", airportEvent: "Main elevator out of service" },
  { id: "family", title: "Family Traveling with Children", profile: "Restroom priority, stroller friendly, dining priority", mode: "family", destinationKeyword: "restroom", notification: "Family restroom nearby", recommendation: "Family restroom and food court before boarding", routeSelection: "Family friendly", airportEvent: "Gate crowding before departure" },
  { id: "vision", title: "Blind / Low Vision Traveler", profile: "Visual assistance, staffed support, clear instructions", mode: "accessibility", destinationKeyword: "information", notification: "Staffed support point nearby", recommendation: "Route via information desk and staffed checkpoint", routeSelection: "Most accessible", airportEvent: "Construction barrier reroute" },
  { id: "business", title: "Business Traveler", profile: "Fastest route, coffee stops, gate alerts", mode: "business", destinationKeyword: "coffee", notification: "Time to depart check", recommendation: "Coffee stop on fastest route", routeSelection: "Fastest route", airportEvent: "Gate change posted" },
  { id: "senior", title: "Senior Traveler", profile: "Reduced walking, accessible seating, clear stops", mode: "accessibility", destinationKeyword: "gate", notification: "Accessible seating nearby", recommendation: "Least walking route with support point", routeSelection: "Least walking", airportEvent: "Security wait increased" },
  { id: "first-time", title: "First-Time Airport Visitor", profile: "More landmarks, low anxiety, simple instructions", mode: "international", destinationKeyword: "tsa", notification: "Step-by-step terminal guidance", recommendation: "Information desk then TSA checkpoint", routeSelection: "Fastest with landmarks", airportEvent: "Weather delay advisory" },
  { id: "operations", title: "Airport Operations View", profile: "Operations leader monitoring flow and support", mode: "business", destinationKeyword: "operations", notification: "Critical incident and staff queue update", recommendation: "Review heatmap, incidents, and accessibility requests", routeSelection: "Operations dashboard", airportEvent: "Medical response requested" }
];

function findDestination(airport: AirportConfig, scenario: DemoScenario): AirportLocation {
  const query = scenario.destinationKeyword.toLowerCase();
  return (
    airport.locations.find((location) =>
      [location.name, location.category, location.description, ...location.keywords, ...location.accessibilityFeatures]
        .join(" ")
        .toLowerCase()
        .includes(query)
    ) ?? airport.locations[0]
  );
}

export function DemoMode({
  airport,
  onClose,
  onSelectDestination,
  onSetTravelerMode
}: {
  airport: AirportConfig;
  onClose: () => void;
  onSelectDestination: (destination: AirportLocation) => void;
  onSetTravelerMode: (mode: TravelerModeId) => void;
}) {
  const [index, setIndex] = useState(0);
  const scenario = scenarios[index];
  const destination = useMemo(() => findDestination(airport, scenario), [airport, scenario]);

  const applyScenario = () => {
    onSetTravelerMode(scenario.mode);
    onSelectDestination(destination);
  };

  return (
    <section className="demo-mode-page motion-page" aria-labelledby="demo-mode-title">
      <div className="demo-mode-heading">
        <div>
          <p className="eyebrow">Executive Demo Mode</p>
          <h2 id="demo-mode-title">{scenario.title}</h2>
          <p>{scenario.profile}</p>
        </div>
        <button aria-label="Close executive demo mode" onClick={onClose} type="button">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="demo-scenario-grid">
        <article><Users aria-hidden="true" /><strong>Traveler profile</strong><span>{scenario.profile}</span></article>
        <article><MapPinned aria-hidden="true" /><strong>Destination</strong><span>{destination.name}</span></article>
        <article><Bell aria-hidden="true" /><strong>Notifications</strong><span>{scenario.notification}</span></article>
        <article><Brain aria-hidden="true" /><strong>AI recommendation</strong><span>{scenario.recommendation}</span></article>
        <article><Route aria-hidden="true" /><strong>Route selection</strong><span>{scenario.routeSelection}</span></article>
        <article><Bell aria-hidden="true" /><strong>Airport event</strong><span>{scenario.airportEvent}</span></article>
      </div>

      <div className="demo-mode-actions">
        <Button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} variant="secondary">
          <ArrowLeft aria-hidden="true" /> Previous
        </Button>
        <Button onClick={applyScenario}>Apply scenario</Button>
        <Button disabled={index === scenarios.length - 1} onClick={() => setIndex((value) => Math.min(scenarios.length - 1, value + 1))} variant="secondary">
          Next <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <p className="demo-progress">Scenario {index + 1} of {scenarios.length}</p>
    </section>
  );
}
