import { useOnboarding } from '../../context/OnboardingContext';
import { ACTIONS, fieldKey } from '../../context/reducer';
import { EXPERIENCE_OPTIONS, TRACK_OPTIONS } from '../../config/techOptions';
import { validateStep } from '../../utils/validation';
import RadioGroup from '../ui/RadioGroup';

const STEP = 2;
const SECTION = 'preferences';

export default function Step2Preferences() {
  const { state, dispatch } = useOnboarding();
  const { preferences } = state.formData;

  const handleChange = (field, value) => {
    dispatch({ type: ACTIONS.SET_PREFERENCE, payload: { field, value } });

    const key = fieldKey(SECTION, field);
    if (state.touched[key] && state.errors[key]) {
      const nextFormData = {
        ...state.formData,
        preferences: { ...preferences, [field]: value },
      };
      dispatch({
        type: ACTIONS.SET_ERRORS,
        payload: { errors: validateStep(STEP, nextFormData) },
      });
    }
  };

  const handleBlur = (field) => {
    dispatch({
      type: ACTIONS.TOUCH_FIELD,
      payload: { key: fieldKey(SECTION, field) },
    });
    dispatch({
      type: ACTIONS.SET_ERRORS,
      payload: { errors: validateStep(STEP, state.formData) },
    });
  };

  return (
    <section className="step">
      <h2 className="step__title">Preferences</h2>
      <p className="step__hint">Pick the track you want to onboard into.</p>

      <RadioGroup
        id="track"
        name="track"
        legend="Primary track"
        options={TRACK_OPTIONS}
        value={preferences.track}
        error={state.errors[fieldKey(SECTION, 'track')]}
        touched={state.touched[fieldKey(SECTION, 'track')]}
        onChange={(value) => handleChange('track', value)}
        onBlur={() => handleBlur('track')}
        required
      />

      <RadioGroup
        id="experience"
        name="experience"
        legend="Experience level"
        options={EXPERIENCE_OPTIONS}
        value={preferences.experience}
        error={state.errors[fieldKey(SECTION, 'experience')]}
        touched={state.touched[fieldKey(SECTION, 'experience')]}
        onChange={(value) => handleChange('experience', value)}
        onBlur={() => handleBlur('experience')}
        required
      />
    </section>
  );
}
