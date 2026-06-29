import type { LucideIcon } from "lucide-react";

export type TravelerModeId = "veteran" | "sensory" | "accessibility" | "family" | "business";

export type TravelerMode = {
  id: TravelerModeId;
  label: string;
  description: string;
  routeIntent: string;
  accent: string;
  icon: LucideIcon;
};

export type OperationsState = {
  crowding: number;
  noise: number;
  waitTime: number;
  support: number;
};
