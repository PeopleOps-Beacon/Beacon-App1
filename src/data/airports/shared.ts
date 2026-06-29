import type { AirportInfoPage, AirportLocation, TravelerModeId } from "../../types";

export const allTravelerModes: TravelerModeId[] = [
  "veteran",
  "sensory",
  "accessibility",
  "family",
  "business",
  "international"
];

export function cloneLocationsForAirport(
  locations: AirportLocation[],
  airportId: string,
  xOffset: number,
  yOffset: number
): AirportLocation[] {
  return locations.map((location) => ({
    ...location,
    id: `${airportId}-${location.id}`,
    x: Math.max(6, Math.min(94, location.x + xOffset)),
    y: Math.max(10, Math.min(90, location.y + yOffset)),
    keywords: [...location.keywords, airportId]
  }));
}

export const pilotInformationPages: AirportInfoPage[] = [
  {
    id: "parking",
    title: "Parking",
    summary: "Garage, economy, and accessible parking options.",
    details: ["Accessible parking is closest to elevator banks.", "Economy shuttle service runs on a regular loop."]
  },
  {
    id: "ground-transportation",
    title: "Ground Transportation",
    summary: "Ride share, taxi, rental car, and shuttle pickup guidance.",
    details: ["Ride share pickup is marked curbside.", "Rental car counters connect from baggage claim."]
  },
  {
    id: "accessibility",
    title: "Accessibility Services",
    summary: "Step-free routes, assistance points, and quiet support spaces.",
    details: ["Contact the information desk for staff assistance.", "Accessible routes prefer elevators and wider corridors."]
  },
  {
    id: "security",
    title: "Security Information",
    summary: "Checkpoint guidance and traveler preparation reminders.",
    details: ["Keep ID ready before screening.", "International travelers should verify passport readiness."]
  },
  {
    id: "emergency",
    title: "Emergency Contacts",
    summary: "Airport safety and emergency support resources.",
    details: ["Use the security office for immediate airport safety help.", "Call local emergency services for urgent medical emergencies."]
  }
];
