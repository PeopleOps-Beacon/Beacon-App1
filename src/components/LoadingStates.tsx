import { Loader2, Map, Search } from "lucide-react";

export function SkeletonCards({ count = 3, label = "Loading content" }: { count?: number; label?: string }) {
  return (
    <div className="skeleton-list" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <span className="skeleton-card motion-loading" key={index} />
      ))}
    </div>
  );
}

export function ProgressIndicator({ label = "Loading" }: { label?: string }) {
  return (
    <span className="progress-indicator" role="status">
      <Loader2 aria-hidden="true" />
      {label}
    </span>
  );
}

export function DashboardLoader() {
  return <SkeletonCards count={4} label="Loading dashboard" />;
}

export function MapLoader() {
  return (
    <div className="map-loader" role="status">
      <Map aria-hidden="true" />
      Loading airport map
    </div>
  );
}

export function AnalyticsLoader() {
  return <SkeletonCards count={6} label="Loading analytics" />;
}

export function SearchLoader() {
  return (
    <span className="search-loader" role="status">
      <Search aria-hidden="true" />
      Loading search results
    </span>
  );
}

export function NotificationLoader() {
  return <SkeletonCards count={2} label="Loading notifications" />;
}
