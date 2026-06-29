import {
  Accessibility,
  Baby,
  BriefcaseBusiness,
  EarOff,
  Languages,
  Shield
} from "lucide-react";
import type { TravelerMode } from "../types";

export const travelerModes: TravelerMode[] = [
  {
    id: "veteran",
    label: "Veteran PTSD",
    description: "Quieter checkpoints, low-density paths, and support zones kept visible.",
    routeIntent: "Calm route prioritized",
    accent: "#6ee7b7",
    icon: Shield
  },
  {
    id: "sensory",
    label: "Sensory",
    description: "Lower noise exposure, predictable transitions, and decompression stops.",
    routeIntent: "Noise reduced",
    accent: "#93c5fd",
    icon: EarOff
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "Step-free movement with elevator availability and shorter transfer gaps.",
    routeIntent: "Step-free route",
    accent: "#fbbf24",
    icon: Accessibility
  },
  {
    id: "family",
    label: "Family",
    description: "Family services, extra time buffers, and fewer gate-change surprises.",
    routeIntent: "Family support nearby",
    accent: "#f0abfc",
    icon: Baby
  },
  {
    id: "business",
    label: "Business",
    description: "Fastest viable route with lounge, work zone, and boarding risk awareness.",
    routeIntent: "Fast transfer",
    accent: "#67e8f9",
    icon: BriefcaseBusiness
  },
  {
    id: "international",
    label: "International",
    description: "Customs reminders, passport-ready prompts, and clear transfer sequencing.",
    routeIntent: "Customs-aware route",
    accent: "#c4b5fd",
    icon: Languages
  }
];
