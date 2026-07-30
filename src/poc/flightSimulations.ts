import type { CalculatedRoute, LandmarkVisualId, PreferenceId, TravelerProfileId } from "./types";

export type SimulatedAirlineId = "delta" | "american" | "united" | "southwest";
export type SimulatedFlightStatus = "On time" | "Boarding soon" | "Boarding" | "Delayed" | "Gate changed";
export type SecurityRouteType = "tsa-precheck" | "standard";

export type SimulatedFlight = {
  id: string;
  airlineId: SimulatedAirlineId;
  airlineName: string;
  flightNumber: string;
  destinationCity: string;
  boardingTime: string;
  status: SimulatedFlightStatus;
  gateId: string;
  gateLabel: string;
  checkInVisual: LandmarkVisualId;
  checkInCue: string;
  checkInInstruction: string;
  securityType: SecurityRouteType;
  securityWaitMinutes: number;
  profileId: TravelerProfileId;
  preferences: PreferenceId[];
  startId: string;
  routeNote: string;
  conditionTitle: string;
  conditionMessage: string;
};

export const simulatedFlights: SimulatedFlight[] = [
  {
    id: "delta-1842",
    airlineId: "delta",
    airlineName: "Delta Air Lines",
    flightNumber: "1842",
    destinationCity: "Atlanta",
    boardingTime: "3:05 PM",
    status: "Boarding soon",
    gateId: "gate-a12",
    gateLabel: "Gate A12",
    checkInVisual: "delta-check-in",
    checkInCue: "Look for the Delta Air Lines name above the simulated check in counter.",
    checkInInstruction: "Continue toward the Delta Air Lines check in area.",
    securityType: "tsa-precheck",
    securityWaitMinutes: 6,
    profileId: "sensory",
    preferences: ["simplifiedDirections", "reassurance", "quietStop", "tsaPreCheck"],
    startId: "main-entrance",
    routeNote: "This route uses clear landmark based directions and the simulated TSA PreCheck entrance.",
    conditionTitle: "Boarding soon",
    conditionMessage: "Demo flight information only. Beacon is not connected to live airline systems."
  },
  {
    id: "american-2231",
    airlineId: "american",
    airlineName: "American Airlines",
    flightNumber: "2231",
    destinationCity: "Charlotte",
    boardingTime: "3:20 PM",
    status: "Gate changed",
    gateId: "gate-b2",
    gateLabel: "Gate B6",
    checkInVisual: "american-check-in",
    checkInCue: "Look for the American Airlines name above the simulated check in counter.",
    checkInInstruction: "Continue toward the American Airlines check in area.",
    securityType: "standard",
    securityWaitMinutes: 11,
    profileId: "mobility",
    preferences: ["wheelchair", "avoidStairs", "additionalTime"],
    startId: "parking-garage",
    routeNote: "This step-free route prioritizes elevator-aware circulation and clear boarding guidance.",
    conditionTitle: "Your gate has changed",
    conditionMessage: "American Flight 2231 is now shown as Gate B6 in this simulated journey."
  },
  {
    id: "united-491",
    airlineId: "united",
    airlineName: "United Airlines",
    flightNumber: "491",
    destinationCity: "Chicago",
    boardingTime: "4:10 PM",
    status: "On time",
    gateId: "ground-transportation",
    gateLabel: "Ground Transportation",
    checkInVisual: "united-check-in",
    checkInCue: "Look for the United Airlines name above the simulated check in counter.",
    checkInInstruction: "Continue toward the United Airlines check in area.",
    securityType: "standard",
    securityWaitMinutes: 8,
    profileId: "standard",
    preferences: [],
    startId: "baggage-claim",
    routeNote: "This short arrival route guides you from baggage claim to ground transportation.",
    conditionTitle: "Short route",
    conditionMessage: "Ground transportation is a short walk from baggage claim in this simulation."
  },
  {
    id: "southwest-1176",
    airlineId: "southwest",
    airlineName: "Southwest Airlines",
    flightNumber: "1176",
    destinationCity: "Baltimore",
    boardingTime: "4:45 PM",
    status: "Delayed",
    gateId: "gate-a1",
    gateLabel: "Gate A1",
    checkInVisual: "southwest-check-in",
    checkInCue: "Look for the Southwest Airlines name above the simulated check in counter.",
    checkInInstruction: "Continue toward the Southwest Airlines check in area.",
    securityType: "standard",
    securityWaitMinutes: 10,
    profileId: "sensory",
    preferences: ["reducedStimulation", "avoidCrowds", "simplifiedDirections", "reassurance", "quietStop"],
    startId: "main-entrance",
    routeNote: "This route favors calmer areas and simple landmark instructions.",
    conditionTitle: "Flight delayed",
    conditionMessage: "Southwest Flight 1176 is delayed in this simulated journey."
  }
];

export function flightLabel(flight: SimulatedFlight | null): string | null {
  return flight ? `${flight.airlineName.replace(" Air Lines", "")} ${flight.flightNumber}` : null;
}

function gateVisualForFlight(flight: SimulatedFlight): LandmarkVisualId {
  if (flight.gateLabel === "Gate A12") {
    return "gate-a12-podium";
  }

  if (flight.gateLabel === "Gate A1") {
    return "gate-a1-podium";
  }

  if (flight.gateLabel === "Gate B6") {
    return "gate-b6-podium";
  }

  return "gate-area";
}

export function personalizeRouteForFlight(route: CalculatedRoute | null, flight: SimulatedFlight | null): CalculatedRoute | null {
  if (!route || !flight) {
    return route;
  }

  return {
    ...route,
    steps: route.steps.map((step) => {
      if (step.to === "ticket-counter") {
        return {
          ...step,
          instruction: flight.checkInInstruction,
          landmarkName: `${flight.airlineName} Check In`,
          recognitionCue: flight.checkInCue,
          visualId: flight.checkInVisual,
          visualAsset: flight.checkInVisual,
          directionOverlay: "straight" as const,
          visualPriority: "primary" as const,
          simulatedLabel: true,
          altText: `Fictional Beacon terminal with charcoal wall panels and warm lighting, showing the simulated ${flight.airlineName} check in counter beneath neutral text signage.`,
          accessibilityDescription: `The simulated ${flight.airlineName} check in area is straight ahead with a wide passenger approach path.`,
          accessibilityNote: "Demo airline information only. Beacon is not connected to live airline systems."
        };
      }

      if (step.to === "security-checkpoint" && flight.securityType === "tsa-precheck") {
        return {
          ...step,
          instruction: "Continue toward the TSA PreCheck entrance on the left.",
          landmarkName: "TSA PreCheck Entrance",
          recognitionCue: "Look for the TSA PreCheck text sign above the lanes on the left.",
          visualId: "tsa-precheck" as const,
          visualAsset: "tsa-precheck" as const,
          directionOverlay: "enter-left" as const,
          visualPriority: "primary" as const,
          simulatedLabel: true,
          altText: "Fictional Beacon terminal security area showing a simulated TSA PreCheck text sign above the left screening lanes with standard lanes nearby.",
          accessibilityDescription: "The simulated TSA PreCheck entrance is on the left with standard screening lanes to the right.",
          accessibilityNote: "Security lane availability and wait times are simulated."
        };
      }

      if (step.to === flight.gateId && flight.gateLabel.toLowerCase().includes("gate")) {
        return {
          ...step,
          landmarkName: flight.gateLabel,
          recognitionCue: `Look for the gate podium beneath the ${flight.gateLabel.replace("Gate ", "")} sign.`,
          visualId: gateVisualForFlight(flight),
          visualAsset: gateVisualForFlight(flight),
          directionOverlay: "arrive" as const,
          visualPriority: "primary" as const,
          simulatedLabel: true,
          altText: `Fictional Beacon terminal gate area showing ${flight.gateLabel} with a gate podium, boarding entrance, nearby seating, and overhead sign.`,
          accessibilityDescription: `The ${flight.gateLabel} podium is ahead with a clear step-free approach.`
        };
      }

      return step;
    })
  };
}
