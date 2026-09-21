import { useOnboarding } from '../context/OnboardingContext';
import './StepIndicator.css';

const STEP_LABELS = [
  { step: 1, label: 'Personal info' },
  { step: 2, label: 'Preferences' },
  { step: 3, label: 'Tech stack' },
  { step: 4, label: 'Review' },
];

export default function StepIndicator() {
  const { state } = useOnboarding();

  return (
    <nav aria-label="Onboarding progress">
      <ol className="step-indicator">
        {STEP_LABELS.map(({ step, label }) => {
          const isCurrent = step === state.currentStep;
          const isComplete = step < state.currentStep;

          return (
            <li
              key={step}
              className="step-indicator__item"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={
                  'step-indicator__bubble' +
                  (isCurrent ? ' step-indicator__bubble--current' : '') +
                  (isComplete ? ' step-indicator__bubble--complete' : '')
                }
              >
                {step}
              </span>
              <span className="step-indicator__label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
