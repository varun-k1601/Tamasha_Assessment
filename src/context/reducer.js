export const TOTAL_STEPS = 4;

export const TECH_STACK_KEY = 'techStack';

export const fieldKey = (section, field) => `${section}.${field}`;

export const initialState = {
  currentStep: 1,
  formData: {
    personal: { name: '', email: '', portfolioUrl: '' },
    preferences: { track: '', experience: '' },
    techStack: [],
  },
  errors: {},
  touched: {},
  isDraftSaved: false,
  isSubmitted: false,
};

export const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_PREFERENCE: 'SET_PREFERENCE',
  TOGGLE_TECH: 'TOGGLE_TECH',
  TOUCH_FIELD: 'TOUCH_FIELD',
  TOUCH_STEP_FIELDS: 'TOUCH_STEP_FIELDS',
  SET_ERRORS: 'SET_ERRORS',
  GO_TO_STEP: 'GO_TO_STEP',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  DRAFT_SAVED: 'DRAFT_SAVED',
  HIDE_DRAFT_SAVED: 'HIDE_DRAFT_SAVED',
  SUBMIT: 'SUBMIT',
};

function withoutKey(map, key) {
  if (!(key in map)) return map;
  const next = { ...map };
  delete next[key];
  return next;
}

function clampStep(step) {
  if (step < 1) return 1;
  if (step > TOTAL_STEPS) return TOTAL_STEPS;
  return step;
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FIELD: {
      const { section, field, value } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [section]: { ...state.formData[section], [field]: value },
        },
      };
    }

    case ACTIONS.SET_PREFERENCE: {
      const { field, value } = action.payload;
      const previousTrack = state.formData.preferences.track;
      const trackChanged = field === 'track' && value !== previousTrack;

      return {
        ...state,
        formData: {
          ...state.formData,
          preferences: { ...state.formData.preferences, [field]: value },
          techStack: trackChanged ? [] : state.formData.techStack,
        },
        errors: trackChanged
          ? withoutKey(state.errors, TECH_STACK_KEY)
          : state.errors,
        touched: trackChanged
          ? withoutKey(state.touched, TECH_STACK_KEY)
          : state.touched,
      };
    }

    case ACTIONS.TOGGLE_TECH: {
      const { id } = action.payload;
      const current = state.formData.techStack;
      const nextTechStack = current.includes(id)
        ? current.filter((techId) => techId !== id)
        : [...current, id];

      return {
        ...state,
        formData: { ...state.formData, techStack: nextTechStack },
      };
    }

    case ACTIONS.TOUCH_FIELD: {
      const { key } = action.payload;
      return { ...state, touched: { ...state.touched, [key]: true } };
    }

    case ACTIONS.TOUCH_STEP_FIELDS: {
      const { keys } = action.payload;
      const touched = { ...state.touched };
      keys.forEach((key) => {
        touched[key] = true;
      });
      return { ...state, touched };
    }

    case ACTIONS.SET_ERRORS: {
      return { ...state, errors: action.payload.errors };
    }

    case ACTIONS.GO_TO_STEP: {
      return { ...state, currentStep: clampStep(action.payload.step) };
    }

    case ACTIONS.NEXT_STEP: {
      return { ...state, currentStep: clampStep(state.currentStep + 1) };
    }

    case ACTIONS.PREV_STEP: {
      return { ...state, currentStep: clampStep(state.currentStep - 1) };
    }

    case ACTIONS.DRAFT_SAVED: {
      return { ...state, isDraftSaved: true };
    }

    case ACTIONS.HIDE_DRAFT_SAVED: {
      return { ...state, isDraftSaved: false };
    }

    case ACTIONS.SUBMIT: {
      return { ...state, isSubmitted: true };
    }

    default:
      return state;
  }
}
