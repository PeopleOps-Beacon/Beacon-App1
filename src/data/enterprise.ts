import type {
  AirportAlert,
  AirportCondition,
  AirportServiceListing,
  FeatureFlags,
  FlightInfo,
  MapLayerId,
  RoutePreference,
  SupportedLanguage,
  TranslationDictionary
} from "../types";

export const routePreferenceLabels: Record<RoutePreference, string> = {
  fastest: "Fastest Route",
  accessible: "Most Accessible",
  quietest: "Quietest Route",
  family: "Family Friendly",
  "least-walking": "Least Walking",
  "fewest-elevators": "Fewest Elevators",
  "fewest-stairs": "Fewest Stairs",
  wheelchair: "Wheelchair Optimized"
};

export const mapLayers: Array<{ id: MapLayerId; label: string }> = [
  { id: "restrooms", label: "Restrooms" },
  { id: "dining", label: "Dining" },
  { id: "accessibility", label: "Accessibility" },
  { id: "transportation", label: "Transportation" },
  { id: "security", label: "Security" },
  { id: "medical", label: "Medical" },
  { id: "shopping", label: "Shopping" },
  { id: "parking", label: "Parking" },
  { id: "charging", label: "Charging" },
  { id: "pet-relief", label: "Pet Relief" }
];

export const airportConditions: AirportCondition[] = [
  {
    id: "gsp-security-wait",
    airportId: "gsp",
    category: "security",
    title: "Security wait increasing",
    description: "North checkpoint wait time is now 18 minutes.",
    severity: "medium",
    avoidInRouting: false,
    waitMinutes: 18
  },
  {
    id: "gsp-elevator-outage",
    airportId: "gsp",
    category: "elevator",
    locationId: "gsp-elevator-main",
    title: "Main elevator outage",
    description: "Main elevator is temporarily unavailable near baggage transition.",
    severity: "high",
    avoidInRouting: true
  },
  {
    id: "avl-construction",
    airportId: "avl",
    category: "construction",
    title: "Concourse construction",
    description: "Temporary construction near food court creates a quieter alternate route.",
    severity: "medium",
    avoidInRouting: true
  },
  {
    id: "clt-crowd",
    airportId: "clt",
    category: "crowd",
    title: "High crowding near central dining",
    description: "Central dining corridor is crowded during banked departures.",
    severity: "medium",
    avoidInRouting: false
  }
];

export const flights: FlightInfo[] = [
  {
    id: "gsp-241",
    airline: "Delta",
    flightNumber: "DL 241",
    gate: "A7",
    status: "boarding",
    boardingTime: "14:10",
    departureTime: "14:40",
    arrivalTime: "16:05",
    terminal: "A",
    carousel: "2"
  },
  {
    id: "avl-883",
    airline: "American",
    flightNumber: "AA 883",
    gate: "A4",
    status: "delayed",
    boardingTime: "15:20",
    departureTime: "16:00",
    arrivalTime: "17:15",
    terminal: "A",
    delayInformation: "Inbound aircraft delayed by weather."
  },
  {
    id: "clt-1208",
    airline: "United",
    flightNumber: "UA 1208",
    gate: "A9",
    status: "on-time",
    boardingTime: "18:05",
    departureTime: "18:35",
    arrivalTime: "20:20",
    terminal: "A",
    carousel: "5"
  }
];

export const serviceListings: AirportServiceListing[] = [
  {
    id: "coffee-service",
    name: "Coffee and espresso",
    category: "dining",
    description: "Coffee, tea, and grab-and-go breakfast items.",
    hours: "5:00 AM - 9:00 PM",
    accessibilityInformation: "Step-free counter access.",
    locationId: "coffee-central"
  },
  {
    id: "charging-service",
    name: "Charging Stations",
    category: "charging",
    description: "Power and USB charging near gate seating.",
    hours: "24 hours",
    accessibilityInformation: "Accessible seating adjacent.",
    locationId: "gate-a7"
  },
  {
    id: "pet-relief-service",
    name: "Pet Relief Area",
    category: "pet-relief",
    description: "Relief area for service animals and pets.",
    hours: "24 hours",
    accessibilityInformation: "Step-free access from concourse.",
    locationId: "family-restroom"
  },
  {
    id: "medical-service",
    name: "First Aid",
    category: "medical",
    description: "First aid and emergency medical support coordination.",
    hours: "24 hours",
    accessibilityInformation: "Staff can dispatch wheelchair support.",
    locationId: "security-office"
  }
];

export const airportAlerts: AirportAlert[] = [
  {
    id: "alert-weather",
    airportId: "gsp",
    title: "Weather monitoring",
    category: "weather",
    severity: "low",
    issuedAt: "2026-06-29T12:00:00-04:00",
    message: "Afternoon storms may affect inbound aircraft."
  },
  {
    id: "alert-accessibility",
    airportId: "gsp",
    title: "Accessibility route advisory",
    category: "accessibility",
    severity: "high",
    issuedAt: "2026-06-29T12:15:00-04:00",
    message: "Main elevator outage requires alternate step-free route."
  },
  {
    id: "alert-transport",
    airportId: "avl",
    title: "Shuttle delay",
    category: "transportation",
    severity: "medium",
    issuedAt: "2026-06-29T12:25:00-04:00",
    message: "Rental car shuttle is running with 10 minute delays."
  }
];

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    dashboard: "Dashboard",
    settings: "Settings",
    search: "Search",
    emergency: "Emergency",
    flights: "Flights"
  },
  es: {
    dashboard: "Panel",
    settings: "Configuración",
    search: "Buscar",
    emergency: "Emergencia",
    flights: "Vuelos"
  },
  fr: {
    dashboard: "Tableau de bord",
    settings: "Paramètres",
    search: "Recherche",
    emergency: "Urgence",
    flights: "Vols"
  },
  de: {
    dashboard: "Übersicht",
    settings: "Einstellungen",
    search: "Suche",
    emergency: "Notfall",
    flights: "Flüge"
  },
  ja: {
    dashboard: "ダッシュボード",
    settings: "設定",
    search: "検索",
    emergency: "緊急",
    flights: "フライト"
  }
};

export const featureFlags: FeatureFlags = {
  smartRoutes: true,
  voiceGuidance: true,
  adminConfig: true,
  flightModule: true
};
