type NavigationProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function NavigationProgress({ currentStep, totalSteps }: NavigationProgressProps) {
  const progress = totalSteps > 0 ? `${Math.round((currentStep / totalSteps) * 100)}%` : "0%";

  return (
    <div className="navigation-progress" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <span>
        Step {currentStep} of {totalSteps}
      </span>
      <div aria-hidden="true">
        <i style={{ width: progress }} />
      </div>
    </div>
  );
}
