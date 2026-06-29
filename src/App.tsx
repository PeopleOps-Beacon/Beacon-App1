import { AdminConfigPanel } from "./components/AdminConfigPanel";
import { AlertsCenter } from "./components/AlertsCenter";
import { AuthPanel } from "./components/AuthPanel";
import { AirportMap } from "./components/AirportMap";
import { AirportInfoPanel } from "./components/AirportInfoPanel";
import { AirportSelector } from "./components/AirportSelector";
import { BeaconLogo } from "./components/BeaconLogo";
import { CategoryBrowser } from "./components/CategoryBrowser";
import { ConditionsPanel } from "./components/ConditionsPanel";
import { DestinationCard } from "./components/DestinationCard";
import { DiagnosticsPanel } from "./components/DiagnosticsPanel";
import { EmergencyPanel } from "./components/EmergencyPanel";
import { EnterpriseDashboard } from "./components/EnterpriseDashboard";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { FlightWidget } from "./components/FlightWidget";
import { MapLayerToggles } from "./components/MapLayerToggles";
import { NavigationPanel } from "./components/NavigationPanel";
import { NotificationCenter } from "./components/NotificationCenter";
import { OfflineStatus } from "./components/OfflineStatus";
import { OperationsPanel } from "./components/OperationsPanel";
import { SearchBar } from "./components/SearchBar";
import { RouteComparison } from "./components/RouteComparison";
import { ServicesDirectory } from "./components/ServicesDirectory";
import { SettingsPanel } from "./components/SettingsPanel";
import { TravelerModeSelector } from "./components/TravelerModeSelector";
import { VoiceGuidancePanel } from "./components/VoiceGuidancePanel";
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
    activeMapLayers,
    activeSettingsPanel,
    airport,
    airports,
    clearDestination,
    conditions,
    currentLocation,
    dismissNotification,
    favoriteDestinationIds,
    favoriteDestinations,
    locations,
    markArrived,
    navigation,
    notifications,
    operations,
    pinnedDestinations,
    preferences,
    recentSearches,
    resetPreferences,
    routeOptions,
    selectedDestination,
    selectedRoutePreference,
    selectRoutePreference,
    selectDestination,
    setAirport,
    setOperations,
    setPreferences,
    setSettingsOpen,
    setTravelerMode,
    toggleMapLayer,
    toggleFavorite,
    togglePinned,
    travelerModeId
  } = useAppContext();
  const modeClass = useModeClass(travelerModeId);
  const themeClass = `theme-${preferences.theme}`;

  return (
    <main className={`min-h-screen bg-[#07090b] text-slate-50 ${modeClass} ${themeClass}`}>
      <a className="skip-link" href="#destination-search">
        Skip to destination search
      </a>
      <section className="app-shell">
        <div className="navigation-grid">
          <div className="command-column">
            <BeaconLogo />
            <AirportSelector airport={airport} airports={airports} onChange={setAirport} />
            <div className="intro-block">
              <p className="eyebrow">Environmental Intelligence Platform</p>
              <h1>{airport.iata} Pilot Console</h1>
              <p>
                Switch airports, search destinations, and generate traveler-aware routes
                for pilot-ready terminal navigation.
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
            <EnterpriseDashboard
              airport={airport}
              favorites={favoriteDestinations}
              mode={activeMode}
              notifications={notifications}
              recents={recentSearches}
            />
            <CategoryBrowser locations={locations} onSelect={selectDestination} />
            <EmergencyPanel locations={locations} onSelect={selectDestination} />
            <FavoritesPanel
              favorites={favoriteDestinations}
              onSelect={selectDestination}
              pinned={pinnedDestinations}
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
            <MapLayerToggles activeLayers={activeMapLayers} onToggle={toggleMapLayer} />
            <RouteComparison
              onSelect={selectRoutePreference}
              options={routeOptions}
              selectedPreference={selectedRoutePreference}
            />
            <NavigationPanel mode={activeMode} navigation={navigation} onArrive={markArrived} />
            <VoiceGuidancePanel preferences={preferences} route={navigation.route} />
            <ConditionsPanel conditions={conditions} />
            <FlightWidget />
            <ServicesDirectory airport={airport} onSelect={selectDestination} />
            <AirportInfoPanel airport={airport} />
          </div>

          <aside className="side-column" aria-label="Destination, account, and operations controls">
            <DestinationCard
              destination={selectedDestination}
              isFavorite={selectedDestination ? favoriteDestinationIds.includes(selectedDestination.id) : false}
              isPinned={selectedDestination ? pinnedDestinations.some((location) => location.id === selectedDestination.id) : false}
              locations={locations}
              mode={activeMode}
              onClear={clearDestination}
              onToggleFavorite={toggleFavorite}
              onTogglePinned={togglePinned}
              route={navigation.route}
            />
            <AlertsCenter airport={airport} />
            <SettingsPanel
              isOpen={activeSettingsPanel}
              onChange={setPreferences}
              onReset={resetPreferences}
              onToggle={setSettingsOpen}
              preferences={preferences}
            />
            <NotificationCenter
              onDismiss={dismissNotification}
              enabled={preferences.notificationsEnabled}
              notifications={notifications}
            />
            <AdminConfigPanel airport={airport} />
            <DiagnosticsPanel />
            <OfflineStatus airport={airport} />
            <AuthPanel />
            <OperationsPanel operations={operations} onChange={setOperations} />
          </aside>
        </div>
      </section>
    </main>
  );
}
