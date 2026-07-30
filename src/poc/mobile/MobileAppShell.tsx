import { LifeBuoy, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { BeaconTabNavigator, type MobileTabId } from "./BeaconTabNavigator";

type MobileAppShellProps = {
  activeTab: MobileTabId;
  beaconMarkSrc: string;
  children: ReactNode;
  hideTabs?: boolean;
  onAdmin: () => void;
  onHelp: () => void;
  onHome: () => void;
  onJourney: () => void;
  onPlan: () => void;
  routeActive?: boolean;
};

export function MobileAppShell({
  activeTab,
  beaconMarkSrc,
  children,
  hideTabs = false,
  onAdmin,
  onHelp,
  onHome,
  onJourney,
  onPlan,
  routeActive = false
}: MobileAppShellProps) {
  return (
    <div className={`mobile-app-shell${routeActive ? " route-active" : ""}`}>
      <div className="mobile-safe-frame">
        <div className="native-status-bar" aria-hidden="true">
          <span>9:41</span>
          <span>Beacon</span>
        </div>
        <header className="mobile-app-topbar">
          <button className="mobile-brand-button" onClick={onHome} type="button">
            <span className="mobile-brand-mark" aria-hidden="true">
              <img alt="" src={beaconMarkSrc} />
            </span>
            <span>
              <strong>Beacon</strong>
              <small>Navigation designed around the traveler</small>
            </span>
          </button>
          <div className="mobile-top-actions" aria-label="App actions">
            <button aria-label="Request assistance" onClick={onHelp} type="button">
              <LifeBuoy aria-hidden="true" />
            </button>
            <button aria-label="Demo Admin" onClick={onAdmin} type="button">
              <ShieldCheck aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="poc-main mobile-app-main">{children}</main>
        {!hideTabs ? (
          <BeaconTabNavigator
            activeItem={activeTab}
            onHelp={onHelp}
            onHome={onHome}
            onJourney={onJourney}
            onPlan={onPlan}
          />
        ) : null}
      </div>
    </div>
  );
}
