# Beacon Mobile Application Runbook

## Mobile Transformation Summary

Beacon now presents the passenger experience as a native-feeling mobile airport companion while preserving the existing Beacon brand, route intelligence, accessibility mission, assistance workflows, contextual alerts, guided demonstration, and airport admin dashboard.

The passenger UI has been reorganized around five mobile areas:

- Home
- Plan
- Journey
- Trips
- Help

During active navigation, Beacon hides the standard tab bar and keeps the fixed step controls visible so the traveler can always move Back, advance to Next Step, view the route, or request Assistance.

## Mobile Technology Selected

Selected approach: Capacitor-ready React mobile application layer inside the existing Vite app.

Reason:

- The repository already has a working React/Vite passenger proof of concept.
- The route engine, mock airport data, traveler profiles, alerts, assistance models, and admin dashboard are already reusable TypeScript.
- A full Expo/React Native migration would require adding and validating a new native dependency stack that is not present in this workspace.
- This approach preserves the current build and admin dashboard while restructuring the passenger experience to behave like a mobile app.

## Updated Application Structure

- `src/poc/BeaconWayfindingApp.tsx`: main state owner for passenger flow, admin handoff, route state, assistance state, and session persistence.
- `src/poc/mobile/MobileAppShell.tsx`: safe-area mobile app frame and native-style top chrome.
- `src/poc/mobile/BeaconTabNavigator.tsx`: Home, Plan, Journey, Trips, Help bottom navigation.
- `src/poc/mobile/MobileHomeScreen.tsx`: premium mobile home screen with route entry, assistance, status, saved profile, active journey, and GSP demos.
- `src/poc/mobile/MobileLocationSelectionScreen.tsx`: mobile location picker with search, categories, and large touch rows.
- `src/poc/mobile/MobileTravelerSupportScreen.tsx`: profile-first support selection with detailed preferences.
- `src/poc/mobile/MobileTripsScreen.tsx`: active journey resume and prepared demo journeys.
- `src/poc/mobile/mobileInteractions.ts`: haptic-ready interaction helper.
- `src/poc/components/FocusedRouteMap.tsx`: active journey, focused map, step controls, guided demo, and route update behavior.
- `src/poc/components/RouteSummary.tsx`: mobile route review with destination, time, distance, route profile, condition, visual preview, route preview, and Begin Journey.
- `src/poc/components/AssistanceMenu.tsx`: mobile Help/assistance options and proof-of-concept safety messaging.
- `src/poc/components/AdminDashboard.tsx`: remains the airport staff/admin web dashboard.

## Preserved Beacon Functions

- Starting point selection
- Destination selection
- Fastest Route
- Mobility Support
- Calm and Simple Route
- Custom accessibility preferences
- Wheelchair accessible routing
- Avoid stairs
- Elevator-aware routing
- Crowd avoidance
- Quiet route logic
- Quiet space stops
- Restroom stops
- Larger text
- Simplified directions
- Additional travel time
- Reassurance messages
- Route generation
- Route summary
- Step-by-step directions
- Focused map
- Full route view
- Contextual alerts
- Route recalculation messaging
- Temporary route closures through route connection state
- Elevator availability status
- Assistance requests
- Medical and security assistance options
- Arrival confirmation
- Guided demonstration mode
- Administrative alerts
- Airport location management
- Route management
- Accessibility conditions

## Mobile Screens Created

- Mobile Home
- Current Location Selection
- Destination Selection
- Traveler Support Selection
- Route Review
- Active Journey
- Full Route
- Step List
- Alerts
- Trips
- Help / Assistance
- Arrival

## Active Journey Experience

The active journey focuses on:

- Destination status
- One primary instruction
- What You Will See landmark preview
- Focused supporting map
- Fixed step controls

The route step updates the instruction, landmark visual, recognition cue, focused map, current location, remaining progress, and step count.

## Landmark Visual System

Beacon uses a consistent fictionalized airport visual library for:

- Main Entrance
- Ticket Counter
- Security Checkpoint
- Information Desk
- Elevator Bank
- Restroom Sign
- Quiet Space
- Concourse Split
- Gate Area
- Baggage Claim
- Ground Transportation
- Parking Connection

Every visual includes accessible alt text and a short recognition cue. The visuals are not claimed to be exact representations of GSP.

## Native Interactions Added

- Safe-area-aware app frame
- Native-style status area
- Native-style five-tab bottom navigation
- Fixed active journey controls
- Session persistence for selected route, preferences, active step, and presentation mode
- Haptic-ready feedback for route start, route step changes, and presentation journey start
- Reduced-motion respect for screen transitions and haptic helper

## Accessibility Improvements

- Large touch rows and 44px-or-larger controls
- Screen-reader labels for core navigation and route sections
- Text equivalent for assistance, map actions, route state, and visual previews
- Larger text preference preserved
- Reduced motion respected
- Color-independent labels and step text
- Persistent assistance access
- Route instructions remain usable without relying on the map

## GSP Presentation Journey

The GSP Executive Walkthrough remains available from Home and Trips:

- Main Entrance to Gate A12
- Calm and Simple Route profile
- Landmark-based guidance
- What You Will See visual previews
- Step-by-step progression
- Contextual route update
- Assistance access
- Arrival confirmation

## Run Locally

```powershell
pnpm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Build And Test

```powershell
pnpm run lint
pnpm run test
pnpm run build
```

## iPhone Simulator

Current state: Capacitor-ready mobile React layer, not yet a generated iOS native project.

Recommended next setup:

```powershell
pnpm add @capacitor/core @capacitor/cli @capacitor/ios
pnpm exec cap init Beacon com.beacon.wayfinding
pnpm run build
pnpm exec cap add ios
pnpm exec cap sync ios
pnpm exec cap open ios
```

Then run from Xcode on an iPhone simulator.

## Android Emulator

Current state: Capacitor-ready mobile React layer, not yet a generated Android native project.

Recommended next setup:

```powershell
pnpm add @capacitor/core @capacitor/cli @capacitor/android
pnpm exec cap init Beacon com.beacon.wayfinding
pnpm run build
pnpm exec cap add android
pnpm exec cap sync android
pnpm exec cap open android
```

Then run from Android Studio on an Android emulator.

## Physical Device Testing

After adding Capacitor native platforms:

- iPhone: connect device, trust the Mac, select the device in Xcode, and run the iOS target.
- Android: enable Developer Options and USB debugging, connect the device, select it in Android Studio, and run the Android target.
- For quick browser-device review before native packaging, run the Vite dev server on the local network and open the LAN URL from the phone.

## Remaining Limitations

- Native iOS and Android projects are not generated yet.
- Capacitor dependencies are not installed in this workspace.
- Native status bar APIs, native modal APIs, and platform haptics should be wired after Capacitor is installed.
- App Store and Google Play signing, icons, splash screens, privacy labels, and store metadata remain future work.
- Screen reader, simulator, and physical-device QA should be completed after the native wrapper exists.

## App Store And Google Play Preparation

- Add Capacitor native platforms.
- Add production app icons and splash screens using the existing Beacon logo assets.
- Configure native status bar, orientation, and safe-area behavior.
- Add privacy policy and accessibility statement.
- Run VoiceOver and TalkBack QA.
- Run small-phone, large-phone, and tablet QA.
- Validate emergency assistance disclaimers.
- Prepare App Store and Google Play screenshots from the GSP journey.
- Create production backend integrations for live airport data before public release.
