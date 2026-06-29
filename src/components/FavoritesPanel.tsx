import { Pin, Star } from "lucide-react";
import type { AirportLocation } from "../types";

type Props = {
  favorites: AirportLocation[];
  pinned: AirportLocation[];
  onSelect: (location: AirportLocation) => void;
};

export function FavoritesPanel({ favorites, pinned, onSelect }: Props) {
  const items = [...pinned, ...favorites.filter((favorite) => !pinned.some((item) => item.id === favorite.id))];

  return (
    <section className="favorites-panel" aria-labelledby="favorites-title">
      <div className="panel-heading">
        <Star aria-hidden="true" />
        <div>
          <p className="eyebrow">Saved</p>
          <h2 id="favorites-title">Favorites and pins</h2>
        </div>
      </div>
      {items.length === 0 ? (
        <p>No saved destinations yet.</p>
      ) : (
        <div className="saved-list">
          {items.map((location) => (
            <button key={location.id} onClick={() => onSelect(location)} type="button">
              {pinned.some((item) => item.id === location.id) ? <Pin aria-hidden="true" /> : <Star aria-hidden="true" />}
              {location.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
