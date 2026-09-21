import { useEffect, useRef } from 'react';
import { ACTIONS, TOTAL_STEPS } from '../context/reducer';
import useDebouncedEffect from './useDebouncedEffect';

export const DRAFT_STORAGE_KEY = 'onboarding-draft-v1';

const SAVE_DELAY_MS = 500;
const BADGE_VISIBLE_MS = 2000;

function draftFrom(state) {
  return { currentStep: state.currentStep, formData: state.formData };
}

export function loadDraft(fallbackState) {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return fallbackState;

    const draft = JSON.parse(raw);
    const savedStep = Number(draft.currentStep);
    const savedFormData = draft.formData || {};

    return {
      ...fallbackState,
      currentStep:
        savedStep >= 1 && savedStep <= TOTAL_STEPS
          ? savedStep
          : fallbackState.currentStep,
      formData: {
        personal: { ...fallbackState.formData.personal, ...savedFormData.personal },
        preferences: {
          ...fallbackState.formData.preferences,
          ...savedFormData.preferences,
        },
        techStack: Array.isArray(savedFormData.techStack)
          ? savedFormData.techStack
          : [],
      },
    };
  } catch {
    return fallbackState;
  }
}

function saveDraft(state) {
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftFrom(state)));
    return true;
  } catch {
    return false;
  }
}

export function useDraftAutoSave(state, dispatch) {
  const mountedWith = useRef({
    formData: state.formData,
    currentStep: state.currentStep,
  });

  useDebouncedEffect(
    () => {
      const nothingChangedYet =
        state.formData === mountedWith.current.formData &&
        state.currentStep === mountedWith.current.currentStep;
      if (nothingChangedYet) return;

      if (saveDraft(state)) {
        dispatch({ type: ACTIONS.DRAFT_SAVED });
      }
    },
    [state.formData, state.currentStep],
    SAVE_DELAY_MS
  );

  useEffect(() => {
    if (!state.isDraftSaved) return undefined;

    const timeoutId = setTimeout(
      () => dispatch({ type: ACTIONS.HIDE_DRAFT_SAVED }),
      BADGE_VISIBLE_MS
    );
    return () => clearTimeout(timeoutId);
  }, [state.isDraftSaved, dispatch]);
}
