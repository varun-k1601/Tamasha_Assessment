import { useOnboarding } from '../../context/OnboardingContext';
import './DraftSavedBadge.css';

export default function DraftSavedBadge() {
  const { state } = useOnboarding();

  return (
    <span
      className={
        'draft-badge' + (state.isDraftSaved ? ' draft-badge--visible' : '')
      }
      role="status"
    >
      Draft saved
    </span>
  );
}
