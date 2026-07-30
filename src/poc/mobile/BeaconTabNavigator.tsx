import { CircleHelp, Home, Map, Navigation } from "lucide-react";

export type MobileTabId = "home" | "plan" | "journey" | "help";

type BeaconTabNavigatorProps = {
  activeItem: MobileTabId;
  onHelp: () => void;
  onHome: () => void;
  onJourney: () => void;
  onPlan: () => void;
};

export function BeaconTabNavigator({
  activeItem,
  onHelp,
  onHome,
  onJourney,
  onPlan
}: BeaconTabNavigatorProps) {
  const items = [
    { id: "home", label: "Home", icon: Home, onClick: onHome },
    { id: "plan", label: "Plan", icon: Map, onClick: onPlan },
    { id: "journey", label: "Journey", icon: Navigation, onClick: onJourney },
    { id: "help", label: "Help", icon: CircleHelp, onClick: onHelp }
  ] as const;

  return (
    <nav className="beacon-tab-navigator" aria-label="Passenger app navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeItem === item.id;
        return (
          <button
            aria-current={active ? "page" : undefined}
            className={active ? "active" : ""}
            key={item.id}
            onClick={item.onClick}
            type="button"
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
