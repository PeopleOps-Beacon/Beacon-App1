import {
  Accessibility,
  AlertTriangle,
  ChevronRight,
  LifeBuoy,
  MapPin,
  Navigation,
  ShieldAlert,
  UserRoundCheck
} from "lucide-react";

type AssistanceMenuProps = {
  currentLocationName: string;
  submittedRequestType: string | null;
  onSubmit: (requestType: string) => void;
  onPreferences: () => void;
  onBack: () => void;
};

const assistanceOptions = [
  {
    title: "Request Airport Staff",
    description: "Ask airport staff to meet you near your route.",
    icon: UserRoundCheck
  },
  {
    title: "Navigation Help",
    description: "Get help understanding the next step.",
    icon: Navigation
  },
  {
    title: "Accessibility Assistance",
    description: "Request mobility, sensory, or communication support.",
    icon: Accessibility
  },
  {
    title: "Medical Emergency",
    description: "Use only for urgent medical support.",
    icon: AlertTriangle,
    urgent: true
  },
  {
    title: "Security Concern",
    description: "Report a safety or security issue.",
    icon: ShieldAlert
  },
  {
    title: "Lost or Separated",
    description: "Ask for help reconnecting with your group.",
    icon: MapPin
  }
];

export function AssistanceMenu({
  currentLocationName,
  submittedRequestType,
  onSubmit,
  onPreferences,
  onBack
}: AssistanceMenuProps) {
  return (
    <section className="route-experience-shell" aria-labelledby="assistance-title">
      <article className="route-screen-card assistance-menu-screen">
        <div className="route-screen-heading">
          <p className="eyebrow">Traveler support</p>
          <h1 id="assistance-title">Request Assistance</h1>
          <p>Choose the kind of help you need right now.</p>
        </div>

        {submittedRequestType ? (
          <div className="success-panel" role="status">
            <LifeBuoy aria-hidden="true" />
            <div>
              <h2>Your assistance request has been received.</h2>
              <p>
                Demo request: <strong>{submittedRequestType}</strong> near <strong>{currentLocationName}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="assistance-menu-list">
            {assistanceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  className={option.urgent ? "urgent" : ""}
                  key={option.title}
                  onClick={() => onSubmit(option.title)}
                  type="button"
                >
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                  <ChevronRight aria-hidden="true" />
                </button>
              );
            })}
          </div>
        )}

        <div className="demo-disclaimer-panel">
          <strong>This is a demonstration.</strong>
          <p>No real calls are made. Call 911 in an actual emergency.</p>
        </div>

        <button className="secondary-action" onClick={onPreferences} type="button">
          <Accessibility aria-hidden="true" />
          Accessibility Settings
        </button>
        <button className="secondary-action" onClick={onBack} type="button">
          Return to Navigation
        </button>
      </article>
    </section>
  );
}
