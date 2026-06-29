import type { Route, SupportedLanguage, VoiceInstruction } from "../types";

export function createVoiceQueue(
  route: Route | null,
  language: SupportedLanguage,
  rate: number,
  volume: number
): VoiceInstruction[] {
  if (!route) {
    return [];
  }

  return route.steps.map((step) => ({
    id: `voice-${step.id}`,
    text: step.instruction,
    language,
    rate,
    volume
  }));
}
