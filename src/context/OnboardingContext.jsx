import { createContext, useContext, useMemo, useReducer } from 'react';
import { loadDraft, useDraftAutoSave } from '../hooks/useLocalStorageDraft';
import { initialState, reducer } from './reducer';

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadDraft);

  useDraftAutoSave(state, dispatch);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === null) {
    throw new Error('useOnboarding must be used inside an <OnboardingProvider>');
  }
  return context;
}
