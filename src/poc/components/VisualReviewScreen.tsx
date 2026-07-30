import { AlertTriangle, CheckCircle2, Eye, Route } from "lucide-react";
import { imageRightsRegistry } from "../gspImageRights";
import { allLandmarkVisuals, routeStepUsageForVisual } from "../landmarkVisuals";
import type { CalculatedRoute } from "../types";
import { LandmarkVisual } from "./LandmarkVisual";

type VisualReviewScreenProps = {
  route: CalculatedRoute | null;
};

export function VisualReviewScreen({ route }: VisualReviewScreenProps) {
  return (
    <section className="admin-section visual-review-screen" aria-labelledby="visual-review-title" id="visual-review">
      <div className="section-heading">
        <Eye aria-hidden="true" />
        <div>
          <h2 id="visual-review-title">Visual Review</h2>
          <p>Development-only quality control for Beacon environmental previews.</p>
        </div>
      </div>
      <div className="visual-review-grid">
        {allLandmarkVisuals.map((visual) => {
          const rightsRecord = imageRightsRegistry[visual.rightsRecordId];
          const routeUsage = routeStepUsageForVisual(route, visual.id);
          const resolution = visual.imageWidth && visual.imageHeight ? `${visual.imageWidth} x ${visual.imageHeight}` : "No local source";
          const needsReview = visual.reviewChecks.some((check) => check.status === "review") || !rightsRecord;

          return (
            <article className={needsReview ? "needs-review" : "approved"} key={visual.id}>
              <LandmarkVisual compact visual={visual} />
              <div className="visual-review-copy">
                <span>{visual.landmarkType.replace(/_/g, " ")}</span>
                <strong>{visual.title}</strong>
                <small>{visual.directionVariation}</small>
                <p>{visual.recognitionCue}</p>
                <dl>
                  <div>
                    <dt>Alt text</dt>
                    <dd>{visual.altText}</dd>
                  </div>
                  <div>
                    <dt>Authenticity</dt>
                    <dd>{visual.authenticityLabel}</dd>
                  </div>
                  <div>
                    <dt>Rights record</dt>
                    <dd>
                      <span>{visual.rightsRecordId}</span>
                      <small>{rightsRecord ? `${rightsRecord.permissionStatus} · ${rightsRecord.localFilePath}` : "Missing registry entry"}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>Approach</dt>
                    <dd>{visual.approachDirection}</dd>
                  </div>
                  <div>
                    <dt>Resolution</dt>
                    <dd>{resolution}</dd>
                  </div>
                  <div>
                    <dt>Asset status</dt>
                    <dd>
                      <span className={`visual-asset-status ${visual.assetStatus}`}>
                        {needsReview ? <AlertTriangle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
                        {visual.assetStatusLabel}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Review checks</dt>
                    <dd className="visual-check-list">
                      {visual.reviewChecks.map((check) => (
                        <span className={check.status} key={check.label}>
                          {check.status === "pass" ? (
                            <CheckCircle2 aria-hidden="true" />
                          ) : (
                            <AlertTriangle aria-hidden="true" />
                          )}
                          <strong>{check.label}</strong>
                          <small>{check.note}</small>
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Route steps using this asset</dt>
                    <dd>
                      {routeUsage.length > 0 ? (
                        routeUsage.map((instruction) => (
                          <span key={instruction}>
                            <Route aria-hidden="true" />
                            {instruction}
                          </span>
                        ))
                      ) : (
                        <span>Library asset</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
