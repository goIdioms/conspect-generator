import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-light text-green-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-green-900/10 backdrop-blur-md
          border border-green-800/30
          text-white
          placeholder:text-green-300/50
          focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
          hover:border-green-700/50
          transition-all duration-300
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
