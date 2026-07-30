import { AlertTriangle, CheckCircle2, LifeBuoy, Phone, ShieldAlert, UserRoundCheck, X } from "lucide-react";

type AssistanceModalProps = {
  isOpen: boolean;
  currentLocationName: string;
  onClose: () => void;
  onSubmit: (requestType: string) => void;
  submittedRequestType: string | null;
};

const assistanceOptions = [
  { label: "Call Airport Assistance", icon: Phone },
  { label: "Request In Person Assistance", icon: UserRoundCheck },
  { label: "Report a Navigation Problem", icon: LifeBuoy },
  { label: "Medical Emergency", icon: AlertTriangle },
  { label: "Security Concern", icon: ShieldAlert },
  { label: "Lost or Separated from Travel Companion", icon: UserRoundCheck }
];

export function AssistanceModal({
  isOpen,
  currentLocationName,
  onClose,
  onSubmit,
  submittedRequestType
}: AssistanceModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-describedby="assistance-description"
        aria-labelledby="assistance-title"
        aria-modal="true"
        className="assistance-modal"
        role="dialog"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Traveler support</p>
            <h2 id="assistance-title">Request Assistance</h2>
          </div>
          <button aria-label="Close assistance options" className="icon-button" onClick={onClose} type="button">
            <X aria-hidden="true" />
          </button>
        </div>

        <p id="assistance-description" className="assistance-disclaimer">
          This demonstration does not contact emergency services or airport personnel. During a real emergency, call 911.
        </p>

        {submittedRequestType ? (
          <div className="success-panel" role="status">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <h3>Your assistance request has been received.</h3>
              <p>
                An airport team member would be notified in a live Beacon deployment. Demo request:
                {" "}
                <strong>{submittedRequestType}</strong> near <strong>{currentLocationName}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="assistance-grid">
            {assistanceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button key={option.label} onClick={() => onSubmit(option.label)} type="button">
                  <Icon aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <button className="secondary-action" onClick={onClose} type="button">
          Return to Navigation
        </button>
      </section>
    </div>
  );
}
