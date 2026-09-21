import { useOnboarding } from '../../context/OnboardingContext';
import { ACTIONS, fieldKey } from '../../context/reducer';
import { validateStep } from '../../utils/validation';
import TextField from '../ui/TextField';

const STEP = 1;
const SECTION = 'personal';

export default function Step1Personal() {
  const { state, dispatch } = useOnboarding();
  const { personal } = state.formData;

  const handleChange = (field, value) => {
    dispatch({
      type: ACTIONS.SET_FIELD,
      payload: { section: SECTION, field, value },
    });

    const key = fieldKey(SECTION, field);
    if (state.touched[key] && state.errors[key]) {
      const nextFormData = {
        ...state.formData,
        personal: { ...personal, [field]: value },
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
      <h2 className="step__title">Personal info</h2>
      <p className="step__hint">Tell us who you are.</p>

      <TextField
        id="name"
        label="Full name"
        value={personal.name}
        error={state.errors[fieldKey(SECTION, 'name')]}
        touched={state.touched[fieldKey(SECTION, 'name')]}
        onChange={(value) => handleChange('name', value)}
        onBlur={() => handleBlur('name')}
        placeholder="varunraj"
        required
      />

      <TextField
        id="email"
        label="Email"
        type="email"
        value={personal.email}
        error={state.errors[fieldKey(SECTION, 'email')]}
        touched={state.touched[fieldKey(SECTION, 'email')]}
        onChange={(value) => handleChange('email', value)}
        onBlur={() => handleBlur('email')}
        placeholder="varunraj@example.com"
        required
      />

      <TextField
        id="portfolioUrl"
        label="Portfolio or GitHub URL"
        type="url"
        value={personal.portfolioUrl}
        error={state.errors[fieldKey(SECTION, 'portfolioUrl')]}
        touched={state.touched[fieldKey(SECTION, 'portfolioUrl')]}
        onChange={(value) => handleChange('portfolioUrl', value)}
        onBlur={() => handleBlur('portfolioUrl')}
        hint="Optional. Include the full address, for example https://github.com/ada"
        placeholder="https://github.com/varunraj"
      />
    </section>
  );
}
