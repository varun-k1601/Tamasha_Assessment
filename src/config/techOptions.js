export const TRACK_OPTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Fullstack' },
  { value: 'uiux', label: 'UI/UX Design' },
];

export const EXPERIENCE_OPTIONS = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
];

const FRONTEND_TECH = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'css-modules', label: 'CSS Modules' },
];

const BACKEND_TECH = [
  { value: 'node', label: 'Node.js' },
  { value: 'django', label: 'Python/Django' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'redis', label: 'Redis' },
];

const UIUX_TECH = [
  { value: 'figma', label: 'Figma' },
  { value: 'storybook', label: 'Storybook' },
  { value: 'design-systems', label: 'Design Systems' },
];

export const TECH_OPTIONS_BY_TRACK = {
  frontend: FRONTEND_TECH,
  backend: BACKEND_TECH,
  uiux: UIUX_TECH,
  fullstack: [...FRONTEND_TECH, ...BACKEND_TECH],
};

export function getTechOptions(track) {
  return TECH_OPTIONS_BY_TRACK[track] || [];
}

export function labelFor(options, value) {
  const match = options.find((option) => option.value === value);
  return match ? match.label : '';
}
