import type {
  AirportLocation,
  CalculatedRoute,
  LandmarkType,
  LandmarkVisualId,
  LocationType,
  RouteConnection,
  RouteManeuver,
  RouteStep,
  VisualDirectionOverlay,
  VisualPriority
} from "./types";
import gspAviatorBoyImage from "../assets/gsp/landmarks/gsp-aviator-boy-media.webp";
import simulatedAccessibleRestroomImage from "../assets/simulated/simulated-accessible-restroom.webp";
import simulatedAirportAssistanceDeskImage from "../assets/simulated/simulated-airport-assistance-desk.webp";
import simulatedAmericanCheckInImage from "../assets/simulated/simulated-american-check-in.webp";
import simulatedBaggageClaimImage from "../assets/simulated/simulated-baggage-claim.webp";
import simulatedCoffeeShopImage from "../assets/simulated/simulated-coffee-shop.webp";
import simulatedConcourseBEntranceImage from "../assets/simulated/simulated-concourse-b-entrance.webp";
import simulatedConcourseSplitImage from "../assets/simulated/simulated-concourse-split.webp";
import simulatedDeltaCheckInImage from "../assets/simulated/simulated-delta-check-in.webp";
import simulatedElevatorImage from "../assets/simulated/simulated-elevator.webp";
import simulatedElevatorLeftImage from "../assets/simulated/simulated-elevator-left.webp";
import simulatedElevatorRightImage from "../assets/simulated/simulated-elevator-right.webp";
import simulatedEscalatorImage from "../assets/simulated/simulated-escalator.webp";
import simulatedFamilyRestroomImage from "../assets/simulated/simulated-family-restroom.webp";
import simulatedGateSeatingRouteImage from "../assets/simulated/simulated-gate-seating-route.webp";
import simulatedGatePodiumImage from "../assets/simulated/simulated-gate-podium.webp";
import simulatedConcourseAEntranceImage from "../assets/simulated/simulated-concourse-a-entrance.webp";
import simulatedGroundTransportationExitImage from "../assets/simulated/simulated-ground-transportation-exit.webp";
import simulatedInformationDeskRightTurnImage from "../assets/simulated/simulated-information-desk-right-turn.webp";
import simulatedMainEntranceCloseImage from "../assets/simulated/simulated-main-entrance-close.webp";
import simulatedMainEntranceTicketingCheckInImage from "../assets/simulated/simulated-main-entrance-ticketing-check-in.webp";
import simulatedParkingConnectionImage from "../assets/simulated/simulated-parking-connection.webp";
import simulatedQuietSpaceImage from "../assets/simulated/simulated-quiet-space.webp";
import simulatedRentalCarAreaImage from "../assets/simulated/simulated-rental-car-area.webp";
import simulatedRestroomImage from "../assets/simulated/simulated-restroom.webp";
import simulatedSecurityCheckpointImage from "../assets/simulated/simulated-security-checkpoint.webp";
import simulatedSecurityConcourseExitImage from "../assets/simulated/simulated-security-concourse-exit.webp";
import simulatedSecurityStandardImage from "../assets/simulated/simulated-security-standard.webp";
import simulatedServiceAnimalReliefImage from "../assets/simulated/simulated-service-animal-relief.webp";
import simulatedSouthwestCheckInImage from "../assets/simulated/simulated-southwest-check-in.webp";
import simulatedTicketCounterImage from "../assets/simulated/simulated-ticket-counter.webp";
import simulatedTsaPrecheckImage from "../assets/simulated/simulated-tsa-precheck.webp";
import simulatedUnitedCheckInImage from "../assets/simulated/simulated-united-check-in.webp";
import { imageRightsRegistry, type ImagePermissionStatus } from "./gspImageRights";

export type LandmarkSceneKind =
  | "entrance"
  | "check-in"
  | "ticketing"
  | "security"
  | "tsa-precheck"
  | "information"
  | "elevator"
  | "escalator"
  | "restroom"
  | "quiet"
  | "concourse"
  | "coffee"
  | "gate"
  | "baggage"
  | "ground"
  | "parking"
  | "assistance"
  | "service-animal"
  | "rental-car";

export type LandmarkSceneSpec = {
  kind: LandmarkSceneKind;
  signText: string;
  subjectLabel?: string;
  supportingLabel?: string;
  gateNumber?: string;
  side?: "left" | "center" | "right";
  depth?: "near" | "mid" | "far";
};

export type LandmarkActualOrSimulated = "actual" | "simulated";

export type LandmarkAssetStatus = "gsp-supplied" | "simulated-approved" | "review-needed";

export type LandmarkOverlayPosition = "top-left" | "top-center" | "top-right" | "middle-left" | "middle-right";

export type LandmarkReviewCheckStatus = "pass" | "review";

export type LandmarkReviewCheck = {
  label: string;
  status: LandmarkReviewCheckStatus;
  note: string;
};

export type LandmarkVisualSpec = {
  id: LandmarkVisualId;
  source: string;
  airport: "GSP";
  location: string;
  actualOrSimulated: LandmarkActualOrSimulated;
  permissionStatus: ImagePermissionStatus;
  rightsRecordId: string;
  title: string;
  landmarkType: LandmarkType;
  approachDirection: string;
  directionVariation: string;
  altText: string;
  recognitionCue: string;
  accessibilityDescription: string;
  focalPoint: { x: number; y: number };
  dateVerified: string;
  lastReviewed: string;
  authenticityLabel: "GSP location preview" | "Simulated visual";
  simulatedLabel: boolean;
  visualPriority: VisualPriority;
  defaultOverlay: VisualDirectionOverlay;
  scene: LandmarkSceneSpec;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  assetStatus: LandmarkAssetStatus;
  assetStatusLabel: string;
  overlayLabel: string;
  overlayPosition: LandmarkOverlayPosition;
  reviewChecks: LandmarkReviewCheck[];
};

const terminalStyle =
  "Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent.";

const visualAssetResolution = {
  width: 1448,
  height: 1086
};

const simulatedAssetChecks: LandmarkReviewCheck[] = [
  { label: "Recognizable in one second", status: "pass", note: "Single dominant landmark fills the frame." },
  { label: "One focal point", status: "pass", note: "Supporting details stay secondary." },
  { label: "Quiet background", status: "pass", note: "No crowd or competing retail activity." },
  { label: "Direction is clear", status: "pass", note: "Native overlay handles the travel cue." },
  { label: "Matches instruction", status: "pass", note: "Landmark and recognition cue describe the same subject." },
  { label: "Readable signage", status: "pass", note: "Critical text is rendered by the app, not baked into the image." },
  { label: "Clearly labeled", status: "pass", note: "Presented as a simulated visual, not as a GSP photograph." },
  { label: "Clear on a phone", status: "pass", note: "4:3 optimized preview remains legible at active journey size." }
];

const actualGspChecks: LandmarkReviewCheck[] = [
  { label: "Official GSP source", status: "pass", note: "Image comes from the official downloadable GSP media asset page." },
  { label: "Rights record present", status: "pass", note: "The local asset is backed by the central image rights registry." },
  { label: "Actual preview label", status: "pass", note: "Presented as a GSP location preview only for confirmed GSP imagery." },
  { label: "One focal point", status: "pass", note: "The landmark remains visually dominant in the 4:3 crop." },
  { label: "Privacy reviewed", status: "pass", note: "No close identifiable passenger faces or travel documents are visible." },
  { label: "Security reviewed", status: "pass", note: "The image avoids sensitive security systems and restricted operational detail." },
  { label: "Nondestructive overlay", status: "pass", note: "Beacon route cues are applied by the app, not baked into the photo." },
  { label: "Clear on a phone", status: "pass", note: "4:3 optimized preview remains legible at active journey size." }
];

function fallbackReviewChecks(title: string): LandmarkReviewCheck[] {
  return [
    { label: "Recognizable in one second", status: "review", note: `${title} needs a local approved or simulated raster preview.` },
    { label: "One focal point", status: "review", note: "Fallback is reserved for unexpected runtime asset failures." },
    { label: "Quiet background", status: "review", note: "Review after the final environmental asset is connected." },
    { label: "Direction is clear", status: "review", note: "Native route cue remains available for fallback mode." },
    { label: "Matches instruction", status: "review", note: "Confirm against the local visual asset before approval." },
    { label: "Readable signage", status: "review", note: "Use app-rendered text overlays for any critical label." },
    { label: "Rights record present", status: "review", note: "A registry record must exist before presentation use." },
    { label: "Clear on a phone", status: "review", note: "Validate at active journey mobile size after connection." }
  ];
}

type LandmarkVisualInput = Omit<
  LandmarkVisualSpec,
  | "assetStatus"
  | "assetStatusLabel"
  | "source"
  | "airport"
  | "location"
  | "actualOrSimulated"
  | "permissionStatus"
  | "rightsRecordId"
  | "approachDirection"
  | "focalPoint"
  | "dateVerified"
  | "lastReviewed"
  | "authenticityLabel"
  | "overlayLabel"
  | "overlayPosition"
  | "reviewChecks"
  | "imageSrc"
  | "imageWidth"
  | "imageHeight"
> &
  Partial<
    Pick<
      LandmarkVisualSpec,
      | "assetStatus"
      | "assetStatusLabel"
      | "source"
      | "airport"
      | "location"
      | "actualOrSimulated"
      | "permissionStatus"
      | "rightsRecordId"
      | "approachDirection"
      | "focalPoint"
      | "dateVerified"
      | "lastReviewed"
      | "authenticityLabel"
      | "overlayLabel"
      | "overlayPosition"
      | "reviewChecks"
      | "imageSrc"
      | "imageWidth"
      | "imageHeight"
    >
  >;

const reviewedOn = "2026-07-15";

function defaultSimulatedRightsRecordId(id: LandmarkVisualId): string {
  const sharedGateIds: LandmarkVisualId[] = ["gate-area", "gate-a1-podium", "gate-a12-podium", "gate-b6-podium", "gate-seating"];

  if (sharedGateIds.includes(id)) {
    return "SIM-GATE-PODIUM";
  }

  return `SIM-${id.toUpperCase()}`;
}

function visual(spec: LandmarkVisualInput): LandmarkVisualSpec {
  const actualOrSimulated = spec.actualOrSimulated ?? "simulated";
  const hasLocalAsset = Boolean(spec.imageSrc);
  const rightsRecordId =
    spec.rightsRecordId ?? (actualOrSimulated === "simulated" ? defaultSimulatedRightsRecordId(spec.id) : "");
  const rightsRecord = rightsRecordId ? imageRightsRegistry[rightsRecordId] : undefined;
  const permissionStatus =
    spec.permissionStatus ?? rightsRecord?.permissionStatus ?? (actualOrSimulated === "actual" ? "Pending Permission" : "Approved");
  const assetStatus =
    spec.assetStatus ??
    (hasLocalAsset
      ? actualOrSimulated === "actual"
        ? "gsp-supplied"
        : "simulated-approved"
      : "review-needed");
  const authenticityLabel =
    spec.authenticityLabel ?? (actualOrSimulated === "actual" ? "GSP location preview" : "Simulated visual");

  return {
    ...spec,
    source: spec.source ?? spec.imageSrc ?? "",
    airport: spec.airport ?? "GSP",
    location: spec.location ?? spec.title,
    actualOrSimulated,
    permissionStatus,
    rightsRecordId,
    approachDirection: spec.approachDirection ?? spec.directionVariation,
    focalPoint: spec.focalPoint ?? { x: 0.5, y: 0.5 },
    dateVerified: spec.dateVerified ?? reviewedOn,
    lastReviewed: spec.lastReviewed ?? reviewedOn,
    authenticityLabel,
    simulatedLabel: actualOrSimulated === "simulated",
    assetStatus,
    assetStatusLabel:
      spec.assetStatusLabel ??
      (assetStatus === "gsp-supplied"
        ? "Official GSP media asset"
        : assetStatus === "simulated-approved"
          ? "Approved simulated visual"
          : "Review required"),
    overlayLabel: spec.overlayLabel ?? spec.title,
    overlayPosition: spec.overlayPosition ?? "top-center",
    reviewChecks:
      spec.reviewChecks ??
      (hasLocalAsset
        ? actualOrSimulated === "actual"
          ? actualGspChecks
          : simulatedAssetChecks
        : fallbackReviewChecks(spec.title)),
    imageWidth: spec.imageWidth ?? (hasLocalAsset ? visualAssetResolution.width : undefined),
    imageHeight: spec.imageHeight ?? (hasLocalAsset ? visualAssetResolution.height : undefined)
  };
}

export const landmarkVisualLibrary: Record<LandmarkVisualId, LandmarkVisualSpec> = {
  "main-entrance": visual({
    id: "main-entrance",
    title: "Main Entrance",
    landmarkType: "entrance",
    directionVariation: "approach from front",
    rightsRecordId: "SIM-MAIN-ENTRANCE-CLOSE",
    location: "Simulated terminal main entrance",
    altText: `${terminalStyle} Close traveler-level exterior view of main glass entrance doors beneath a covered terminal canopy with a clear walking approach.`,
    recognitionCue: "Look for the main glass entrance beneath the terminal sign.",
    accessibilityDescription: "The simulated terminal entrance preview shows the covered glass doors straight ahead with a step-free approach from the curb.",
    simulatedLabel: false,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "entrance", signText: "MAIN ENTRANCE", subjectLabel: "Glass entrance doors", side: "center", depth: "near" },
    imageSrc: simulatedMainEntranceCloseImage,
    focalPoint: { x: 0.5, y: 0.52 },
    overlayLabel: "Main Entrance",
    overlayPosition: "top-center"
  }),
  "main-entrance-ticketing": visual({
    id: "main-entrance-ticketing",
    title: "Main Entrance to Ticketing",
    landmarkType: "entrance",
    directionVariation: "continue straight toward ticketing",
    rightsRecordId: "SIM-MAIN-ENTRANCE-TICKETING-CHECK-IN",
    altText: `${terminalStyle} Check in counters straight ahead with queue stanchions and a blank overhead sign panel for the route label.`,
    recognitionCue: "Continue toward the check in counters beneath the Check In sign.",
    accessibilityDescription: "The simulated check in lobby preview shows a step-free path into queue lanes and staffed counter positions.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "check-in", signText: "CHECK IN", subjectLabel: "Check in counters", side: "center", depth: "mid" },
    imageSrc: simulatedMainEntranceTicketingCheckInImage,
    overlayLabel: "CHECK IN"
  }),
  "ticket-counter": visual({
    id: "ticket-counter",
    title: "Ticketing Area",
    landmarkType: "ticketing",
    directionVariation: "approach from front",
    altText: `${terminalStyle} General airline ticket counters with bag drop lanes and overhead Ticketing sign.`,
    recognitionCue: "Look for the long counter row beneath the Ticketing sign.",
    accessibilityDescription: "The counter area has open queue lanes and a step-free approach path.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "ticketing", signText: "TICKETING", subjectLabel: "Bag drop counters", side: "center", depth: "mid" },
    imageSrc: simulatedTicketCounterImage
  }),
  "delta-check-in": visual({
    id: "delta-check-in",
    title: "Delta Air Lines Check In",
    landmarkType: "ticketing",
    directionVariation: "approach from front",
    altText: `${terminalStyle} Simulated Delta Air Lines check in area with text signage, counters, and a clear passenger approach path.`,
    recognitionCue: "Look for the Delta Air Lines name above the simulated check in counter.",
    accessibilityDescription: "The check in counters sit straight ahead with a wide open approach lane.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "check-in", signText: "DELTA AIR LINES", subjectLabel: "Check in counters", side: "center", depth: "mid" },
    imageSrc: simulatedDeltaCheckInImage,
    overlayLabel: "Delta Air Lines",
    overlayPosition: "top-center"
  }),
  "american-check-in": visual({
    id: "american-check-in",
    title: "American Airlines Check In",
    landmarkType: "ticketing",
    directionVariation: "approach from parking side",
    altText: `${terminalStyle} Simulated American Airlines check in area with text signage, accessible queue lanes, and counters.`,
    recognitionCue: "Look for the American Airlines name above the simulated check in counter.",
    accessibilityDescription: "The check in counter is reached by a step-free approach lane with open turning space.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "check-in", signText: "AMERICAN AIRLINES", subjectLabel: "Accessible queue", side: "center", depth: "mid" },
    imageSrc: simulatedAmericanCheckInImage
  }),
  "united-check-in": visual({
    id: "united-check-in",
    title: "United Airlines Check In",
    landmarkType: "ticketing",
    directionVariation: "approach from arrivals side",
    altText: `${terminalStyle} Simulated United Airlines check in area with text signage and kiosks beside the counter.`,
    recognitionCue: "Look for the United Airlines name above the simulated check in counter.",
    accessibilityDescription: "The counter row is straight ahead with kiosks off to the right of the path.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "check-in", signText: "UNITED AIRLINES", subjectLabel: "Kiosks and counter", side: "center", depth: "mid" },
    imageSrc: simulatedUnitedCheckInImage
  }),
  "southwest-check-in": visual({
    id: "southwest-check-in",
    title: "Southwest Airlines Check In",
    landmarkType: "ticketing",
    directionVariation: "approach from main lobby",
    altText: `${terminalStyle} Simulated Southwest Airlines check in area with text signage and bag drop counters.`,
    recognitionCue: "Look for the Southwest Airlines name above the simulated check in counter.",
    accessibilityDescription: "The bag drop counter is centered with a clear straight approach path.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "check-in", signText: "SOUTHWEST AIRLINES", subjectLabel: "Bag drop", side: "center", depth: "mid" },
    imageSrc: simulatedSouthwestCheckInImage
  }),
  "security-checkpoint": visual({
    id: "security-checkpoint",
    title: "Security Checkpoint",
    landmarkType: "security",
    directionVariation: "straight ahead",
    altText: `${terminalStyle} Standard security entrance straight ahead with lane dividers and screening arches.`,
    recognitionCue: "Look for the Security sign and the lane dividers ahead.",
    accessibilityDescription: "The standard security entrance is straight ahead with open lane dividers.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "security", signText: "SECURITY", subjectLabel: "Screening lanes", side: "center", depth: "mid" },
    imageSrc: simulatedSecurityCheckpointImage
  }),
  "security-standard": visual({
    id: "security-standard",
    title: "Standard Security",
    landmarkType: "security",
    directionVariation: "standard lanes straight ahead",
    altText: `${terminalStyle} Standard screening lanes with a Security sign and low lane dividers.`,
    recognitionCue: "Use the standard screening lanes under the Security sign.",
    accessibilityDescription: "The security approach is step-free with a visible staff lane beside the dividers.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "security", signText: "STANDARD SECURITY", subjectLabel: "Standard lanes", side: "center", depth: "mid" },
    imageSrc: simulatedSecurityStandardImage
  }),
  "security-exit": visual({
    id: "security-exit",
    title: "Security Exit",
    landmarkType: "security",
    directionVariation: "exit toward concourse",
    rightsRecordId: "SIM-SECURITY-CONCOURSE-EXIT",
    altText: `${terminalStyle} Open post-security corridor leading forward into the concourses with low-detail screening lanes visible off to the side.`,
    recognitionCue: "Continue through the open corridor beyond security.",
    accessibilityDescription: "The security exit preview shows a wide step-free path forward from screening into the concourse.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "straight",
    scene: { kind: "security", signText: "CONCOURSES", subjectLabel: "Concourse corridor", side: "center", depth: "far" },
    imageSrc: simulatedSecurityConcourseExitImage,
    overlayLabel: "CONCOURSES"
  }),
  "post-security-concourse": visual({
    id: "post-security-concourse",
    title: "Post-Security Concourse",
    landmarkType: "concourse",
    directionVariation: "continue into concourse",
    rightsRecordId: "SIM-SECURITY-CONCOURSE-EXIT",
    location: "Simulated post-security concourse threshold",
    altText: `${terminalStyle} Open post-security corridor leading forward into the concourses with low-detail screening lanes visible off to the side.`,
    recognitionCue: "Continue through the open corridor beyond security toward the concourse entrance.",
    accessibilityDescription: "The simulated post-security concourse preview shows a wide step-free corridor continuing forward beyond the screening area.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "concourse", signText: "CONCOURSE A", subjectLabel: "Open corridor", side: "center", depth: "far" },
    imageSrc: simulatedSecurityConcourseExitImage,
    focalPoint: { x: 0.5, y: 0.54 },
    overlayLabel: "CONCOURSE ENTRANCE",
    overlayPosition: "top-center"
  }),
  "tsa-precheck": visual({
    id: "tsa-precheck",
    title: "TSA PreCheck Entrance",
    landmarkType: "security",
    directionVariation: "entrance on the left",
    altText: `${terminalStyle} Simulated TSA PreCheck entrance with text sign over the left screening lanes and standard lanes nearby.`,
    recognitionCue: "Look for the TSA PreCheck sign above the lanes on the left.",
    accessibilityDescription: "The simulated TSA PreCheck entrance is on the left with standard lanes to the right for context.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "enter-left",
    scene: { kind: "tsa-precheck", signText: "TSA PRECHECK", subjectLabel: "Left lanes", supportingLabel: "Standard lanes", side: "left", depth: "mid" },
    imageSrc: simulatedTsaPrecheckImage,
    overlayLabel: "TSA PreCheck",
    overlayPosition: "top-left"
  }),
  "information-desk": visual({
    id: "information-desk",
    title: "Information Desk",
    landmarkType: "information_desk",
    directionVariation: "approach from front",
    rightsRecordId: "SIM-INFORMATION-DESK-RIGHT-TURN",
    location: "Simulated information desk",
    altText: `${terminalStyle} Information Desk slightly left of center with an open corridor continuing to the right beyond the desk.`,
    recognitionCue: "Look for the Information Desk counter near the center of the terminal.",
    accessibilityDescription: "The simulated information desk preview shows an open counter with clear floor space and a step-free approach.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "information", signText: "INFORMATION", subjectLabel: "Information desk", side: "center", depth: "mid" },
    imageSrc: simulatedInformationDeskRightTurnImage,
    focalPoint: { x: 0.44, y: 0.54 },
    overlayLabel: "Information Desk",
    overlayPosition: "top-center"
  }),
  "information-desk-approach": visual({
    id: "information-desk-approach",
    title: "Aviator Boy Fountain",
    landmarkType: "information_desk",
    directionVariation: "desk straight ahead",
    actualOrSimulated: "actual",
    permissionStatus: "GSP Supplied",
    rightsRecordId: "GSP-MEDIA-AVIATOR-BOY",
    location: "Aviator Boy fountain",
    altText: "The Aviator Boy fountain inside Greenville-Spartanburg International Airport with bronze sculpture and water feature.",
    recognitionCue: "Look for the bronze Aviator Boy fountain near the center of the terminal.",
    accessibilityDescription: "The route approaches the central fountain landmark with open floor space around it.",
    simulatedLabel: false,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "information", signText: "INFORMATION", subjectLabel: "Circular desk", side: "center", depth: "near" },
    imageSrc: gspAviatorBoyImage,
    focalPoint: { x: 0.5, y: 0.52 },
    overlayLabel: "Aviator Boy",
    overlayPosition: "top-center"
  }),
  "information-desk-right-turn": visual({
    id: "information-desk-right-turn",
    title: "Information Desk",
    landmarkType: "information_desk",
    directionVariation: "turn right after desk",
    rightsRecordId: "SIM-INFORMATION-DESK-RIGHT-TURN",
    location: "Simulated information desk right turn",
    altText: `${terminalStyle} Information Desk slightly left of center with an open corridor continuing to the right beyond the desk.`,
    recognitionCue: "Turn right immediately after the Information Desk.",
    accessibilityDescription: "The simulated Information Desk preview shows the desk on the left and a wide step-free corridor continuing to the right.",
    simulatedLabel: false,
    visualPriority: "primary",
    defaultOverlay: "right",
    scene: { kind: "information", signText: "INFORMATION", subjectLabel: "Information Desk", side: "left", depth: "near" },
    imageSrc: simulatedInformationDeskRightTurnImage,
    focalPoint: { x: 0.4, y: 0.54 },
    overlayLabel: "Information Desk"
  }),
  elevator: visual({
    id: "elevator",
    title: "Elevator Bank",
    landmarkType: "elevator",
    directionVariation: "straight ahead",
    altText: `${terminalStyle} Elevator doors beneath an Elevator sign with a floor level indicator.`,
    recognitionCue: "Look for the elevator doors beneath the Elevator sign.",
    accessibilityDescription: "The elevator doors are centered with a wide step-free waiting area.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "elevator", signText: "ELEVATOR", subjectLabel: "Level 2", side: "center", depth: "mid" },
    imageSrc: simulatedElevatorImage
  }),
  "elevator-left": visual({
    id: "elevator-left",
    title: "Elevator on the Left",
    landmarkType: "elevator",
    directionVariation: "landmark on left",
    altText: `${terminalStyle} Elevator doors on the left side of the corridor with an accessible route cue.`,
    recognitionCue: "Look for the elevator doors on the left side of the corridor.",
    accessibilityDescription: "The elevator is on the left and the route remains step-free.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "landmark-left",
    scene: { kind: "elevator", signText: "ELEVATOR", subjectLabel: "Level 2", side: "left", depth: "mid" },
    imageSrc: simulatedElevatorLeftImage
  }),
  "elevator-right": visual({
    id: "elevator-right",
    title: "Elevator on the Right",
    landmarkType: "elevator",
    directionVariation: "landmark on right",
    altText: `${terminalStyle} Elevator doors on the right side of the corridor with an accessible route cue.`,
    recognitionCue: "Look for the elevator doors on the right side of the corridor.",
    accessibilityDescription: "The elevator is on the right and the route remains step-free.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "landmark-right",
    scene: { kind: "elevator", signText: "ELEVATOR", subjectLabel: "Level 2", side: "right", depth: "mid" },
    imageSrc: simulatedElevatorRightImage
  }),
  escalator: visual({
    id: "escalator",
    title: "Escalator",
    landmarkType: "elevator",
    directionVariation: "approach from front",
    altText: `${terminalStyle} Escalator entrance with an overhead Escalator sign and floor indicator.`,
    recognitionCue: "Look for the escalator entrance beneath the Escalator sign.",
    accessibilityDescription: "The escalator is visible ahead; step-free travelers should use the elevator route.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "straight",
    scene: { kind: "escalator", signText: "ESCALATOR", subjectLabel: "Upper level", side: "center", depth: "mid" },
    imageSrc: simulatedEscalatorImage
  }),
  restroom: visual({
    id: "restroom",
    title: "Restroom Entrance",
    landmarkType: "restroom",
    directionVariation: "entrance on right",
    altText: `${terminalStyle} Restroom entrance with an overhead Restrooms sign on the right side of the corridor.`,
    recognitionCue: "Look for the Restrooms sign on the right side of the corridor.",
    accessibilityDescription: "The restroom entrance is on the right with a clear step-free approach.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "landmark-right",
    scene: { kind: "restroom", signText: "RESTROOMS", subjectLabel: "Entrance", side: "right", depth: "mid" },
    imageSrc: simulatedRestroomImage
  }),
  "accessible-restroom": visual({
    id: "accessible-restroom",
    title: "Accessible Restroom",
    landmarkType: "restroom",
    directionVariation: "accessible entrance on right",
    altText: `${terminalStyle} Accessible restroom entrance with overhead sign and wide corridor placement.`,
    recognitionCue: "Look for the accessible restroom sign beside the corridor entrance.",
    accessibilityDescription: "The accessible restroom entrance is on the right with extra turning space.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "landmark-right",
    scene: { kind: "restroom", signText: "ACCESSIBLE RESTROOM", subjectLabel: "Wide entrance", side: "right", depth: "mid" },
    imageSrc: simulatedAccessibleRestroomImage
  }),
  "family-restroom": visual({
    id: "family-restroom",
    title: "Family Restroom",
    landmarkType: "restroom",
    directionVariation: "entrance on left",
    altText: `${terminalStyle} Family restroom entrance with a simple overhead Family Room sign on the left.`,
    recognitionCue: "Look for the Family Room sign on the left side of the corridor.",
    accessibilityDescription: "The family restroom is on the left with a wide door and clear approach.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "landmark-left",
    scene: { kind: "restroom", signText: "FAMILY ROOM", subjectLabel: "Wide door", side: "left", depth: "mid" },
    imageSrc: simulatedFamilyRestroomImage
  }),
  "nursing-room-entrance": visual({
    id: "nursing-room-entrance",
    title: "Nursing Room",
    landmarkType: "restroom",
    directionVariation: "private entrance ahead",
    location: "Simulated Nursing Room entrance",
    actualOrSimulated: "simulated",
    rightsRecordId: "SIM-FAMILY-RESTROOM",
    altText: "A private airport nursing room entrance with a wide accessible approach.",
    recognitionCue: "Look for the private entrance beneath the Nursing Room sign.",
    accessibilityDescription: "The simulated Nursing Room has a private closed entrance ahead with a clear step-free approach.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "arrive",
    scene: { kind: "restroom", signText: "NURSING ROOM", subjectLabel: "Private entrance", side: "center", depth: "near" },
    imageSrc: simulatedFamilyRestroomImage,
    overlayLabel: "NURSING ROOM",
    overlayPosition: "top-center"
  }),
  "quiet-space": visual({
    id: "quiet-space",
    title: "Quiet Space",
    landmarkType: "quiet_space",
    directionVariation: "calm entrance ahead",
    altText: `${terminalStyle} Quiet Space entrance with muted lighting, simple seating, and low activity.`,
    recognitionCue: "Look for the Quiet Space sign beside the softly lit entrance.",
    accessibilityDescription: "The quiet space is ahead with a low-stimulation entrance and seating nearby.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "quiet", signText: "QUIET SPACE", subjectLabel: "Softly lit entrance", side: "center", depth: "mid" },
    imageSrc: simulatedQuietSpaceImage,
    overlayLabel: "Quiet Space",
    overlayPosition: "middle-left"
  }),
  "concourse-split": visual({
    id: "concourse-split",
    title: "Concourse Split",
    landmarkType: "concourse",
    directionVariation: "choose concourse direction",
    altText: `${terminalStyle} Overhead Concourse A and Concourse B signs above a split corridor.`,
    recognitionCue: "Look for the overhead concourse signs before continuing.",
    accessibilityDescription: "Both concourse paths are visible with clear overhead signs and open floor space.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "left",
    scene: { kind: "concourse", signText: "A     B", subjectLabel: "Concourse split", side: "center", depth: "far" },
    imageSrc: simulatedConcourseSplitImage,
    overlayLabel: "CONCOURSE A LEFT",
    overlayPosition: "top-center"
  }),
  "concourse-a-entrance": visual({
    id: "concourse-a-entrance",
    title: "Concourse A Entrance",
    landmarkType: "concourse",
    directionVariation: "continue under Concourse A sign",
    rightsRecordId: "SIM-CONCOURSE-A-ENTRANCE",
    location: "Simulated Concourse A entrance",
    altText: `${terminalStyle} Concourse A corridor entrance straight ahead beneath a blank overhead sign panel with one clear forward path.`,
    recognitionCue: "Continue beneath the Concourse A sign.",
    accessibilityDescription: "The simulated Concourse A entrance preview shows a wide step-free corridor continuing straight ahead beneath the sign.",
    simulatedLabel: false,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "concourse", signText: "CONCOURSE A", subjectLabel: "A gates", side: "center", depth: "far" },
    imageSrc: simulatedConcourseAEntranceImage,
    focalPoint: { x: 0.5, y: 0.48 },
    overlayLabel: "CONCOURSE A",
    overlayPosition: "top-center"
  }),
  "concourse-b-entrance": visual({
    id: "concourse-b-entrance",
    title: "Concourse B Entrance",
    landmarkType: "concourse",
    directionVariation: "continue under Concourse B sign",
    altText: `${terminalStyle} Large overhead Concourse B sign with the corridor continuing beneath it.`,
    recognitionCue: "Look for the large Concourse B sign above the corridor.",
    accessibilityDescription: "The Concourse B corridor is straight ahead with a wide step-free path.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "concourse", signText: "CONCOURSE B", subjectLabel: "B gates", side: "center", depth: "far" },
    imageSrc: simulatedConcourseBEntranceImage
  }),
  "coffee-shop": visual({
    id: "coffee-shop",
    title: "Coffee Shop Landmark",
    landmarkType: "concourse",
    directionVariation: "landmark on left",
    altText: `${terminalStyle} Small coffee counter on the left side of the concourse with warm signage.`,
    recognitionCue: "Look for the Coffee sign on the left side of the concourse.",
    accessibilityDescription: "The coffee counter is on the left while the route continues down the open corridor.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "landmark-left",
    scene: { kind: "coffee", signText: "COFFEE", subjectLabel: "Counter", side: "left", depth: "mid" },
    imageSrc: simulatedCoffeeShopImage
  }),
  "gate-area": visual({
    id: "gate-area",
    title: "Gate Podium",
    landmarkType: "gate",
    directionVariation: "arrival at gate",
    altText: `${terminalStyle} Gate podium, boarding entrance, nearby seating, and overhead gate sign.`,
    recognitionCue: "Look for the gate podium beneath the gate sign.",
    accessibilityDescription: "The boarding entrance and seating are visible with a step-free approach to the podium.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "arrive",
    scene: { kind: "gate", signText: "GATE", gateNumber: "A12", subjectLabel: "Gate podium", side: "center", depth: "mid" },
    imageSrc: simulatedGatePodiumImage
  }),
  "gate-a1-podium": visual({
    id: "gate-a1-podium",
    title: "Gate A1",
    landmarkType: "gate",
    directionVariation: "destination ahead on left",
    altText: `${terminalStyle} Gate A1 sign, gate podium, boarding entrance, and nearby seating.`,
    recognitionCue: "Look for the gate podium beneath the A1 sign.",
    accessibilityDescription: "The Gate A1 podium is ahead with seating nearby and a clear approach path.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "arrive",
    scene: { kind: "gate", signText: "GATE", gateNumber: "A1", subjectLabel: "Boarding podium", side: "center", depth: "mid" },
    imageSrc: simulatedGatePodiumImage,
    overlayLabel: "Gate A1"
  }),
  "gate-a12-podium": visual({
    id: "gate-a12-podium",
    title: "Gate A12",
    landmarkType: "gate",
    directionVariation: "destination ahead on left",
    altText: `${terminalStyle} Gate A12 sign, gate podium, boarding entrance, and a compact seating area.`,
    recognitionCue: "Look for the gate podium beneath the A12 sign.",
    accessibilityDescription: "The Gate A12 podium is centered with priority seating nearby and step-free access.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "arrive",
    scene: { kind: "gate", signText: "GATE", gateNumber: "A12", subjectLabel: "Boarding podium", side: "center", depth: "mid" },
    imageSrc: simulatedGatePodiumImage,
    overlayLabel: "Gate A12",
    overlayPosition: "top-center"
  }),
  "gate-b6-podium": visual({
    id: "gate-b6-podium",
    title: "Gate B6",
    landmarkType: "gate",
    directionVariation: "updated destination ahead",
    altText: `${terminalStyle} Gate B6 sign, boarding podium, open step-free approach, and nearby seating.`,
    recognitionCue: "Look for the gate podium beneath the B6 sign.",
    accessibilityDescription: "The Gate B6 podium is straight ahead with an open step-free approach lane.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "arrive",
    scene: { kind: "gate", signText: "GATE", gateNumber: "B6", subjectLabel: "Updated gate", side: "center", depth: "mid" },
    imageSrc: simulatedGatePodiumImage,
    overlayLabel: "Gate B6"
  }),
  "gate-seating": visual({
    id: "gate-seating",
    title: "Gate Seating Area",
    landmarkType: "gate",
    directionVariation: "continue through seating",
    rightsRecordId: "SIM-GATE-SEATING-ROUTE",
    altText: `${terminalStyle} Calm gate seating rows with an open walking path leading toward a smaller gate podium in the distance.`,
    recognitionCue: "Continue through the seating area toward the gate podium.",
    accessibilityDescription: "The gate seating preview shows an open step-free walking path through the seating area toward the gate podium.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "straight",
    scene: { kind: "gate", signText: "GATE", gateNumber: "A12", subjectLabel: "Seating path", side: "center", depth: "mid" },
    imageSrc: simulatedGateSeatingRouteImage,
    overlayLabel: "Gate Seating"
  }),
  "baggage-claim": visual({
    id: "baggage-claim",
    title: "Baggage Claim",
    landmarkType: "baggage_claim",
    directionVariation: "carousel straight ahead",
    altText: `${terminalStyle} Baggage Claim sign above Carousel 2 with the belt visible in the foreground.`,
    recognitionCue: "Look for Carousel 2 beneath the large Baggage Claim sign.",
    accessibilityDescription: "The baggage carousel is centered with open floor space around the belt.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "baggage", signText: "BAGGAGE CLAIM", subjectLabel: "Carousel 2", side: "center", depth: "mid" },
    imageSrc: simulatedBaggageClaimImage
  }),
  "ground-transportation": visual({
    id: "ground-transportation",
    title: "Ground Transportation",
    landmarkType: "ground_transportation",
    directionVariation: "exit doors ahead",
    rightsRecordId: "SIM-GROUND-TRANSPORTATION-EXIT",
    location: "Simulated ground transportation exit",
    altText: `${terminalStyle} Glass terminal exit doors with a covered curbside pickup area visible straight ahead beyond the doors.`,
    recognitionCue: "Continue through the doors beneath the Ground Transportation sign.",
    accessibilityDescription: "The ground transportation preview shows glass exit doors leading to a covered curbside pickup area with a step-free route.",
    simulatedLabel: false,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "ground", signText: "GROUND TRANSPORT", subjectLabel: "Pickup exit", side: "center", depth: "mid" },
    imageSrc: simulatedGroundTransportationExitImage,
    focalPoint: { x: 0.5, y: 0.54 },
    overlayLabel: "GROUND TRANSPORTATION"
  }),
  "parking-connection": visual({
    id: "parking-connection",
    title: "Parking Connection",
    landmarkType: "parking",
    directionVariation: "covered walkway",
    altText: `${terminalStyle} Covered parking connection walkway with Parking signs and terminal direction ahead.`,
    recognitionCue: "Look for the covered walkway leading toward the terminal.",
    accessibilityDescription: "The parking connection is a covered step-free walkway toward the terminal entrance.",
    simulatedLabel: true,
    visualPriority: "primary",
    defaultOverlay: "straight",
    scene: { kind: "parking", signText: "PARKING", subjectLabel: "Covered walkway", side: "center", depth: "mid" },
    imageSrc: simulatedParkingConnectionImage
  }),
  "airport-assistance-desk": visual({
    id: "airport-assistance-desk",
    title: "Airport Assistance Desk",
    landmarkType: "information_desk",
    directionVariation: "desk on right",
    altText: `${terminalStyle} Airport assistance desk on the right with a simple Help sign and open counter.`,
    recognitionCue: "Look for the Assistance desk beside the Help sign.",
    accessibilityDescription: "The assistance desk is on the right with open counter access and a clear queue area.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "landmark-right",
    scene: { kind: "assistance", signText: "ASSISTANCE", subjectLabel: "Help desk", side: "right", depth: "mid" },
    imageSrc: simulatedAirportAssistanceDeskImage
  }),
  "service-animal-relief": visual({
    id: "service-animal-relief",
    title: "Service Animal Relief Area",
    landmarkType: "concourse",
    directionVariation: "entrance on left",
    altText: `${terminalStyle} Service animal relief room entrance with a small overhead sign on the left side of the corridor.`,
    recognitionCue: "Look for the Service Animal Relief sign on the left.",
    accessibilityDescription: "The relief area entrance is on the left with a wide door and clear floor space.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "landmark-left",
    scene: { kind: "service-animal", signText: "SERVICE ANIMAL", subjectLabel: "Relief area", side: "left", depth: "mid" },
    imageSrc: simulatedServiceAnimalReliefImage
  }),
  "rental-car-area": visual({
    id: "rental-car-area",
    title: "Rental Car Area",
    landmarkType: "ground_transportation",
    directionVariation: "counters ahead",
    altText: `${terminalStyle} Rental car counter area with overhead Rental Cars sign and a clear approach path.`,
    recognitionCue: "Look for the Rental Cars sign above the counter area.",
    accessibilityDescription: "The rental car counters are ahead with an open step-free path.",
    simulatedLabel: true,
    visualPriority: "supporting",
    defaultOverlay: "straight",
    scene: { kind: "rental-car", signText: "RENTAL CARS", subjectLabel: "Counters", side: "center", depth: "mid" },
    imageSrc: simulatedRentalCarAreaImage
  })
};

export const allLandmarkVisuals = Object.values(landmarkVisualLibrary);

function landmarkTypeForLocation(location: AirportLocation): LandmarkType {
  const byType: Record<LocationType, LandmarkType> = {
    parking: "parking",
    entry: "entrance",
    ticketing: "ticketing",
    security: "security",
    concourse: "concourse",
    gate: "gate",
    restroom: "restroom",
    baggage: "baggage_claim",
    transportation: "ground_transportation",
    quiet: "quiet_space",
    information: "information_desk",
    vertical: "elevator",
    hallway: "concourse"
  };

  return byType[location.type];
}

function gateVisualId(location: AirportLocation): LandmarkVisualId {
  if (location.id === "gate-a1") {
    return "gate-a1-podium";
  }

  if (location.id === "gate-a12") {
    return "gate-a12-podium";
  }

  if (location.id === "gate-b2") {
    return "gate-b6-podium";
  }

  return "gate-area";
}

function visualIdForStep(from: AirportLocation, to: AirportLocation, connection: RouteConnection): LandmarkVisualId {
  if (from.id === "main-entrance" && to.id === "ticket-counter") {
    return "main-entrance-ticketing";
  }

  if (to.id === "ticket-counter") {
    return "ticket-counter";
  }

  if (to.id === "security-checkpoint") {
    return "security-standard";
  }

  if (from.id === "security-checkpoint" && to.id === "concourse-entrance") {
    return "post-security-concourse";
  }

  if (to.id === "concourse-entrance" || to.id === "central-concourse") {
    return to.id.includes("b") ? "concourse-b-entrance" : "concourse-a-entrance";
  }

  if (from.id === "information-desk") {
    return "information-desk-right-turn";
  }

  if (to.id === "information-desk") {
    return "information-desk-approach";
  }

  if (to.id === "elevators" || connection.hasElevator) {
    return connection.direction === "left" ? "elevator-left" : "elevator-right";
  }

  if (to.id === "stairs") {
    return "escalator";
  }

  if (to.id === "restroom" || from.id === "restroom") {
    return "accessible-restroom";
  }

  if (to.id === "nursing-room") {
    return "nursing-room-entrance";
  }

  if (to.id === "quiet-space") {
    return "quiet-space";
  }

  if (to.type === "gate") {
    return gateVisualId(to);
  }

  if (to.id === "baggage-claim" || from.id === "baggage-claim") {
    return "baggage-claim";
  }

  if (to.id === "ground-transportation") {
    return "ground-transportation";
  }

  if (to.id === "parking-garage" || from.id === "parking-garage") {
    return "parking-connection";
  }

  if (to.id === "alternate-hallway") {
    return "concourse-b-entrance";
  }

  return "concourse-split";
}

function maneuverForStep(from: AirportLocation, to: AirportLocation, connection: RouteConnection): RouteManeuver {
  if (from.id === "information-desk") {
    return "turn_right";
  }

  if (to.id === "elevators" || connection.hasElevator) {
    return "elevator";
  }

  if (to.type === "security") {
    return "security";
  }

  if (to.type === "gate" || to.type === "transportation") {
    return "arrival";
  }

  return "straight";
}

function overlayForStep(visualId: LandmarkVisualId, maneuver: RouteManeuver): VisualDirectionOverlay {
  if (maneuver === "turn_right") {
    return "right";
  }

  if (maneuver === "turn_left") {
    return "left";
  }

  if (maneuver === "arrival") {
    return "arrive";
  }

  return landmarkVisualLibrary[visualId].defaultOverlay;
}

function cueForStep(from: AirportLocation, to: AirportLocation, visualId: LandmarkVisualId): string {
  if (from.id === "information-desk") {
    return landmarkVisualLibrary["information-desk-right-turn"].recognitionCue;
  }

  if (to.type === "gate") {
    const gateNumber = to.name.replace("Gate ", "");
    return `Look for the gate podium beneath the ${gateNumber} sign.`;
  }

  return landmarkVisualLibrary[visualId].recognitionCue;
}

export function buildRouteStepVisualReference({
  connection,
  from,
  to
}: {
  connection: RouteConnection;
  from: AirportLocation;
  to: AirportLocation;
}) {
  const visualId = visualIdForStep(from, to, connection);
  const visualSpec = landmarkVisualLibrary[visualId];
  const maneuver = maneuverForStep(from, to, connection);
  const directionOverlay = overlayForStep(visualId, maneuver);
  const turnDirection: RouteStep["turnDirection"] =
    directionOverlay === "right" || directionOverlay === "enter-right"
      ? "right"
      : directionOverlay === "left" || directionOverlay === "enter-left"
        ? "left"
        : "straight";

  return {
    maneuver,
    landmarkName: visualSpec.title,
    landmarkType: landmarkTypeForLocation(to),
    recognitionCue: cueForStep(from, to, visualId),
    visualId,
    visualAsset: visualId,
    directionOverlay,
    visualPriority: visualSpec.visualPriority,
    simulatedLabel: visualSpec.simulatedLabel,
    altText: visualSpec.altText,
    accessibilityDescription: visualSpec.accessibilityDescription,
    currentMapFocus: to.id,
    turnDirection
  };
}

export function visualReferenceForStep(
  step: RouteStep | null | undefined,
  routeUpdateState: "idle" | "updating" | "ready" = "idle",
  route: CalculatedRoute | null = null
): LandmarkVisualSpec {
  if (!step) {
    return landmarkVisualLibrary["concourse-a-entrance"];
  }

  if (routeUpdateState !== "idle" && (route?.preferences.includes("wheelchair") || route?.preferences.includes("avoidStairs"))) {
    return {
      ...landmarkVisualLibrary["elevator-right"],
      recognitionCue: "Beacon is checking the correct step-free elevator landmark for this route."
    };
  }

  const visualId = step.visualId ?? step.visualAsset;
  const baseVisual = landmarkVisualLibrary[visualId] ?? landmarkVisualLibrary["concourse-a-entrance"];
  return {
    ...baseVisual,
    title: step.landmarkName || baseVisual.title,
    altText: step.altText || baseVisual.altText,
    recognitionCue: step.recognitionCue || baseVisual.recognitionCue,
    accessibilityDescription: step.accessibilityDescription || baseVisual.accessibilityDescription,
    defaultOverlay: step.directionOverlay ?? baseVisual.defaultOverlay,
    visualPriority: step.visualPriority ?? baseVisual.visualPriority,
    simulatedLabel: step.simulatedLabel ?? baseVisual.simulatedLabel
  };
}

export function routeStepUsageForVisual(route: CalculatedRoute | null, visualId: LandmarkVisualId): string[] {
  return (route?.steps ?? [])
    .filter((step) => (step.visualId ?? step.visualAsset) === visualId)
    .map((step) => step.instruction);
}

export const visualGenerationPromptTemplate = `Premium realistic architectural visualization of the same fictional Beacon regional airport terminal. Use black and charcoal wall panels, warm gold accent lighting, polished dark stone floors, brushed metal, blank sign panels for native app text, and shallow depth of field. Eye-level traveler perspective from 20 to 40 feet away, 4:3 composition, one dominant landmark occupying 40 to 60 percent of visual attention, minimal background activity, no official airport logos, no airline logos, no readable generated text, no random signs, no crowds, no collage, no diagram styling, no arrows inside the image. Primary landmark: {landmark}. Approach direction: {direction}. Recognition cue: {cue}.`;
