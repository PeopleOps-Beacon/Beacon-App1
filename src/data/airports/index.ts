import { locations as gspLocations } from "../locations";
import type { AirportConfig } from "../../types";
import { allTravelerModes, cloneLocationsForAirport, pilotInformationPages } from "./shared";

const gspThemedLocations = cloneLocationsForAirport(gspLocations, "gsp", 0, 0);

export const airports: AirportConfig[] = [
  {
    id: "gsp",
    name: "Greenville-Spartanburg International Airport",
    iata: "GSP",
    city: "Greer",
    state: "SC",
    timezone: "America/New_York",
    logo: "GSP",
    theme: {
      primary: "#0f766e",
      accent: "#f5b72f",
      calm: "#d1fae5",
      contrast: "#061014"
    },
    terminals: [{ id: "A", name: "Terminal A", floors: [1, 2] }],
    map: {
      defaultTerminal: "A",
      defaultFloor: 2,
      viewBox: "0 0 100 100",
      floorLabels: { 1: "Arrivals", 2: "Departures" }
    },
    supportedTravelerModes: allTravelerModes,
    accessibilityResources: ["TSA Cares", "USO support", "Quiet room", "Step-free elevator route"],
    locations: gspThemedLocations,
    informationPages: pilotInformationPages
  },
  {
    id: "avl",
    name: "Asheville Regional Airport",
    iata: "AVL",
    city: "Asheville",
    state: "NC",
    timezone: "America/New_York",
    logo: "AVL",
    theme: {
      primary: "#2563eb",
      accent: "#fbbf24",
      calm: "#dbeafe",
      contrast: "#07111f"
    },
    terminals: [{ id: "A", name: "Main Terminal", floors: [1, 2] }],
    map: {
      defaultTerminal: "A",
      defaultFloor: 2,
      viewBox: "0 0 100 100",
      floorLabels: { 1: "Baggage", 2: "Ticketing and Gates" }
    },
    supportedTravelerModes: ["veteran", "sensory", "accessibility", "family", "business"],
    accessibilityResources: ["Hidden Disabilities Sunflower support", "Quiet seating", "Accessible curbside pickup"],
    locations: cloneLocationsForAirport(gspLocations, "avl", -3, 4),
    informationPages: pilotInformationPages
  },
  {
    id: "clt",
    name: "Charlotte Douglas International Airport",
    iata: "CLT",
    city: "Charlotte",
    state: "NC",
    timezone: "America/New_York",
    logo: "CLT",
    theme: {
      primary: "#1d4ed8",
      accent: "#67e8f9",
      calm: "#e0f2fe",
      contrast: "#071018"
    },
    terminals: [
      { id: "A", name: "Concourse A", floors: [1, 2] },
      { id: "B", name: "Concourse B", floors: [2] }
    ],
    map: {
      defaultTerminal: "A",
      defaultFloor: 2,
      viewBox: "0 0 100 100",
      floorLabels: { 1: "Arrivals", 2: "Concourses" }
    },
    supportedTravelerModes: allTravelerModes,
    accessibilityResources: ["Accessibility assistance", "Mother's room", "Pet relief area", "Interfaith chapel"],
    locations: cloneLocationsForAirport(gspLocations, "clt", 4, -2),
    informationPages: pilotInformationPages
  }
];

export const defaultAirport = airports[0];
