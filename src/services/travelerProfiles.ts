import type { RoutePreference, TravelerModeId, TravelerProfile, UserPreferences } from "../types";

export const travelerProfiles: Record<TravelerModeId, TravelerProfile> = {
  veteran: {
    id: "veteran",
    label: "Veteran PTSD",
    preferences: {
      avoidCrowds: true,
      avoidNoise: true,
      preferQuietRoutes: true,
      frequentBreaks: true
    }
  },
  accessibility: {
    id: "accessibility",
    label: "Wheelchair",
    preferences: {
      avoidStairs: true,
      preferElevators: true,
      accessibleOnly: true
    }
  },
  family: {
    id: "family",
    label: "Family",
    preferences: {
      strollerFriendly: true,
      restroomPriority: true,
      foodPriority: true
    }
  },
  business: {
    id: "business",
    label: "Business Traveler",
    preferences: {
      fastestRoute: true,
      coffeeStops: true,
      gateAlerts: true
    }
  },
  sensory: {
    id: "sensory",
    label: "Sensory Sensitive",
    preferences: {
      lowStimulus: true,
      avoidAnnouncements: true,
      quietWaitingAreas: true
    }
  },
  international: {
    id: "international",
    label: "International",
    preferences: {
      fastestRoute: true,
      gateAlerts: true
    }
  }
};

export function getTravelerProfile(modeId: TravelerModeId, preferences?: UserPreferences): TravelerProfile {
  const base = travelerProfiles[modeId];

  return {
    ...base,
    preferences: {
      ...base.preferences,
      avoidCrowds: preferences?.avoidCrowds || base.preferences.avoidCrowds,
      avoidNoise: preferences?.avoidNoise || base.preferences.avoidNoise,
      accessibleOnly: preferences?.preferAccessibleRoutes || base.preferences.accessibleOnly,
      preferQuietRoutes: preferences?.avoidCrowds || preferences?.avoidNoise || base.preferences.preferQuietRoutes,
      fastestRoute: preferences?.reduceWalkingDistance ? false : base.preferences.fastestRoute
    }
  };
}

export function getRoutePreferenceForProfile(profile: TravelerProfile, preferences?: UserPreferences): RoutePreference {
  if (profile.preferences.accessibleOnly || profile.preferences.avoidStairs || preferences?.preferAccessibleRoutes) {
    return "accessible";
  }

  if (profile.preferences.lowStimulus || profile.preferences.preferQuietRoutes || preferences?.avoidNoise) {
    return "quietest";
  }

  if (profile.preferences.strollerFriendly || profile.preferences.restroomPriority || profile.preferences.foodPriority) {
    return "family";
  }

  if (preferences?.reduceWalkingDistance) {
    return "least-walking";
  }

  return profile.preferences.fastestRoute ? "fastest" : preferences?.preferredRouteType ?? "fastest";
}
