import { useOnboarding } from '../../context/OnboardingContext';
import { ACTIONS, TECH_STACK_KEY } from '../../context/reducer';
import { getTechOptions, labelFor, TRACK_OPTIONS } from '../../config/techOptions';
import { validateStep } from '../../utils/validation';
import CheckboxGroup from '../ui/CheckboxGroup';

const STEP = 3;

export default function Step3TechStack() {
  const { state, dispatch } = useOnboarding();
  const { techStack, preferences } = state.formData;

  const options = getTechOptions(preferences.track);

  const handleToggle = (techValue) => {
    dispatch({ type: ACTIONS.TOGGLE_TECH, payload: { id: techValue } });

    if (state.touched[TECH_STACK_KEY] && state.errors[TECH_STACK_KEY]) {
      const nextTechStack = techStack.includes(techValue)
        ? techStack.filter((value) => value !== techValue)
        : [...techStack, techValue];
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: {
          errors: validateStep(STEP, { ...state.formData, techStack: nextTechStack }),
        },
      });
    }
  };

  const handleBlur = () => {
    dispatch({ type: ACTIONS.TOUCH_FIELD, payload: { key: TECH_STACK_KEY } });
    dispatch({
      type: ACTIONS.SET_ERRORS,
      payload: { errors: validateStep(STEP, state.formData) },
    });
  };

  return (
    <section className="step">
      <h2 className="step__title">Tech stack</h2>
      <p className="step__hint">
        Options for the {labelFor(TRACK_OPTIONS, preferences.track)} track. Pick
        at least one.
      </p>

      <CheckboxGroup
        id="techStack"
        legend="Technologies you work with"
        options={options}
        selectedValues={techStack}
        error={state.errors[TECH_STACK_KEY]}
        touched={state.touched[TECH_STACK_KEY]}
        onToggle={handleToggle}
        onBlur={handleBlur}
        required
      />
    </section>
  );
}
