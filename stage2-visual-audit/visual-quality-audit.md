# Stage 2 Visual Quality Audit

Scope: active Beacon landmark visual registry, passenger-facing "What you will see" previews only. No application code or production assets were changed for this checkpoint.

Mobile review artifacts:
- stage2-visual-audit/mobile-preview-sheet-375.png
- stage2-visual-audit/mobile-preview-sheet-390.png
- stage2-visual-audit/mobile-preview-sheet-430.png

Status counts:
- Approved: 38
- Needs Crop or Overlay Improvement: 0
- Needs Asset Replacement: 0
- Needs Human Review: 0

Stage 3 Batch 1 update: `main-entrance`, `main-entrance-ticketing`, `information-desk-right-turn`, and `concourse-a-entrance` were replaced with simulated WebP assets and now pass mobile one-second recognition on the regenerated 375, 390, and 430 pixel review sheets.

Stage 3 Batch 2 update: `ground-transportation`, `security-exit`, and `gate-seating` were replaced with simulated WebP assets and now pass mobile one-second recognition on the regenerated 375, 390, and 430 pixel review sheets. `information-desk-left-turn` was removed from the active visual registry because no active route, demo route, planned route, test, or runtime dependency references it.

Stage 3 Batch 3 update: `concourse-split`, `post-security-concourse`, `information-desk`, and `information-desk-approach` were resolved without changing any approved Batch 1 or Batch 2 asset files. `concourse-split` now uses a clearer native `CONCOURSE A LEFT` overlay; `post-security-concourse` now references the approved simulated post-security corridor visual; `information-desk` now references the approved simulated Information Desk visual; `information-desk-approach` is approved as the Aviator Boy waypoint because the existing route instructions explicitly send travelers toward that GSP landmark.

Audit standard: an asset did not pass merely because it loaded. I reviewed landmark recognition, instruction match, direction match, focus, background complexity, mobile clarity, crop quality, image quality, visual consistency, signage, overlay quality, accessibility text, and executive presentation credibility.

## Per-Visual Report

### main-entrance
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-main-entrance-close.webp`
- Landmark name: Main Entrance
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the main glass entrance beneath the terminal sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Close traveler-level exterior view of main glass entrance doors beneath a covered terminal canopy with a clear walking approach.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the main glass doors and covered canopy are now the dominant mobile focal point.
- Recommended action: Keep the simulated close entrance asset until a closer approved GSP entrance photo is supplied.

### main-entrance-ticketing
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-main-entrance-ticketing-check-in.webp`
- Landmark name: Main Entrance to Ticketing
- Route steps using the visual: Main Entrance -> Ticket Counter: Continue toward Ticket Counter. | Main Entrance -> Ticket Counter: Go to Ticket Counter. | Main Entrance -> Ticket Counter: Proceed along the main lobby route to ticketing toward Ticket Counter.
- Current recognition cue: Continue toward the check in counters beneath the Check In sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Check in counters straight ahead with queue stanchions and a blank overhead sign panel for the route label.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the check in counters and native `CHECK IN` overlay are immediately legible on mobile.
- Recommended action: Keep.

### ticket-counter
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-ticket-counter.webp`
- Landmark name: Ticketing Area
- Route steps using the visual: Information Desk -> Ticket Counter: Turn right after the information desk toward Ticket Counter. | Security Checkpoint -> Ticket Counter: Proceed along the primary queue route toward security toward Ticket Counter.
- Current recognition cue: Look for the long counter row beneath the Ticketing sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. General airline ticket counters with bag drop lanes and overhead Ticketing sign.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The counter row is centered, calm, and readable on mobile with the native Ticketing overlay.
- Recommended action: Keep; use native overlay text rather than relying on embedded sign text.

### delta-check-in
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-delta-check-in.webp`
- Landmark name: Delta Air Lines Check In
- Route steps using the visual: Delta flight personalization: route step to Ticket Counter becomes Delta Air Lines check in.
- Current recognition cue: Look for the Delta Air Lines name above the simulated check in counter.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Simulated Delta Air Lines check in area with text signage, counters, and a clear passenger approach path.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The counter is clear, polished, and mobile-readable with the native Delta Air Lines overlay.
- Recommended action: Keep for the executive demo journey.

### american-check-in
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-american-check-in.webp`
- Landmark name: American Airlines Check In
- Route steps using the visual: American flight personalization: route step to Ticket Counter becomes American Airlines check in.
- Current recognition cue: Look for the American Airlines name above the simulated check in counter.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Simulated American Airlines check in area with text signage, accessible queue lanes, and counters.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The counter and queue lanes are clear with one focal point and restrained overlay.
- Recommended action: Keep.

### united-check-in
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-united-check-in.webp`
- Landmark name: United Airlines Check In
- Route steps using the visual: United flight personalization: route step to Ticket Counter becomes United Airlines check in.
- Current recognition cue: Look for the United Airlines name above the simulated check in counter.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Simulated United Airlines check in area with text signage and kiosks beside the counter.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The check-in counter and kiosks read clearly at mobile size.
- Recommended action: Keep.

### southwest-check-in
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-southwest-check-in.webp`
- Landmark name: Southwest Airlines Check In
- Route steps using the visual: Southwest flight personalization: route step to Ticket Counter becomes Southwest Airlines check in.
- Current recognition cue: Look for the Southwest Airlines name above the simulated check in counter.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Simulated Southwest Airlines check in area with text signage and bag drop counters.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The bag-drop counter reads clearly and matches the simulated airline check-in instruction.
- Recommended action: Keep.

### security-checkpoint
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-security-checkpoint.webp`
- Landmark name: Security Checkpoint
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Security sign and the lane dividers ahead.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Standard security entrance straight ahead with lane dividers and screening arches.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The security approach and lane dividers are recognizable, with a calm composition.
- Recommended action: Keep as a generic security approach variant.

### security-standard
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-security-standard.webp`
- Landmark name: Standard Security
- Route steps using the visual: Concourse Entrance -> Security Checkpoint: Proceed straight toward the security checkpoint. | Elevators -> Security Checkpoint: Proceed straight toward the security checkpoint. | Information Desk -> Security Checkpoint: Turn right after the information desk toward Security Checkpoint. | Stairs -> Security Checkpoint: Proceed straight toward the security checkpoint. | Ticket Counter -> Security Checkpoint: Proceed straight toward the security checkpoint.
- Current recognition cue: Use the standard screening lanes under the Security sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Standard screening lanes with a Security sign and low lane dividers.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The standard-lane approach is understandable at mobile size and matches the route step to security.
- Recommended action: Keep.

### security-exit
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-security-concourse-exit.webp`
- Landmark name: Security Exit
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Continue through the open corridor beyond security.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Open post-security corridor leading forward into the concourses with low-detail screening lanes visible off to the side.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the new visual shows the open concourse path with low-detail security context beside the traveler route.
- Recommended action: Keep.

### post-security-concourse
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-security-concourse-exit.webp`
- Landmark name: Post-Security Concourse
- Route steps using the visual: Security Checkpoint -> Concourse Entrance: Continue toward Concourse Entrance. | Security Checkpoint -> Concourse Entrance: Go to Concourse Entrance. | Security Checkpoint -> Concourse Entrance: Proceed along the main post-security corridor toward Concourse Entrance.
- Current recognition cue: Continue through the open corridor beyond security toward the concourse entrance.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Open post-security corridor leading forward into the concourses with low-detail screening lanes visible off to the side.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 3 Batch 3 issue resolved; the immediate post-security corridor now matches the route step toward the concourse entrance.
- Recommended action: Keep the simulated post-security corridor visual unless GSP supplies an approved real threshold photo.

### tsa-precheck
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-tsa-precheck.webp`
- Landmark name: TSA PreCheck Entrance
- Route steps using the visual: Concourse Entrance -> Security Checkpoint: Continue toward the TSA PreCheck entrance on the left. | Information Desk -> Security Checkpoint: Continue toward the TSA PreCheck entrance on the left. | TSA PreCheck preference and Delta flight personalization: security step uses TSA PreCheck entrance.
- Current recognition cue: Look for the TSA PreCheck sign above the lanes on the left.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Simulated TSA PreCheck entrance with text sign over the left screening lanes and standard lanes nearby.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The left-side entrance direction and native TSA PreCheck label are clear on mobile.
- Recommended action: Keep for TSA PreCheck simulation and executive demo.

### information-desk
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-information-desk-right-turn.webp`
- Landmark name: Information Desk
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Information Desk counter near the center of the terminal.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Information Desk slightly left of center with an open corridor continuing to the right beyond the desk.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 3 Batch 3 issue resolved; the generic Information Desk visual now shows a desk-visible simulated asset.
- Recommended action: Keep.

### information-desk-approach
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\gsp\landmarks\gsp-aviator-boy-media.webp`
- Landmark name: Aviator Boy Fountain
- Route steps using the visual: Baggage Claim -> Information Desk: Continue toward the Aviator Boy fountain near the center of the terminal. | Security Checkpoint -> Information Desk: Continue toward the Aviator Boy fountain near the center of the terminal. | Service Hallway -> Information Desk: Continue toward the Aviator Boy fountain near the center of the terminal. | Ticket Counter -> Information Desk: Continue toward the Aviator Boy fountain near the center of the terminal.
- Current recognition cue: Look for the bronze Aviator Boy fountain near the center of the terminal.
- Current alt text: The Aviator Boy fountain inside Greenville-Spartanburg International Airport with bronze sculpture and water feature.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 3 Batch 3 issue resolved by approval; the route instructions explicitly use Aviator Boy as the traveler-facing waypoint, and the official GSP image clearly shows that landmark at mobile size.
- Recommended action: Keep unless route language is later changed to send travelers directly to a visible desk.

### information-desk-right-turn
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-information-desk-right-turn.webp`
- Landmark name: Information Desk
- Route steps using the visual: Information Desk -> Baggage Claim: Turn right after the information desk toward Baggage Claim. | Information Desk -> Service Hallway: Turn right after the information desk toward Service Hallway.
- Current recognition cue: Turn right immediately after the Information Desk.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Information Desk slightly left of center with an open corridor continuing to the right beyond the desk.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the desk is left of center and the open corridor to the right is visible before the app arrow is considered.
- Recommended action: Keep.

### information-desk-left-turn
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\gsp\landmarks\gsp-aviator-boy-media.webp`
- Landmark name: Aviator Boy Fountain
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Aviator Boy fountain, then turn left just after it.
- Current alt text: The Aviator Boy fountain inside Greenville-Spartanburg International Airport with bronze sculpture and water feature.
- File dimensions: 1448 x 1086
- Review status: Removed from active registry
- Primary issue: The visual ID was not referenced by active route selection, demo route personalization, tests, or runtime components.
- Recommended action: No replacement asset created; keep left-turn out of the active registry unless a future route actually needs it.

### elevator
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-elevator.webp`
- Landmark name: Elevator Bank
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the elevator doors beneath the Elevator sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Elevator doors beneath an Elevator sign with a floor level indicator.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The elevator bank is centered, simple, and immediate at mobile size.
- Recommended action: Keep.

### elevator-left
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-elevator-left.webp`
- Landmark name: Elevator on the Left
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the elevator doors on the left side of the corridor.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Elevator doors on the left side of the corridor with an accessible route cue.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The elevator doors are clearly on the left and the cue supports the instruction.
- Recommended action: Keep as the left-side elevator variant.

### elevator-right
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-elevator-right.webp`
- Landmark name: Elevator on the Right
- Route steps using the visual: Concourse Entrance -> Elevators: Use the elevator located on your right. | Security Checkpoint -> Elevators: Use the elevator located on your right.
- Current recognition cue: Look for the elevator doors on the right side of the corridor.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Elevator doors on the right side of the corridor with an accessible route cue.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The elevator doors are clearly on the right and the cue supports the instruction.
- Recommended action: Keep as the right-side elevator variant.

### escalator
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-escalator.webp`
- Landmark name: Escalator
- Route steps using the visual: Concourse Entrance -> Stairs: Use the stairs toward Stairs. | Security Checkpoint -> Stairs: Use the stairs toward Stairs.
- Current recognition cue: Look for the escalator entrance beneath the Escalator sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Escalator entrance with an overhead Escalator sign and floor indicator.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The escalator is the dominant focal point and remains clear on mobile.
- Recommended action: Keep.

### restroom
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-restroom.webp`
- Landmark name: Restroom Entrance
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Restrooms sign on the right side of the corridor.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Restroom entrance with an overhead Restrooms sign on the right side of the corridor.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The restroom entrance is clear enough with a single native label and right-side cue.
- Recommended action: Keep; continue relying on the app label instead of generated sign text.

### accessible-restroom
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-accessible-restroom.webp`
- Landmark name: Accessible Restroom
- Route steps using the visual: Central Concourse -> Restroom: Continue toward Restroom. | Central Concourse -> Restroom: Go to Restroom. | Central Concourse -> Restroom: Proceed along the amenity corridor to restrooms toward Restroom. | Gate A1 -> Restroom: Continue toward Restroom. | Gate A1 -> Restroom: Go to Restroom. | +6 more
- Current recognition cue: Look for the accessible restroom sign beside the corridor entrance.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Accessible restroom entrance with overhead sign and wide corridor placement.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The accessible restroom entrance is clear and matches the recognition cue.
- Recommended action: Keep.

### family-restroom
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-family-restroom.webp`
- Landmark name: Family Restroom
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Family Room sign on the left side of the corridor.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Family restroom entrance with a simple overhead Family Room sign on the left.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The family restroom entrance and left-side direction are readable at mobile size.
- Recommended action: Keep.

### quiet-space
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-quiet-space.webp`
- Landmark name: Quiet Space
- Route steps using the visual: Central Concourse -> Quiet Space: The quiet space is located approximately 100 feet ahead. | Gate A1 -> Quiet Space: The quiet space is located approximately 100 feet ahead. | Gate A12 -> Quiet Space: The quiet space is located approximately 100 feet ahead.
- Current recognition cue: Look for the Quiet Space sign beside the softly lit entrance.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Quiet Space entrance with muted lighting, simple seating, and low activity.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The quiet-space entrance is calm, low-clutter, and mobile-readable.
- Recommended action: Keep for the executive demo quiet-stop sequence.

### concourse-split
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-concourse-split.webp`
- Landmark name: Concourse Split
- Route steps using the visual: Arrival confirmation for non-gate destinations. | Main Entrance -> Service Hallway: Proceed along the quieter side hallway from the entrance toward Service Hallway. | Service Hallway -> Main Entrance: Proceed along the quieter side hallway from the entrance toward Main Entrance. | Ticket Counter -> Main Entrance: Continue toward Main Entrance. | Ticket Counter -> Main Entrance: Go to Main Entrance. | +1 more
- Current recognition cue: Look for the overhead concourse signs before continuing.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Overhead Concourse A and Concourse B signs above a split corridor.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 3 Batch 3 issue resolved; crop remains usable, and the native overlay now communicates the route-relevant Concourse A left choice.
- Recommended action: Keep the current crop and native overlay treatment.

### concourse-a-entrance
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-concourse-a-entrance.webp`
- Landmark name: Concourse A Entrance
- Route steps using the visual: Alternate Hallway -> Concourse Entrance: Continue toward Concourse Entrance. | Alternate Hallway -> Concourse Entrance: Go to Concourse Entrance. | Alternate Hallway -> Concourse Entrance: Proceed along the lower-crowd alternate hallway toward Concourse Entrance. | Central Concourse -> Concourse Entrance: Continue toward Concourse Entrance. | Central Concourse -> Concourse Entrance: Go to Concourse Entrance. | +12 more
- Current recognition cue: Continue beneath the Concourse A sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Concourse A corridor entrance straight ahead beneath a blank overhead sign panel with one clear forward path.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the Concourse A corridor entrance and native `CONCOURSE A` overlay now match the route instruction.
- Recommended action: Keep.

### concourse-b-entrance
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-concourse-b-entrance.webp`
- Landmark name: Concourse B Entrance
- Route steps using the visual: Concourse Entrance -> Alternate Hallway: Continue toward Alternate Hallway. | Concourse Entrance -> Alternate Hallway: Proceed along the lower-crowd alternate hallway toward Alternate Hallway. | Gate B2 -> Alternate Hallway: Continue toward Alternate Hallway. | Gate B2 -> Alternate Hallway: Proceed along the quiet side corridor to gate b2 toward Alternate Hallway.
- Current recognition cue: Look for the large Concourse B sign above the corridor.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Large overhead Concourse B sign with the corridor continuing beneath it.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The corridor threshold is centered and reads as a single Concourse B entry point with the native label.
- Recommended action: Keep.

### coffee-shop
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-coffee-shop.webp`
- Landmark name: Coffee Shop Landmark
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Coffee sign on the left side of the concourse.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Small coffee counter on the left side of the concourse with warm signage.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The coffee counter is recognizable with minimal background activity and a clear left-side cue.
- Recommended action: Keep.

### gate-area
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-gate-podium.webp`
- Landmark name: Gate Podium
- Route steps using the visual: Arrival confirmation for generic gate destinations. | Central Concourse -> Gate A2: Continue toward Gate A2. Your gate is on the left. | Central Concourse -> Gate B1: Continue toward Gate B1. | Central Concourse -> Gate B1: Continue toward Gate B1. Your gate is on the left. | Central Concourse -> Gate B1: Proceed along the main walkway to gate b1 toward Gate B1. | +9 more
- Current recognition cue: Look for the gate podium beneath the gate sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Gate podium, boarding entrance, nearby seating, and overhead gate sign.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The podium, boarding door, and arrival cue are clear at mobile size.
- Recommended action: Keep for generic gate arrival confirmation.

### gate-a1-podium
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-gate-podium.webp`
- Landmark name: Gate A1
- Route steps using the visual: Gate A2 -> Gate A1: Continue toward Gate A1. | Gate A2 -> Gate A1: Continue toward Gate A1. Your gate is on the left. | Gate A2 -> Gate A1: Proceed along the gate a connector toward Gate A1. | Quiet Space -> Gate A1: Continue toward Gate A1. | Quiet Space -> Gate A1: Continue toward Gate A1. Your gate is on the left. | +2 more
- Current recognition cue: Look for the gate podium beneath the A1 sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Gate A1 sign, gate podium, boarding entrance, and nearby seating.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The gate podium visual remains clear with the native Gate A1 label.
- Recommended action: Keep.

### gate-a12-podium
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-gate-podium.webp`
- Landmark name: Gate A12
- Route steps using the visual: Delta flight personalization and Gate A12 route arrival. | Gate A2 -> Gate A12: Continue toward Gate A12. Your gate is on the left. | Quiet Space -> Gate A12: Continue toward Gate A12. Your gate is on the left.
- Current recognition cue: Look for the gate podium beneath the A12 sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Gate A12 sign, gate podium, boarding entrance, and a compact seating area.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The podium is clear and the native Gate A12 label makes the executive-demo destination obvious.
- Recommended action: Keep for Gate A12 route arrival.

### gate-b6-podium
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-gate-podium.webp`
- Landmark name: Gate B6
- Route steps using the visual: Alternate Hallway -> Gate B2: Continue toward Gate B2. Your gate is on the left. | American gate-change personalization and routes to Gate B2 shown as Gate B6. | Gate B1 -> Gate B2: Continue toward Gate B2. Your gate is on the left.
- Current recognition cue: Look for the gate podium beneath the B6 sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Gate B6 sign, boarding podium, open step-free approach, and nearby seating.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The podium is clear and the native Gate B6 label supports the simulated gate-change story.
- Recommended action: Keep.

### gate-seating
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-gate-seating-route.webp`
- Landmark name: Gate Seating Area
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Continue through the seating area toward the gate podium.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Calm gate seating rows with an open walking path leading toward a smaller gate podium in the distance.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; seating and the open walking path are now primary, with the podium secondary in the distance.
- Recommended action: Keep.

### baggage-claim
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-baggage-claim.webp`
- Landmark name: Baggage Claim
- Route steps using the visual: Baggage Claim -> Ground Transportation: Continue toward Ground Transportation. | Baggage Claim -> Ground Transportation: Go to Ground Transportation. | Baggage Claim -> Ground Transportation: Proceed along the arrivals corridor toward baggage claim toward Ground Transportation. | Baggage Claim -> Main Entrance: Go to Main Entrance. | Baggage Claim -> Main Entrance: Proceed along the lower lobby corridor toward baggage claim toward Main Entrance. | +6 more
- Current recognition cue: Look for Carousel 2 beneath the large Baggage Claim sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Baggage Claim sign above Carousel 2 with the belt visible in the foreground.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The carousel is large, centered, and instantly recognizable on mobile.
- Recommended action: Keep.

### ground-transportation
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-ground-transportation-exit.webp`
- Landmark name: Ground Transportation
- Route steps using the visual: Parking Garage -> Ground Transportation: Continue toward Ground Transportation. | Parking Garage -> Ground Transportation: Go to Ground Transportation. | Parking Garage -> Ground Transportation: Proceed along the outdoor curbside connection toward Ground Transportation.
- Current recognition cue: Continue through the doors beneath the Ground Transportation sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Glass terminal exit doors with a covered curbside pickup area visible straight ahead beyond the doors.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: Stage 2 issue resolved; the glass exit doors and covered pickup area now create a clear mobile route cue.
- Recommended action: Keep.

### parking-connection
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-parking-connection.webp`
- Landmark name: Parking Connection
- Route steps using the visual: Ground Transportation -> Parking Garage: Go to Parking Garage. | Ground Transportation -> Parking Garage: Proceed along the outdoor curbside connection toward Parking Garage. | Main Entrance -> Parking Garage: Go to Parking Garage. | Main Entrance -> Parking Garage: Proceed along the covered walkway to the terminal entrance toward Parking Garage. | Parking Garage -> Main Entrance: Continue toward Main Entrance. | +2 more
- Current recognition cue: Look for the covered walkway leading toward the terminal.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Covered parking connection walkway with Parking signs and terminal direction ahead.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The covered walkway is a strong single landmark with a clear forward path.
- Recommended action: Keep.

### airport-assistance-desk
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-airport-assistance-desk.webp`
- Landmark name: Airport Assistance Desk
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Assistance desk beside the Help sign.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Airport assistance desk on the right with a simple Help sign and open counter.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The desk is the dominant focal point and the right-side route cue is restrained.
- Recommended action: Keep.

### service-animal-relief
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-service-animal-relief.webp`
- Landmark name: Service Animal Relief Area
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Service Animal Relief sign on the left.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Service animal relief room entrance with a small overhead sign on the left side of the corridor.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The room entrance and icon are clear with a single left-side cue.
- Recommended action: Keep.

### rental-car-area
- File path: `C:\Users\Owner\OneDrive\Documents\Beacon-OS\src\assets\simulated\simulated-rental-car-area.webp`
- Landmark name: Rental Car Area
- Route steps using the visual: Library asset / no generated passenger route observed
- Current recognition cue: Look for the Rental Cars sign above the counter area.
- Current alt text: Fictional Beacon terminal with charcoal wall panels, warm overhead lighting, polished floors, white signage, and one subtle gold route accent. Rental car counter area with overhead Rental Cars sign and a clear approach path.
- File dimensions: 1448 x 1086
- Review status: Approved
- Primary issue: The counter area is clear and professional, with a single native label.
- Recommended action: Keep.
