export type ImagePermissionStatus =
  | "Approved"
  | "User Supplied"
  | "GSP Supplied"
  | "Licensed"
  | "Pending Permission"
  | "Internal Reference Only"
  | "Rejected";

export type ImageRightsRecord = {
  assetId: string;
  localFilePath: string;
  originalSource: string;
  sourcePage: string;
  copyrightOwner: string;
  usagePermission: string;
  licenseType: string;
  permissionStatus: ImagePermissionStatus;
  dateAccessed: string;
  allowedUse: string;
  requiredAttribution: string;
  modificationPermitted: string;
  publicDistributionPermitted: string;
  expirationDate: string;
  notes: string;
};

export const allowedPresentationPermissionStatuses: ImagePermissionStatus[] = [
  "Approved",
  "User Supplied",
  "GSP Supplied",
  "Licensed"
];

const accessedOn = "2026-07-15";
const officialGspOwner = "Greenville-Spartanburg Airport District / Greenville-Spartanburg International Airport";

function officialGspMediaAsset(
  assetId: string,
  localFilePath: string,
  originalSource: string,
  allowedUse: string,
  notes: string
): ImageRightsRecord {
  return {
    assetId,
    localFilePath,
    originalSource,
    sourcePage: "https://gspairport.com/assets/",
    copyrightOwner: officialGspOwner,
    usagePermission: "Official GSP Media Assets page provides this item as a downloadable media asset.",
    licenseType: "Official downloadable GSP media asset; no separate commercial reuse license posted.",
    permissionStatus: "GSP Supplied",
    dateAccessed: accessedOn,
    allowedUse,
    requiredAttribution: "None stated on the source page.",
    modificationPermitted: "Responsive crop and nondeceptive display treatment only; verify with GSP before retouching or broader production use.",
    publicDistributionPermitted: "Use in the Beacon GSP demonstration from the official media asset only; verify with GSP before public production release.",
    expirationDate: "None stated.",
    notes
  };
}

function simulatedAsset(assetId: string, localFilePath: string, notes: string): ImageRightsRecord {
  return {
    assetId,
    localFilePath,
    originalSource: "Beacon simulated visual generated for this proof of concept.",
    sourcePage: "Local OpenAI image generation output copied into the Beacon workspace.",
    copyrightOwner: "Beacon proof-of-concept project asset",
    usagePermission: "Generated for Beacon demo use as a clearly labeled simulated fallback.",
    licenseType: "Project-generated simulated visual; not an actual GSP photograph.",
    permissionStatus: "Approved",
    dateAccessed: accessedOn,
    allowedUse: "Beacon presentation and prototype use only when labeled as simulated.",
    requiredAttribution: "None.",
    modificationPermitted: "Cropping, optimization, accessibility treatment, and nondestructive Beacon overlays permitted.",
    publicDistributionPermitted: "Permitted for Beacon prototype presentation as a simulated visual; do not represent as GSP.",
    expirationDate: "None.",
    notes
  };
}

export const imageRightsRegistry: Record<string, ImageRightsRecord> = {
  "GSP-MEDIA-AIRSIDE-GARDEN": officialGspMediaAsset(
    "GSP-MEDIA-AIRSIDE-GARDEN",
    "src/assets/gsp/landmarks/gsp-airside-garden-media.webp",
    "Biz-Media-Asset-Airside-Garden.jpg",
    "Actual GSP Airside Garden landmark preview in Beacon route guidance.",
    "Useful for central post-security landmark recognition. Does not show security screening detail."
  ),
  "GSP-MEDIA-AVIATOR-BOY": officialGspMediaAsset(
    "GSP-MEDIA-AVIATOR-BOY",
    "src/assets/gsp/landmarks/gsp-aviator-boy-media.webp",
    "Biz-Media-Asset-Boy-Aviator-scaled.jpg",
    "Actual GSP Aviator Boy fountain landmark preview in Beacon route guidance.",
    "Useful as a recognizable central terminal landmark; no prominent passenger faces."
  ),
  "GSP-MEDIA-TERMINAL-CURB": officialGspMediaAsset(
    "GSP-MEDIA-TERMINAL-CURB",
    "src/assets/gsp/transportation/gsp-terminal-curb-media.webp",
    "Biz-Media-Asset-Terminal-Curb-scaled.jpg",
    "Actual GSP terminal curb and entrance approach preview in Beacon route guidance.",
    "Includes incidental airline signage in the environment; app notice clarifies no airline partnership is implied."
  ),
  "GSP-MEDIA-TERMINAL-EXTERIOR": officialGspMediaAsset(
    "GSP-MEDIA-TERMINAL-EXTERIOR",
    "src/assets/gsp/entrance/gsp-terminal-exterior-media.webp",
    "Biz-Media-Asset-GSP-Airport-scaled.jpg",
    "Reference and future terminal exterior preview use.",
    "Official asset found but not wired to the primary passenger route because the entrance is too distant for door-level guidance."
  ),
  "GSP-MEDIA-CARGO-REJECTED": {
    assetId: "GSP-MEDIA-CARGO-REJECTED",
    localFilePath: "Not integrated.",
    originalSource: "Biz-Media-Asset-Cerulean-Cargo.jpg",
    sourcePage: "https://gspairport.com/assets/",
    copyrightOwner: officialGspOwner,
    usagePermission: "Official GSP Media Assets page provides this item as a downloadable media asset.",
    licenseType: "Official downloadable GSP media asset; no separate commercial reuse license posted.",
    permissionStatus: "Rejected",
    dateAccessed: accessedOn,
    allowedUse: "Not used in Beacon passenger guidance.",
    requiredAttribution: "None stated on the source page.",
    modificationPermitted: "Not applicable.",
    publicDistributionPermitted: "Not applicable.",
    expirationDate: "None stated.",
    notes: "Rejected for the passenger preview library because exterior cargo imagery does not support indoor passenger wayfinding."
  },
  "SIM-MAIN-ENTRANCE-CLOSE": simulatedAsset(
    "SIM-MAIN-ENTRANCE-CLOSE",
    "src/assets/simulated/simulated-main-entrance-close.webp",
    "Simulated close terminal entrance replacement for mobile recognition where approved GSP photography is too distant."
  ),
  "SIM-MAIN-ENTRANCE-TICKETING-CHECK-IN": simulatedAsset(
    "SIM-MAIN-ENTRANCE-TICKETING-CHECK-IN",
    "src/assets/simulated/simulated-main-entrance-ticketing-check-in.webp",
    "Simulated check in counter approach replacing the generic post-entry corridor visual."
  ),
  "SIM-INFORMATION-DESK-RIGHT-TURN": simulatedAsset(
    "SIM-INFORMATION-DESK-RIGHT-TURN",
    "src/assets/simulated/simulated-information-desk-right-turn.webp",
    "Simulated Information Desk right-turn preview with the turn geometry visible in the scene."
  ),
  "SIM-CONCOURSE-A-ENTRANCE": simulatedAsset(
    "SIM-CONCOURSE-A-ENTRANCE",
    "src/assets/simulated/simulated-concourse-a-entrance.webp",
    "Simulated Concourse A entrance replacement where the Airside Garden image did not match the route instruction."
  ),
  "SIM-GROUND-TRANSPORTATION-EXIT": simulatedAsset(
    "SIM-GROUND-TRANSPORTATION-EXIT",
    "src/assets/simulated/simulated-ground-transportation-exit.webp",
    "Simulated ground transportation exit with glass terminal doors and covered pickup area."
  ),
  "SIM-SECURITY-CONCOURSE-EXIT": simulatedAsset(
    "SIM-SECURITY-CONCOURSE-EXIT",
    "src/assets/simulated/simulated-security-concourse-exit.webp",
    "Simulated post-security transition into the concourses with low-detail security context."
  ),
  "SIM-GATE-SEATING-ROUTE": simulatedAsset(
    "SIM-GATE-SEATING-ROUTE",
    "src/assets/simulated/simulated-gate-seating-route.webp",
    "Simulated calm gate seating path with the gate podium secondary in the distance."
  ),
  "SIM-MAIN-ENTRANCE-TICKETING": simulatedAsset(
    "SIM-MAIN-ENTRANCE-TICKETING",
    "src/assets/simulated/simulated-main-entrance-ticketing.webp",
    "Simulated post-entry path toward ticketing."
  ),
  "SIM-TICKET-COUNTER": simulatedAsset(
    "SIM-TICKET-COUNTER",
    "src/assets/simulated/simulated-ticket-counter.webp",
    "Simulated general ticketing lobby."
  ),
  "SIM-DELTA-CHECK-IN": simulatedAsset(
    "SIM-DELTA-CHECK-IN",
    "src/assets/simulated/simulated-delta-check-in.webp",
    "Simulated airline check-in counter; no Delta partnership or live integration implied."
  ),
  "SIM-AMERICAN-CHECK-IN": simulatedAsset(
    "SIM-AMERICAN-CHECK-IN",
    "src/assets/simulated/simulated-american-check-in.webp",
    "Simulated airline check-in counter; no American Airlines partnership or live integration implied."
  ),
  "SIM-UNITED-CHECK-IN": simulatedAsset(
    "SIM-UNITED-CHECK-IN",
    "src/assets/simulated/simulated-united-check-in.webp",
    "Simulated airline check-in counter; no United Airlines partnership or live integration implied."
  ),
  "SIM-SOUTHWEST-CHECK-IN": simulatedAsset(
    "SIM-SOUTHWEST-CHECK-IN",
    "src/assets/simulated/simulated-southwest-check-in.webp",
    "Simulated airline check-in counter; no Southwest Airlines partnership or live integration implied."
  ),
  "SIM-SECURITY-CHECKPOINT": simulatedAsset(
    "SIM-SECURITY-CHECKPOINT",
    "src/assets/simulated/simulated-security-checkpoint.webp",
    "Simulated security approach with no sensitive equipment detail."
  ),
  "SIM-SECURITY-STANDARD": simulatedAsset(
    "SIM-SECURITY-STANDARD",
    "src/assets/simulated/simulated-security-standard.webp",
    "Simulated standard screening approach with no sensitive equipment detail."
  ),
  "SIM-SECURITY-EXIT": simulatedAsset(
    "SIM-SECURITY-EXIT",
    "src/assets/simulated/simulated-security-exit.webp",
    "Simulated post-security exit corridor."
  ),
  "SIM-TSA-PRECHECK": simulatedAsset(
    "SIM-TSA-PRECHECK",
    "src/assets/simulated/simulated-tsa-precheck.webp",
    "Simulated TSA PreCheck approach; no live lane availability implied."
  ),
  "SIM-ELEVATOR": simulatedAsset(
    "SIM-ELEVATOR",
    "src/assets/simulated/simulated-elevator.webp",
    "Simulated elevator bank."
  ),
  "SIM-ELEVATOR-LEFT": simulatedAsset(
    "SIM-ELEVATOR-LEFT",
    "src/assets/simulated/simulated-elevator-left.webp",
    "Simulated elevator landmark on the left."
  ),
  "SIM-ELEVATOR-RIGHT": simulatedAsset(
    "SIM-ELEVATOR-RIGHT",
    "src/assets/simulated/simulated-elevator-right.webp",
    "Simulated elevator landmark on the right."
  ),
  "SIM-ESCALATOR": simulatedAsset(
    "SIM-ESCALATOR",
    "src/assets/simulated/simulated-escalator.webp",
    "Simulated escalator landmark."
  ),
  "SIM-RESTROOM": simulatedAsset(
    "SIM-RESTROOM",
    "src/assets/simulated/simulated-restroom.webp",
    "Simulated standard restroom entrance."
  ),
  "SIM-ACCESSIBLE-RESTROOM": simulatedAsset(
    "SIM-ACCESSIBLE-RESTROOM",
    "src/assets/simulated/simulated-accessible-restroom.webp",
    "Simulated accessible restroom entrance."
  ),
  "SIM-FAMILY-RESTROOM": simulatedAsset(
    "SIM-FAMILY-RESTROOM",
    "src/assets/simulated/simulated-family-restroom.webp",
    "Simulated family restroom entrance."
  ),
  "SIM-QUIET-SPACE": simulatedAsset(
    "SIM-QUIET-SPACE",
    "src/assets/simulated/simulated-quiet-space.webp",
    "Simulated quiet or lower-stimulation area."
  ),
  "SIM-CONCOURSE-SPLIT": simulatedAsset(
    "SIM-CONCOURSE-SPLIT",
    "src/assets/simulated/simulated-concourse-split.webp",
    "Simulated concourse split where GSP-approved concourse split photography is not yet available."
  ),
  "SIM-CONCOURSE-B-ENTRANCE": simulatedAsset(
    "SIM-CONCOURSE-B-ENTRANCE",
    "src/assets/simulated/simulated-concourse-b-entrance.webp",
    "Simulated Concourse B entrance where GSP-approved photography is not yet available."
  ),
  "SIM-COFFEE-SHOP": simulatedAsset(
    "SIM-COFFEE-SHOP",
    "src/assets/simulated/simulated-coffee-shop.webp",
    "Simulated coffee shop landmark; no tenant relationship implied."
  ),
  "SIM-GATE-PODIUM": simulatedAsset(
    "SIM-GATE-PODIUM",
    "src/assets/simulated/simulated-gate-podium.webp",
    "Simulated gate podium used for gate preview variants."
  ),
  "SIM-BAGGAGE-CLAIM": simulatedAsset(
    "SIM-BAGGAGE-CLAIM",
    "src/assets/simulated/simulated-baggage-claim.webp",
    "Simulated baggage claim carousel."
  ),
  "SIM-PARKING-CONNECTION": simulatedAsset(
    "SIM-PARKING-CONNECTION",
    "src/assets/simulated/simulated-parking-connection.webp",
    "Simulated parking connection walkway."
  ),
  "SIM-AIRPORT-ASSISTANCE-DESK": simulatedAsset(
    "SIM-AIRPORT-ASSISTANCE-DESK",
    "src/assets/simulated/simulated-airport-assistance-desk.webp",
    "Simulated airport assistance desk."
  ),
  "SIM-SERVICE-ANIMAL-RELIEF": simulatedAsset(
    "SIM-SERVICE-ANIMAL-RELIEF",
    "src/assets/simulated/simulated-service-animal-relief.webp",
    "Simulated service animal relief entrance."
  ),
  "SIM-RENTAL-CAR-AREA": simulatedAsset(
    "SIM-RENTAL-CAR-AREA",
    "src/assets/simulated/simulated-rental-car-area.webp",
    "Simulated rental car counter area; no rental car company relationship implied."
  )
};

export function isPresentationPermissionStatus(status: ImagePermissionStatus): boolean {
  return allowedPresentationPermissionStatuses.includes(status);
}
