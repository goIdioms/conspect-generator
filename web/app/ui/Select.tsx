import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-light text-green-200 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-lg
          bg-green-900/10 backdrop-blur-md
          border border-green-800/30
          text-white
          focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
          hover:border-green-700/50
          transition-all duration-300
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-black text-green-200">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
