import './CheckboxGroup.css';

export default function CheckboxGroup({
  id,
  legend,
  options,
  selectedValues,
  error,
  touched,
  onToggle,
  onBlur,
  required = false,
}) {
  const showError = Boolean(touched && error);
  const errorId = `${id}-error`;

  return (
    <fieldset
      className="checkbox-group"
      aria-invalid={showError ? 'true' : undefined}
      aria-describedby={showError ? errorId : undefined}
    >
      <legend className="checkbox-group__legend">
        {legend}
        {required && (
          <span className="checkbox-group__required" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="checkbox-group__options">
        {options.map((option) => (
          <label className="checkbox-group__option" key={option.value}>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => onToggle(option.value)}
              onBlur={onBlur}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      {showError && (
        <p className="checkbox-group__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
