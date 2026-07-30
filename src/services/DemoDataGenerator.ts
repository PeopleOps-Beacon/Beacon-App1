import type { AirportConfig, SmartNotificationSeverity } from "../types";

export type CrowdLevel = "low" | "medium" | "high" | "critical";
export type IncidentType = "Medical" | "Security" | "Maintenance" | "Accessibility" | "Guest Assistance" | "Construction" | "Weather";
export type IncidentStatus = "open" | "assigned" | "monitoring" | "resolved";
export type TaskStatus = "queued" | "assigned" | "in-progress" | "complete";
export type TaskType = "Escort Traveler" | "Accessibility Assistance" | "Maintenance Request" | "Cleaning Request" | "Customer Assistance" | "Security Response";

export type DemoTraveler = {
  id: string;
  profile: string;
  destinationId: string;
  status: "planning" | "navigating" | "waiting" | "arrived";
};

export type StaffMember = {
  id: string;
  name: string;
  team: string;
  status: "available" | "assigned" | "break";
};

export type CrowdZone = {
  id: string;
  name: string;
  locationId: string;
  level: CrowdLevel;
  occupancy: number;
};

export type OperationsIncident = {
  id: string;
  type: IncidentType;
  priority: SmartNotificationSeverity;
  status: IncidentStatus;
  location: string;
  time: string;
  assignedTeam: string;
  resolutionNotes: string;
};

export type StaffTask = {
  id: string;
  type: TaskType;
  priority: SmartNotificationSeverity;
  assigned: string;
  status: TaskStatus;
  etaMinutes: number;
  location: string;
};

export type TimelineCategory = "alert" | "recommendation" | "gate-change" | "crowd" | "system" | "incident";

export type TimelineEvent = {
  id: string;
  title: string;
  body: string;
  category: TimelineCategory;
  priority: SmartNotificationSeverity;
  timestamp: string;
};

export type ChartDatum = {
  label: string;
  value: number;
};

export type DemoAnalytics = {
  dailyTravelers: ChartDatum[];
  popularDestinations: ChartDatum[];
  mostRequestedServices: ChartDatum[];
  accessibilityRequests: ChartDatum[];
  averageWalkingTime: ChartDatum[];
  navigationSuccessRate: ChartDatum[];
  notificationEngagement: ChartDatum[];
  favoriteLocations: ChartDatum[];
};

export type AccessibilityMetrics = {
  elevatorsAvailable: number;
  accessibleRestrooms: number;
  wheelchairAssistanceRequests: number;
  accessibleRoutes: number;
  temporaryClosures: number;
};

export type OperationsMetrics = {
  currentTravelers: number;
  averageWaitTime: number;
  crowdDensity: number;
  accessibilityRequests: number;
  notifications: number;
  incidents: number;
  constructionZones: number;
  closedAreas: number;
  staffAlerts: number;
};

export type DemoData = {
  travelers: DemoTraveler[];
  staff: StaffMember[];
  notifications: TimelineEvent[];
  incidents: OperationsIncident[];
  destinations: string[];
  crowdZones: CrowdZone[];
  analytics: DemoAnalytics;
  accessibility: AccessibilityMetrics;
  tasks: StaffTask[];
  metrics: OperationsMetrics;
};

const profiles = ["Veteran PTSD", "Wheelchair", "Family", "Business", "Sensory Sensitive", "International"];
const teams = ["Guest Services", "Accessibility", "Facilities", "Security", "Operations", "Emergency Response"];
const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn"];
const incidentTypes: IncidentType[] = ["Medical", "Security", "Maintenance", "Accessibility", "Guest Assistance", "Construction", "Weather"];
const taskTypes: TaskType[] = ["Escort Traveler", "Accessibility Assistance", "Maintenance Request", "Cleaning Request", "Customer Assistance", "Security Response"];
const priorities: SmartNotificationSeverity[] = ["low", "medium", "high", "critical"];
const statuses: IncidentStatus[] = ["open", "assigned", "monitoring", "resolved"];
const taskStatuses: TaskStatus[] = ["queued", "assigned", "in-progress", "complete"];

function priorityForIndex(index: number): SmartNotificationSeverity {
  return priorities[index % priorities.length];
}

function levelFromOccupancy(occupancy: number): CrowdLevel {
  if (occupancy >= 88) return "critical";
  if (occupancy >= 68) return "high";
  if (occupancy >= 38) return "medium";
  return "low";
}

function timestampMinutesAgo(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

function chart(labels: string[], base: number, step: number): ChartDatum[] {
  return labels.map((label, index) => ({ label, value: base + index * step + (index % 2 === 0 ? 12 : -5) }));
}

export const DemoDataGenerator = {
  generate(airport: AirportConfig): DemoData {
    const locationIds = airport.locations.map((location) => location.id);
    const locationNames = airport.locations.map((location) => location.name);
    const travelers: DemoTraveler[] = Array.from({ length: 500 }, (_, index) => ({
      id: "traveler-" + index,
      profile: profiles[index % profiles.length],
      destinationId: locationIds[index % locationIds.length],
      status: ["planning", "navigating", "waiting", "arrived"][index % 4] as DemoTraveler["status"]
    }));
    const staff: StaffMember[] = Array.from({ length: 50 }, (_, index) => ({
      id: "staff-" + index,
      name: firstNames[index % firstNames.length] + " " + (100 + index),
      team: teams[index % teams.length],
      status: ["available", "assigned", "break"][index % 3] as StaffMember["status"]
    }));
    const notifications: TimelineEvent[] = Array.from({ length: 100 }, (_, index) => ({
      id: "notification-" + index,
      title: ["Gate change", "Quiet route available", "Crowd threshold reached", "System health", "Accessibility update"][index % 5],
      body: "Demo update for " + airport.iata + " operations team.",
      category: ["gate-change", "recommendation", "crowd", "system", "alert"][index % 5] as TimelineCategory,
      priority: priorityForIndex(index),
      timestamp: timestampMinutesAgo(index * 3)
    }));
    const incidents: OperationsIncident[] = Array.from({ length: 25 }, (_, index) => ({
      id: "incident-" + index,
      type: incidentTypes[index % incidentTypes.length],
      priority: priorityForIndex(index + 1),
      status: statuses[index % statuses.length],
      location: locationNames[index % locationNames.length],
      time: timestampMinutesAgo(index * 9),
      assignedTeam: teams[index % teams.length],
      resolutionNotes: index % 4 === 0 ? "Awaiting field confirmation." : "Team assigned and monitoring."
    }));
    const destinations = Array.from({ length: 100 }, (_, index) => locationNames[index % locationNames.length] + " demo " + (index + 1));
    const crowdZones: CrowdZone[] = airport.locations.slice(0, 10).map((location, index) => {
      const occupancy = Math.min(100, 22 + index * 8 + (index % 3) * 7);
      return {
        id: "zone-" + location.id,
        name: location.name,
        locationId: location.id,
        level: levelFromOccupancy(occupancy),
        occupancy
      };
    });
    const tasks: StaffTask[] = Array.from({ length: 18 }, (_, index) => ({
      id: "task-" + index,
      type: taskTypes[index % taskTypes.length],
      priority: priorityForIndex(index + 2),
      assigned: staff[index % staff.length].name,
      status: taskStatuses[index % taskStatuses.length],
      etaMinutes: 4 + (index % 6) * 3,
      location: locationNames[index % locationNames.length]
    }));
    const accessibility: AccessibilityMetrics = {
      elevatorsAvailable: Math.max(1, airport.locations.filter((location) => location.keywords.join(" ").toLowerCase().includes("elevator")).length),
      accessibleRestrooms: airport.locations.filter((location) => location.category === "restroom" && location.accessibilityFeatures.includes("wheelchair-accessible")).length,
      wheelchairAssistanceRequests: travelers.filter((traveler) => traveler.profile === "Wheelchair").length,
      accessibleRoutes: airport.locations.filter((location) => location.accessibilityFeatures.includes("step-free")).length,
      temporaryClosures: incidents.filter((incident) => incident.type === "Maintenance" || incident.type === "Construction").length
    };
    const analytics: DemoAnalytics = {
      dailyTravelers: chart(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 420, 28),
      popularDestinations: chart(locationNames.slice(0, 6), 80, 14),
      mostRequestedServices: chart(["Wheelchair", "Restroom", "Escort", "Dining", "Quiet Room"], 34, 11),
      accessibilityRequests: chart(["Mobility", "Sensory", "Vision", "Hearing", "Family"], 18, 8),
      averageWalkingTime: chart(["Fastest", "Accessible", "Quiet", "Family"], 7, 2),
      navigationSuccessRate: chart(["Started", "On route", "Arrived", "Rated"], 72, 6),
      notificationEngagement: chart(["Sent", "Opened", "Acted", "Dismissed"], 44, 9),
      favoriteLocations: chart(locationNames.slice(0, 5), 22, 7)
    };
    const metrics: OperationsMetrics = {
      currentTravelers: travelers.filter((traveler) => traveler.status !== "arrived").length,
      averageWaitTime: 18,
      crowdDensity: Math.round(crowdZones.reduce((sum, zone) => sum + zone.occupancy, 0) / crowdZones.length),
      accessibilityRequests: accessibility.wheelchairAssistanceRequests,
      notifications: notifications.length,
      incidents: incidents.filter((incident) => incident.status !== "resolved").length,
      constructionZones: incidents.filter((incident) => incident.type === "Construction").length,
      closedAreas: incidents.filter((incident) => incident.type === "Maintenance").length,
      staffAlerts: tasks.filter((task) => task.priority === "high" || task.priority === "critical").length
    };

    return { travelers, staff, notifications, incidents, destinations, crowdZones, analytics, accessibility, tasks, metrics };
  },
  levelFromOccupancy
};
