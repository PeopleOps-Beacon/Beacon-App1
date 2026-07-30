import { Accessibility, Clock, MapPin, Star } from "lucide-react";
import type { AIRecommendationCard, AirportLocation } from "../types";
import { formatDistance } from "../utils/navigation";

export function RecommendationCards({
  cards,
  favoriteDestinationIds,
  locations,
  onFavorite,
  onSelect
}: {
  cards: AIRecommendationCard[];
  favoriteDestinationIds: string[];
  locations: AirportLocation[];
  onFavorite: (destinationId: string) => void;
  onSelect: (destination: AirportLocation) => void;
}) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="recommendation-panel" aria-labelledby="recommendation-title">
      <div className="panel-heading">
        <MapPin aria-hidden="true" />
        <div>
          <p className="eyebrow">Recommendations</p>
          <h2 id="recommendation-title">Suggested next stops</h2>
        </div>
      </div>

      <div className="recommendation-list">
        {cards.map((card) => {
          const location = locations.find((item) => item.id === card.locationId);
          const isFavorite = favoriteDestinationIds.includes(card.locationId);

          return (
            <article className="recommendation-card" key={card.id}>
              <div className="recommendation-card-heading">
                <button
                  aria-label={location ? "Open " + card.name : card.name}
                  disabled={!location}
                  onClick={() => location ? onSelect(location) : undefined}
                  type="button"
                >
                  <strong>{card.name}</strong>
                  <small>{card.type}</small>
                </button>
                <button
                  aria-label={isFavorite ? "Remove " + card.name + " from favorites" : "Save " + card.name + " as favorite"}
                  className="icon-action"
                  onClick={() => onFavorite(card.locationId)}
                  type="button"
                >
                  <Star aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              <p>{card.description}</p>
              <div className="recommendation-meta">
                <span><MapPin aria-hidden="true" />{formatDistance(card.distanceFeet)}</span>
                <span><Clock aria-hidden="true" />{card.walkingTimeMinutes} min</span>
                <span><Accessibility aria-hidden="true" />{card.accessibility}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
