import { useEffect, useState, type CSSProperties } from "react";
import type { LandmarkVisualSpec } from "../landmarkVisuals";
import type { VisualDirectionOverlay } from "../types";

type LandmarkVisualProps = {
  visual: LandmarkVisualSpec;
  turnDirection?: "left" | "right" | "straight";
  compact?: boolean;
};

function overlayFromTurn(turnDirection?: "left" | "right" | "straight"): VisualDirectionOverlay {
  if (turnDirection === "left") {
    return "left";
  }

  if (turnDirection === "right") {
    return "right";
  }

  return "straight";
}

function resolvedOverlay(overlay: VisualDirectionOverlay, turnDirection?: "left" | "right" | "straight") {
  return overlay === "straight" ? overlayFromTurn(turnDirection) : overlay;
}

function DirectionCue({
  overlay,
  turnDirection
}: {
  overlay: VisualDirectionOverlay;
  turnDirection?: "left" | "right" | "straight";
}) {
  const direction = resolvedOverlay(overlay, turnDirection);

  if (direction === "straight") {
    return null;
  }

  return (
    <span aria-hidden="true" className={`landmark-direction-cue ${direction}`}>
      <span />
    </span>
  );
}

function FallbackVisual({ visual }: { visual: LandmarkVisualSpec }) {
  return (
    <div aria-hidden="true" className="landmark-visual-fallback">
      <span>Visual reference</span>
      <strong>{visual.title}</strong>
      <p>{visual.recognitionCue}</p>
    </div>
  );
}

export function LandmarkVisual({ compact = false, turnDirection, visual }: LandmarkVisualProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const showImage = Boolean(visual.imageSrc) && !imageUnavailable;
  const focalStyle = {
    "--visual-focal-x": `${Math.round(visual.focalPoint.x * 100)}%`,
    "--visual-focal-y": `${Math.round(visual.focalPoint.y * 100)}%`
  } as CSSProperties;

  useEffect(() => {
    setImageUnavailable(false);
  }, [visual.imageSrc]);

  return (
    <figure className={`landmark-visual ${compact ? "compact" : ""}`}>
      <div
        className="landmark-visual-stage"
        data-actual-or-simulated={visual.actualOrSimulated}
        data-asset-status={visual.assetStatus}
        role="img"
        aria-label={visual.altText}
        style={focalStyle}
      >
        {showImage ? (
          <img
            alt=""
            decoding="async"
            draggable={false}
            loading={compact ? "lazy" : "eager"}
            onError={() => setImageUnavailable(true)}
            src={visual.imageSrc}
          />
        ) : (
          <FallbackVisual visual={visual} />
        )}
        {showImage ? (
          <span className={`landmark-native-label ${visual.overlayPosition}`}>{visual.overlayLabel}</span>
        ) : null}
        <DirectionCue overlay={visual.defaultOverlay} turnDirection={turnDirection} />
      </div>
    </figure>
  );
}
