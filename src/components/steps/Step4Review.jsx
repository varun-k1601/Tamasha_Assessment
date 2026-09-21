import { useOnboarding } from '../../context/OnboardingContext';
import { ACTIONS } from '../../context/reducer';
import {
  EXPERIENCE_OPTIONS,
  getTechOptions,
  labelFor,
  TRACK_OPTIONS,
} from '../../config/techOptions';
import './Step4Review.css';

function ReviewSection({ title, onEdit, children }) {
  return (
    <section className="review__section">
      <div className="review__header">
        <h3 className="review__heading">{title}</h3>
        <button
          type="button"
          className="review__edit"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
        >
          Edit
        </button>
      </div>
      <dl className="review__rows">{children}</dl>
    </section>
  );
}

function ReviewRow({ term, children }) {
  return (
    <div className="review__row">
      <dt className="review__term">{term}</dt>
      <dd className="review__value">{children}</dd>
    </div>
  );
}

export default function Step4Review() {
  const { state, dispatch } = useOnboarding();
  const { personal, preferences, techStack } = state.formData;

  const goToStep = (step) =>
    dispatch({ type: ACTIONS.GO_TO_STEP, payload: { step } });

  const selectedTech = getTechOptions(preferences.track)
    .filter((option) => techStack.includes(option.value))
    .map((option) => option.label);

  return (
    <section className="step">
      <h2 className="step__title">Review &amp; submit</h2>
      <p className="step__hint">Check your answers before submitting.</p>

      <ReviewSection title="Personal info" onEdit={() => goToStep(1)}>
        <ReviewRow term="Name">{personal.name}</ReviewRow>
        <ReviewRow term="Email">{personal.email}</ReviewRow>
        <ReviewRow term="Portfolio or GitHub">
          {personal.portfolioUrl || (
            <span className="review__empty">Not provided</span>
          )}
        </ReviewRow>
      </ReviewSection>

      <ReviewSection title="Preferences" onEdit={() => goToStep(2)}>
        <ReviewRow term="Primary track">
          {labelFor(TRACK_OPTIONS, preferences.track)}
        </ReviewRow>
        <ReviewRow term="Experience level">
          {labelFor(EXPERIENCE_OPTIONS, preferences.experience)}
        </ReviewRow>
      </ReviewSection>

      <ReviewSection title="Tech stack" onEdit={() => goToStep(3)}>
        <ReviewRow term="Selected">{selectedTech.join(', ')}</ReviewRow>
      </ReviewSection>
    </section>
  );
}
