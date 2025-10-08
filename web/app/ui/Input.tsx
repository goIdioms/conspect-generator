import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white dark:bg-slate-800
          border border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
