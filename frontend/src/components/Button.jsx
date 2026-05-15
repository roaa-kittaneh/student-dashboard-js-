import { forwardRef } from 'react';

const VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
  secondary:
    'bg-white dark:bg-navy-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`btn-base ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  );
});

export default Button;
