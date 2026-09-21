import './RadioGroup.css';

export default function RadioGroup({
  id,
  legend,
  name,
  options,
  value,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
}) {
  const showError = Boolean(touched && error);
  const errorId = `${id}-error`;

  return (
    <fieldset
      className="radio-group"
      role="radiogroup"
      aria-required={required ? 'true' : undefined}
      aria-invalid={showError ? 'true' : undefined}
      aria-describedby={showError ? errorId : undefined}
    >
      <legend className="radio-group__legend">
        {legend}
        {required && (
          <span className="radio-group__required" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="radio-group__options">
        {options.map((option) => (
          <label className="radio-group__option" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {showError && (
        <p className="radio-group__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
