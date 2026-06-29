import type { TravelerModeId } from "../types";

export function useModeClass(modeId: TravelerModeId): string {
  return `mode-${modeId}`;
}
