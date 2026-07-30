# Beacon Environmental Preview Guide

Beacon's active navigation preview uses local SVG renders so every "What You Will See" asset is sharp, fast, and consistent with the existing Beacon brand. These are simulated airport visuals, not exact GSP photography.

## Fixed Visual Style

- Fictional Beacon terminal environment.
- Charcoal wall panels, warm overhead lighting, polished floors, white signage, and subtle Beacon gold accents.
- Eye-level traveler perspective.
- One primary landmark per scene.
- One direction cue at most.
- No official airport, airline, or TSA logos.
- Airline names may appear as plain text only for simulated journeys.

## Route Step Metadata

Each active route step carries:

- `visualId`
- `landmarkName`
- `recognitionCue`
- `altText`
- `directionOverlay`
- `visualPriority`
- `simulatedLabel`
- `accessibilityDescription`

This keeps the visual matched to the instruction, not just to a generic landmark type.

## Reusable Generation Prompt

Use this when replacing a local SVG with a generated bitmap asset:

```text
Premium semi-realistic rendering of the same fictional Beacon airport terminal. Use charcoal and neutral architectural surfaces, warm overhead lighting, polished floors, simple white airport signage, and one subtle Beacon gold directional accent. Eye-level traveler perspective, 16:9 composition, one primary landmark only, minimal background activity, no official airport logos, no airline logos, no random signage, no crowds unless specified. Primary landmark: {landmark}. Direction/action: {direction}. Recognition cue: {cue}.
```

## Review Workflow

Open Demo Admin and use the Visual Review section to check every preview asset for:

- Focal point clarity.
- Direction variation.
- Recognition cue accuracy.
- Alt text quality.
- Simulation label.
- Route steps using the asset.

The review grid is not shown in the normal passenger navigation flow.
