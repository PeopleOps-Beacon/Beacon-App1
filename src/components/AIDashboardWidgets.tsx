import type { ReactNode } from "react";
import { Activity, Bell, Brain, Clock, MapPinned, PauseCircle, ShieldAlert, Volume2, Users } from "lucide-react";
import type { AIRecommendationCard, AirportIntelligence, AirportLocation, RouteRecommendation, SmartNotification, TravelerProfile } from "../types";

function levelLabel(value: number): string {
  if (value >= 72) return "High";
  if (value >= 42) return "Moderate";
  return "Low";
}

function scoreTone(value: number): string {
  if (value >= 72) return "high";
  if (value >= 42) return "medium";
  return "low";
}

export function AIDashboardWidgets({
  airportIntelligence,
  notifications,
  recommendationCards,
  routeRecommendation,
  selectedDestination,
  stressScore,
  travelerProfile
}: {
  airportIntelligence: AirportIntelligence;
  notifications: SmartNotification[];
  recommendationCards: AIRecommendationCard[];
  routeRecommendation: RouteRecommendation | null;
  selectedDestination: AirportLocation | null;
  stressScore: number;
  travelerProfile: TravelerProfile;
}) {
  const suggestedDestination = recommendationCards[0];
  const breakSuggestion = recommendationCards.find((card) => card.type === "care") ?? recommendationCards[4];
  const activeNotifications = notifications.filter((notification) => !notification.dismissed);

  return (
    <section className="ai-dashboard" aria-labelledby="ai-dashboard-title">
      <div className="panel-heading">
        <Brain aria-hidden="true" />
        <div>
          <p className="eyebrow">Beacon AI</p>
          <h2 id="ai-dashboard-title">Traveler intelligence</h2>
        </div>
      </div>

      <div className="ai-widget-grid">
        <Metric icon={<Activity aria-hidden="true" />} label="Airport status" value={airportIntelligence.severity} tone={airportIntelligence.severity} />
        <Metric icon={<Clock aria-hidden="true" />} label="Walking time" value={routeRecommendation ? routeRecommendation.estimatedTimeMinutes + " min" : "Select a destination"} tone="low" />
        <Metric icon={<Users aria-hidden="true" />} label="Crowd level" value={levelLabel(airportIntelligence.crowdLevel)} tone={scoreTone(airportIntelligence.crowdLevel)} />
        <Metric icon={<Volume2 aria-hidden="true" />} label="Noise level" value={levelLabel(airportIntelligence.noiseLevel)} tone={scoreTone(airportIntelligence.noiseLevel)} />
        <Metric icon={<ShieldAlert aria-hidden="true" />} label="Stress score" value={stressScore + "/100"} tone={scoreTone(stressScore)} />
        <Metric icon={<Bell aria-hidden="true" />} label="Notifications" value={activeNotifications.length + " active"} tone={activeNotifications.some((item) => item.severity === "critical" || item.severity === "high") ? "high" : "low"} />
      </div>

      <div className="ai-insight-list">
        <article className="ai-insight">
          <MapPinned aria-hidden="true" />
          <div>
            <strong>{selectedDestination ? selectedDestination.name : suggestedDestination?.name ?? "No suggestion"}</strong>
            <p>{routeRecommendation?.reason ?? suggestedDestination?.description ?? "Search or select a destination for a tailored route."}</p>
          </div>
        </article>
        <article className="ai-insight">
          <PauseCircle aria-hidden="true" />
          <div>
            <strong>{breakSuggestion?.name ?? "Break point pending"}</strong>
            <p>{travelerProfile.label} profile is using crowd, noise, accessibility, and route preferences for recommendations.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Metric({ icon, label, tone, value }: { icon: ReactNode; label: string; tone: string; value: string }) {
  return (
    <span className={"ai-metric " + tone}>
      {icon}
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}
