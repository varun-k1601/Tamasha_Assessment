import { OnboardingProvider } from './context/OnboardingContext';
import Wizard from './components/Wizard';

export default function App() {
  return (
    <OnboardingProvider>
      <Wizard />
    </OnboardingProvider>
  );
}
