import { HelpCircle, Home, Navigation, Route } from "lucide-react";

type BottomNavigationProps = {
  activeItem: "home" | "navigate" | "route" | "help";
  onHome: () => void;
  onNavigate: () => void;
  onRoute: () => void;
  onHelp: () => void;
};

export function BottomNavigation({ activeItem, onHome, onNavigate, onRoute, onHelp }: BottomNavigationProps) {
  const items = [
    { id: "home", label: "Home", icon: Home, onClick: onHome },
    { id: "navigate", label: "Navigate", icon: Navigation, onClick: onNavigate },
    { id: "route", label: "My Route", icon: Route, onClick: onRoute },
    { id: "help", label: "Help", icon: HelpCircle, onClick: onHelp }
  ] as const;

  return (
    <nav className="bottom-navigation" aria-label="Passenger navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeItem === item.id;
        return (
          <button aria-current={active ? "page" : undefined} className={active ? "active" : ""} key={item.id} onClick={item.onClick} type="button">
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
