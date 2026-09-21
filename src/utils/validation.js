import { fieldKey, TECH_STACK_KEY } from '../context/reducer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value) {
  if (value.trim() === '') return 'Name is required.';
  return '';
}

export function validateEmail(value) {
  if (value.trim() === '') return 'Email is required.';
  if (!EMAIL_PATTERN.test(value.trim())) {
    return 'Enter a valid email address, like name@example.com.';
  }
  return '';
}

export function validateUrl(value) {
  if (value.trim() === '') return '';
  try {
    new URL(value.trim());
    return '';
  } catch {
    return 'Enter a full URL, including https://';
  }
}

export function validateRequiredChoice(value, label) {
  if (value === '') return `${label} is required.`;
  return '';
}

export function validateTechStack(techStack) {
  if (techStack.length === 0) return 'Select at least one technology.';
  return '';
}

const STEP_FIELD_KEYS = {
  1: [
    fieldKey('personal', 'name'),
    fieldKey('personal', 'email'),
    fieldKey('personal', 'portfolioUrl'),
  ],
  2: [fieldKey('preferences', 'track'), fieldKey('preferences', 'experience')],
  3: [TECH_STACK_KEY],
  4: [],
};

export function stepFieldKeys(step) {
  return STEP_FIELD_KEYS[step] || [];
}

export function validateStep(step, formData) {
  const errors = {};

  if (step === 1) {
    const { name, email, portfolioUrl } = formData.personal;
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const urlError = validateUrl(portfolioUrl);

    if (nameError) errors[fieldKey('personal', 'name')] = nameError;
    if (emailError) errors[fieldKey('personal', 'email')] = emailError;
    if (urlError) errors[fieldKey('personal', 'portfolioUrl')] = urlError;
  }

  if (step === 2) {
    const { track, experience } = formData.preferences;
    const trackError = validateRequiredChoice(track, 'Primary track');
    const experienceError = validateRequiredChoice(experience, 'Experience level');

    if (trackError) errors[fieldKey('preferences', 'track')] = trackError;
    if (experienceError) errors[fieldKey('preferences', 'experience')] = experienceError;
  }

  if (step === 3) {
    const techStackError = validateTechStack(formData.techStack);
    if (techStackError) errors[TECH_STACK_KEY] = techStackError;
  }

  return errors;
}
