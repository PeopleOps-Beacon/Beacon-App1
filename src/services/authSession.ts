import type { UserProfile, UserRole } from "../types";

const localSessionKey = "beacon-user-session";
const browserSessionKey = "beacon-user-session-transient";
export const authSessionChangedEvent = "beacon-auth-session-changed";

export const userRoleLabels: Record<UserRole, string> = {
  traveler: "Traveler",
  "airport-admin": "Airport Administrator",
  "beacon-admin": "Beacon Administrator"
};

type StoredSession = {
  profile: UserProfile;
  remember: boolean;
  createdAt: string;
  lastActiveAt: string;
};

function getStorage(remember: boolean): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return remember ? window.localStorage : window.sessionStorage;
}

function readStorage(remember: boolean): StoredSession | null {
  const storage = getStorage(remember);

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(remember ? localSessionKey : browserSessionKey);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function emitSessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(authSessionChangedEvent));
  }
}

function writeStorage(session: StoredSession) {
  const storage = getStorage(session.remember);

  if (!storage) {
    return;
  }

  storage.setItem(session.remember ? localSessionKey : browserSessionKey, JSON.stringify(session));
}

export function createPilotProfile(email: string, role: UserRole): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();
  const displayName = normalizedEmail.split("@")[0]?.replace(/[._-]/g, " ") || "Beacon user";

  return {
    id: `pilot-${normalizedEmail}`,
    email: normalizedEmail,
    displayName,
    role,
    provider: "pilot",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function readPilotSession(): StoredSession | null {
  const remembered = readStorage(true);
  const transient = readStorage(false);

  if (!remembered) {
    return transient;
  }

  if (!transient) {
    return remembered;
  }

  return remembered.lastActiveAt >= transient.lastActiveAt ? remembered : transient;
}

export function savePilotSession(profile: UserProfile, remember: boolean): StoredSession {
  const timestamp = new Date().toISOString();
  const current = readPilotSession();
  const session: StoredSession = {
    profile: { ...profile, updatedAt: timestamp },
    remember,
    createdAt: current?.createdAt ?? timestamp,
    lastActiveAt: timestamp
  };

  clearPilotSession();
  writeStorage(session);
  emitSessionChanged();

  return session;
}

export function updatePilotProfile(
  profile: UserProfile,
  updates: Pick<UserProfile, "displayName" | "role">,
  remember: boolean
): StoredSession {
  return savePilotSession(
    {
      ...profile,
      displayName: updates.displayName.trim() || profile.displayName,
      role: updates.role
    },
    remember
  );
}

export function clearPilotSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(localSessionKey);
  window.sessionStorage.removeItem(browserSessionKey);
  emitSessionChanged();
}
