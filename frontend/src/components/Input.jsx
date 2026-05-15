import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, className = '', id, hint, type = 'text', as = 'input', children, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const Tag = as;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <Tag
        id={inputId}
        ref={ref}
        type={Tag === 'input' ? type : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-err` : undefined}
        className={`input-base ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        {...rest}
      >
        {children}
      </Tag>
      {error ? (
        <p id={`${inputId}-err`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
