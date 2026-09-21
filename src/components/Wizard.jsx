import { useOnboarding } from '../context/OnboardingContext';
import { ACTIONS, TOTAL_STEPS } from '../context/reducer';
import { stepFieldKeys, validateStep } from '../utils/validation';
import StepIndicator from './StepIndicator';
import DraftSavedBadge from './ui/DraftSavedBadge';
import Step1Personal from './steps/Step1Personal';
import Step2Preferences from './steps/Step2Preferences';
import Step3TechStack from './steps/Step3TechStack';
import Step4Review from './steps/Step4Review';
import './Wizard.css';

const STEP_COMPONENTS = {
  1: Step1Personal,
  2: Step2Preferences,
  3: Step3TechStack,
  4: Step4Review,
};

export default function Wizard() {
  const { state, dispatch } = useOnboarding();
  const CurrentStep = STEP_COMPONENTS[state.currentStep];

  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === TOTAL_STEPS;

  const stepErrors = validateStep(state.currentStep, state.formData);
  const isStepValid = Object.keys(stepErrors).length === 0;

  const handleSubmit = () => {
    console.log('Onboarding submission', state.formData);
    dispatch({ type: ACTIONS.SUBMIT });
  };

  const handleNext = () => {
    dispatch({
      type: ACTIONS.TOUCH_STEP_FIELDS,
      payload: { keys: stepFieldKeys(state.currentStep) },
    });
    dispatch({ type: ACTIONS.SET_ERRORS, payload: { errors: stepErrors } });

    if (isStepValid) {
      dispatch({ type: ACTIONS.NEXT_STEP });
    }
  };

  if (state.isSubmitted) {
    return (
      <main className="wizard">
        <h1 className="wizard__title">Developer onboarding</h1>
        <div className="wizard__success" role="status">
          <h2 className="wizard__success-title">You are all set</h2>
          <p className="wizard__success-text">
            Thanks for onboarding. Your answers have been logged to the console.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="wizard">
      <div className="wizard__header">
        <h1 className="wizard__title">Developer onboarding</h1>
        <DraftSavedBadge />
      </div>
      <StepIndicator />

      <CurrentStep />

      <div className="wizard__actions">
        <button
          type="button"
          className="wizard__button"
          onClick={() => dispatch({ type: ACTIONS.PREV_STEP })}
          disabled={isFirstStep}
        >
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            className="wizard__button wizard__button--primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            className="wizard__button wizard__button--primary"
            onClick={handleNext}
            disabled={!isStepValid}
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
