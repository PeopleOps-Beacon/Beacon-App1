export type GspAssetManifestStatus =
  | "Approved image found"
  | "Approved image not found"
  | "Permission pending"
  | "Photography needed"
  | "GSP asset request needed";

export type GspAssetManifestRecord = {
  location: string;
  status: GspAssetManifestStatus;
  rightsRecordIds: string[];
  notes: string;
};

export type GspPhotographyRequest = {
  location: string;
  purpose: string;
  cameraPosition: string;
  viewDirection: string;
  primaryLandmark: string;
  framing: string;
  preferredTimeOfDay: string;
  passengers: string;
  minimumResolution: string;
  orientation: string;
  accessibilityRelevance: string;
  securityReviewRequirement: string;
};

export const gspAssetManifest: GspAssetManifestRecord[] = [
  {
    location: "Terminal exterior",
    status: "Approved image found",
    rightsRecordIds: ["GSP-MEDIA-TERMINAL-EXTERIOR"],
    notes: "Official media asset found; broad exterior reference, not ideal for door-level passenger guidance."
  },
  {
    location: "Terminal curb",
    status: "Approved image found",
    rightsRecordIds: ["GSP-MEDIA-TERMINAL-CURB"],
    notes: "Official media asset integrated for curb and terminal approach previews."
  },
  {
    location: "Main entrance",
    status: "Approved image found",
    rightsRecordIds: ["GSP-MEDIA-TERMINAL-CURB"],
    notes: "Terminal curb photo shows the entrance approach; a closer door-level entrance photo is still recommended."
  },
  { location: "Ticketing lobby", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP ticketing lobby image found." },
  { location: "Delta check in area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP airline counter image found." },
  { location: "American Airlines check in area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP airline counter image found." },
  { location: "United check in area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP airline counter image found." },
  { location: "Southwest check in area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP airline counter image found." },
  { location: "Standard security approach", status: "GSP asset request needed", rightsRecordIds: [], notes: "Use only after GSP security/public display review." },
  { location: "TSA PreCheck approach", status: "GSP asset request needed", rightsRecordIds: [], notes: "Use only after GSP/TSA suitability review; simulated visual retained." },
  { location: "Security exit", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved public image found." },
  { location: "Information Center", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved Information Center image found; Aviator Boy used as central actual landmark instead." },
  {
    location: "Aviator Boy fountain",
    status: "Approved image found",
    rightsRecordIds: ["GSP-MEDIA-AVIATOR-BOY"],
    notes: "Official media asset integrated as actual central landmark preview."
  },
  {
    location: "Airside Garden",
    status: "Approved image found",
    rightsRecordIds: ["GSP-MEDIA-AIRSIDE-GARDEN"],
    notes: "Official media asset integrated for post-security landmark preview."
  },
  { location: "Elevator", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP elevator image found." },
  { location: "Escalator", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP escalator image found." },
  { location: "Accessible restroom", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP accessible restroom image found." },
  { location: "Standard restroom", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP restroom image found." },
  { location: "Quiet or lower stimulation area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP quiet-space image found." },
  { location: "Concourse A entrance", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP Concourse A entrance image found; Airside Garden actual image used for central post-security context only." },
  { location: "Concourse B entrance", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP Concourse B entrance image found." },
  { location: "Concourse split", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP concourse split image found." },
  { location: "Gate podium", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP gate podium image found." },
  { location: "Gate seating", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP gate seating image found." },
  { location: "Baggage claim", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP baggage claim image found." },
  { location: "Ground transportation exit", status: "GSP asset request needed", rightsRecordIds: [], notes: "Terminal curb image is integrated for curb context; exact ground transport exit photo still needed." },
  { location: "Rideshare pickup", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP rideshare pickup image found." },
  { location: "Parking connection", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP parking connection image found." },
  { location: "Rental car area", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP rental car counter image found." },
  { location: "Airport assistance location", status: "GSP asset request needed", rightsRecordIds: [], notes: "No approved GSP assistance desk image found." }
];

export const gspPhotographyRequestList: GspPhotographyRequest[] = [
  {
    location: "Main entrance doors",
    purpose: "Door-level preview before the traveler enters the terminal.",
    cameraPosition: "Approximately 25 feet from the main automatic doors at traveler eye level.",
    viewDirection: "Facing the entry doors from the curbside approach.",
    primaryLandmark: "Main terminal entrance doors and overhead entrance signage.",
    framing: "4:3 crop with doors occupying roughly half the frame and curb/walkway context visible.",
    preferredTimeOfDay: "Bright daytime with low glare on glass.",
    passengers: "Minimal background passengers; avoid recognizable faces.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape 4:3 or wider source suitable for 4:3 crop.",
    accessibilityRelevance: "Show step-free curb-to-door approach.",
    securityReviewRequirement: "Standard public exterior review."
  },
  {
    location: "Ticketing lobby and airline counter row",
    purpose: "Preview before travelers identify their airline check-in area.",
    cameraPosition: "Traveler eye level near the entrance side of the ticketing lobby.",
    viewDirection: "Facing the ticket counter row with queue lanes visible.",
    primaryLandmark: "Ticketing counter row and overhead wayfinding signs.",
    framing: "4:3, counters occupying the middle half of the image, no close passenger faces.",
    preferredTimeOfDay: "Normal operating hours with moderate ambient light.",
    passengers: "Minimal or blurred background passengers.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show open queue lanes and step-free approach.",
    securityReviewRequirement: "Review airline branding and passenger privacy before use."
  },
  {
    location: "Standard security and TSA PreCheck approaches",
    purpose: "Preview before choosing the correct security lane approach.",
    cameraPosition: "Public pre-security traveler path, outside any sensitive screening detail.",
    viewDirection: "Facing public lane entrance signs only.",
    primaryLandmark: "Public security lane entrance signage.",
    framing: "4:3, entrance signage visible, no screening interfaces or restricted areas.",
    preferredTimeOfDay: "Normal operating hours with lanes open if approved.",
    passengers: "Avoid recognizable faces and documents.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show open approach path and accessible lane context where appropriate.",
    securityReviewRequirement: "Mandatory GSP security review before integration."
  },
  {
    location: "Concourse A/B entrances and split",
    purpose: "Preview before travelers choose the correct concourse direction.",
    cameraPosition: "Post-security traveler path before the split.",
    viewDirection: "Facing overhead concourse signs and the two path choices.",
    primaryLandmark: "Concourse A and Concourse B signs.",
    framing: "4:3 with both paths visible and signs readable.",
    preferredTimeOfDay: "Normal operating hours with minimal crowding.",
    passengers: "Minimal background passengers.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show wide step-free circulation path.",
    securityReviewRequirement: "Review to avoid sensitive security details behind the photographer."
  },
  {
    location: "Gate podium and seating area",
    purpose: "Arrival preview for gate confirmation.",
    cameraPosition: "Traveler eye level 20 to 30 feet from a representative gate podium.",
    viewDirection: "Facing podium, boarding doorway, and adjacent seating.",
    primaryLandmark: "Gate podium and gate sign.",
    framing: "4:3, podium and gate sign large enough to recognize.",
    preferredTimeOfDay: "Normal operating hours outside boarding peaks.",
    passengers: "Avoid close identifiable faces and boarding documents.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show step-free approach and accessible seating context.",
    securityReviewRequirement: "Review airline signage, passenger privacy, and gate operations."
  },
  {
    location: "Baggage claim and ground transportation path",
    purpose: "Arrival route preview from baggage claim to pickup areas.",
    cameraPosition: "Traveler eye level near the baggage carousel and exit path.",
    viewDirection: "Facing carousel or ground transportation exit signs.",
    primaryLandmark: "Carousel, baggage claim sign, or pickup exit sign.",
    framing: "4:3 with one primary landmark and open route path.",
    preferredTimeOfDay: "Normal arrivals period with low crowd density.",
    passengers: "Minimal or blurred background passengers; avoid luggage tags and documents.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show clear floor space around carousel or exit.",
    securityReviewRequirement: "Review passenger privacy and any operational screens."
  },
  {
    location: "Parking, rideshare, rental cars, and assistance points",
    purpose: "Preview transportation and support destinations that are currently simulated.",
    cameraPosition: "Traveler eye level from the public approach path to each service point.",
    viewDirection: "Facing the service landmark with the route continuing beyond when relevant.",
    primaryLandmark: "Service sign, desk, counter, pickup zone, or covered walkway.",
    framing: "4:3, service point occupying roughly half the visual.",
    preferredTimeOfDay: "Bright public operating conditions.",
    passengers: "Minimal background passengers; avoid faces, plates, IDs, and documents.",
    minimumResolution: "2400 by 1800.",
    orientation: "Landscape.",
    accessibilityRelevance: "Show curb cuts, accessible counter access, or step-free route context.",
    securityReviewRequirement: "Review for restricted doors, credentials, screens, license plates, and privacy."
  }
];
