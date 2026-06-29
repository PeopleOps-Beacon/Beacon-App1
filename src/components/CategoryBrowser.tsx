import { Grid2X2 } from "lucide-react";
import type { AirportLocation, LocationCategory } from "../types";

const categories: Array<{ id: LocationCategory; label: string }> = [
  { id: "dining", label: "Dining" },
  { id: "restroom", label: "Restrooms" },
  { id: "transportation", label: "Transportation" },
  { id: "support", label: "Services" },
  { id: "care", label: "Accessibility" },
  { id: "retail", label: "Shopping" },
  { id: "parking", label: "Parking" },
  { id: "operations", label: "Emergency" }
];

type Props = {
  locations: AirportLocation[];
  onSelect: (location: AirportLocation) => void;
};

export function CategoryBrowser({ locations, onSelect }: Props) {
  return (
    <section className="category-browser" aria-labelledby="category-title">
      <div className="panel-heading">
        <Grid2X2 aria-hidden="true" />
        <div>
          <p className="eyebrow">Browse</p>
          <h2 id="category-title">Categories</h2>
        </div>
      </div>
      <div className="category-grid">
        {categories.map((category) => {
          const match = locations.find((location) => location.category === category.id);
          return (
            <button
              disabled={!match}
              key={category.id}
              onClick={() => match && onSelect(match)}
              type="button"
            >
              <strong>{category.label}</strong>
              <span>{locations.filter((location) => location.category === category.id).length}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
