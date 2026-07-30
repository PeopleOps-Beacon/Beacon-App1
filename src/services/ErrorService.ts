import { diagnostics } from "./diagnostics";

export type BeaconErrorArea =
  | "unexpected"
  | "network"
  | "routing"
  | "data"
  | "component"
  | "storage";

export type BeaconErrorRecord = {
  id: string;
  area: BeaconErrorArea;
  message: string;
  userMessage: string;
  timestamp: string;
  detail?: string;
};

const errorStorageKey = "beacon-error-log";

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function read(): BeaconErrorRecord[] {
  const raw = storage()?.getItem(errorStorageKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BeaconErrorRecord[];
  } catch {
    return [];
  }
}

function userMessageFor(area: BeaconErrorArea): string {
  const messages: Record<BeaconErrorArea, string> = {
    unexpected: "Beacon recovered from an unexpected issue and preserved the session.",
    network: "Network data is unavailable, so Beacon is using local pilot data.",
    routing: "Beacon could not calculate that route and is ready for another destination.",
    data: "Some airport data is missing, but the pilot dashboard remains available.",
    component: "A screen failed to render, so Beacon opened recovery mode.",
    storage: "Local preferences could not be saved on this device."
  };

  return messages[area];
}

export const ErrorService = {
  capture(error: unknown, area: BeaconErrorArea = "unexpected", detail?: string): BeaconErrorRecord {
    const message = error instanceof Error ? error.message : String(error);
    const record: BeaconErrorRecord = {
      id: "error-" + Date.now() + "-" + Math.round(Math.random() * 10000),
      area,
      message,
      userMessage: userMessageFor(area),
      timestamp: new Date().toISOString(),
      detail
    };
    const nextRecords = [record, ...read()].slice(0, 25);

    try {
      storage()?.setItem(errorStorageKey, JSON.stringify(nextRecords));
    } catch {
      diagnostics.log("warn", "Error log could not be persisted", { area, message: message.slice(0, 120) });
    }

    diagnostics.log(area === "storage" ? "warn" : "error", record.userMessage, {
      area,
      message: message.slice(0, 160)
    });

    return record;
  },
  list: read,
  clear() {
    storage()?.removeItem(errorStorageKey);
  },
  simulateNetworkFailure(): BeaconErrorRecord {
    return this.capture(new Error("Simulated airport data network timeout"), "network");
  },
  recoverableMessage(area: BeaconErrorArea): string {
    return userMessageFor(area);
  }
};
