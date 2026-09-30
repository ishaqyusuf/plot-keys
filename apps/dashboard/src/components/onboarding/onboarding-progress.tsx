type Props = {
  currentStep: number;
  steps: readonly { label: string; description?: string }[];
};

export const accountSteps = [
  { label: "Create account", description: "Your details and company address" },
  { label: "Verify email", description: "Confirm your account" },
  { label: "Company setup", description: "Make your workspace yours" },
];

export function OnboardingProgress({ currentStep, steps }: Props) {
  return (
    <>
      <div className="flow-rail-intro">
        <p className="flow-eyebrow">Your company</p>
        <h2>Make it yours.</h2>
        <p>A few details to build a home for your business.</p>
      </div>
      <ol className="flow-steps" aria-label="Setup progress">
        {steps.map((step, index) => (
          <li
            key={step.label}
            aria-current={index === currentStep ? "step" : undefined}
            data-done={index < currentStep}
          >
            <span className="flow-step-number" aria-hidden="true">
              {index < currentStep ? "✓" : index + 1}
            </span>
            <span>
              <strong>{step.label}</strong>
              {step.description ? <small>{step.description}</small> : null}
              {index < currentStep ? (
                <span className="sr-only">Completed</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      <div className="flow-rail-art">
        <svg viewBox="0 0 210 140" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1">
            <path d="M10 126h190M28 126V58l49-24 52 24v68M77 34v92M129 126V76l49-23v73M28 58l49 25 52-25M77 83v43M129 76l49 24M148 126V88M42 76v16l20 10V87L42 76ZM90 82v18l24-12V70L90 82ZM90 109v17M161 69v18l10-5V64l-10 5Z" />
            <path
              d="M17 117l10-5M184 120l12-6M14 132h181"
              strokeDasharray="3 4"
            />
          </g>
        </svg>
        <strong>From the ground up.</strong>
        <p>Every detail connected.</p>
      </div>
    </>
  );
}
