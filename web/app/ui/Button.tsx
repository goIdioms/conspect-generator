import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-medium transition-all duration-300 transform disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg',
  };

  const disabledStyles = loading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
