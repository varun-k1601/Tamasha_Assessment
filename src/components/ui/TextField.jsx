import './TextField.css';

export default function TextField({
  id,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  hint,
  required = false,
}) {
  const showError = Boolean(touched && error);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint ? hintId : null, showError ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}

      <input
        id={id}
        className={'field__input' + (showError ? ' field__input--invalid' : '')}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required ? 'true' : undefined}
        aria-invalid={showError ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
      />

      {showError && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
