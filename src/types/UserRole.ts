export type UserRole =
  | "traveler"
  | "airport-operations"
  | "guest-services"
  | "accessibility-coordinator"
  | "airport-administrator"
  | "emergency-response"
  | "demo-mode";

export type RoleExperience = "traveler" | "operations" | "support" | "accessibility" | "admin" | "emergency" | "demo";

export const userRoles: UserRole[] = [
  "traveler",
  "airport-operations",
  "guest-services",
  "accessibility-coordinator",
  "airport-administrator",
  "emergency-response",
  "demo-mode"
];

export const userRoleLabels: Record<UserRole, string> = {
  traveler: "Traveler",
  "airport-operations": "Airport Operations",
  "guest-services": "Airport Guest Services",
  "accessibility-coordinator": "Airport Accessibility Coordinator",
  "airport-administrator": "Airport Administrator",
  "emergency-response": "Emergency Response",
  "demo-mode": "Demo Mode"
};

export const userRoleDescriptions: Record<UserRole, string> = {
  traveler: "Traveler navigation, recommendations, accessibility preferences, and trip support.",
  "airport-operations": "Operational command center for crowding, wait times, closures, incidents, and staff alerts.",
  "guest-services": "Guest assistance, service requests, customer support, and traveler-facing follow-up.",
  "accessibility-coordinator": "Accessibility requests, elevator status, accessible routes, restrooms, and assistance queues.",
  "airport-administrator": "Executive and administrative view across operations, alerts, services, and analytics.",
  "emergency-response": "High-priority incidents, emergency alerts, assigned response, and live disruption awareness.",
  "demo-mode": "Full simulated enterprise demo with live events and generated operational data."
};

export const roleExperienceMap: Record<UserRole, RoleExperience> = {
  traveler: "traveler",
  "airport-operations": "operations",
  "guest-services": "support",
  "accessibility-coordinator": "accessibility",
  "airport-administrator": "admin",
  "emergency-response": "emergency",
  "demo-mode": "demo"
};

export function isEnterpriseRole(role: UserRole): boolean {
  return role !== "traveler";
}

export function isDemoRole(role: UserRole): boolean {
  return role === "demo-mode";
}
