export type HapticIntent = "light" | "success" | "warning";

const hapticPattern: Record<HapticIntent, number | number[]> = {
  light: 12,
  success: [18, 24, 18],
  warning: [28, 36, 28]
};

export function triggerHaptic(intent: HapticIntent = "light") {
  if (typeof window === "undefined") {
    return;
  }

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  try {
    navigator.vibrate?.(hapticPattern[intent]);
  } catch {
    // Haptics are optional and device-dependent.
  }
}
