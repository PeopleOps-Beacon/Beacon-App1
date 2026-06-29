import { AuthPanel } from "./components/AuthPanel";
import { AirportMap } from "./components/AirportMap";
import { BeaconLogo } from "./components/BeaconLogo";
import { DestinationCard } from "./components/DestinationCard";
import { NavigationPanel } from "./components/NavigationPanel";
import { OperationsPanel } from "./components/OperationsPanel";
import { SearchBar } from "./components/SearchBar";
import { TravelerModeSelector } from "./components/TravelerModeSelector";
import { AppProvider } from "./context/AppContext";
import { travelerModes } from "./data/travelerModes";
import { useAppContext } from "./hooks/useAppContext";
import { useModeClass } from "./hooks/useModeClass";

export function App() {
  return (
    <AppProvider>
      <BeaconWorkspace />
    </AppProvider>
  );
}

function BeaconWorkspace() {
  const {
    activeMode,
    clearDestination,
    currentLocation,
    locations,
    markArrived,
    navigation,
    operations,
    recentSearches,
    selectedDestination,
    selectDestination,
    setOperations,
    setTravelerMode,
    travelerModeId
  } = useAppContext();
  const modeClass = useModeClass(travelerModeId);

  return (
    <main className={`min-h-screen bg-[#07090b] text-slate-50 ${modeClass}`}>
      <section className="app-shell">
        <div className="navigation-grid">
          <div className="command-column">
            <BeaconLogo />
            <div className="intro-block">
              <p className="eyebrow">Environmental Intelligence Platform</p>
              <h1>Beacon Navigation MVP</h1>
              <p>
                Search the terminal, choose a destination, and generate a traveler-aware
                mock route through the airport.
              </p>
            </div>
            <TravelerModeSelector
              activeMode={travelerModeId}
              modes={travelerModes}
              onChange={setTravelerMode}
            />
            <SearchBar
              locations={locations}
              onSelect={selectDestination}
              recentSearches={recentSearches}
              travelerMode={travelerModeId}
            />
          </div>

          <div className="map-column">
            <AirportMap
              currentLocation={currentLocation}
              locations={locations}
              mode={activeMode}
              onSelect={selectDestination}
              route={navigation.route}
              selectedDestination={selectedDestination}
            />
            <NavigationPanel mode={activeMode} navigation={navigation} onArrive={markArrived} />
          </div>

          <aside className="side-column" aria-label="Destination, account, and operations controls">
            <DestinationCard
              destination={selectedDestination}
              locations={locations}
              mode={activeMode}
              onClear={clearDestination}
              route={navigation.route}
            />
            <AuthPanel />
            <OperationsPanel operations={operations} onChange={setOperations} />
          </aside>
        </div>
      </section>
    </main>
  );
}
