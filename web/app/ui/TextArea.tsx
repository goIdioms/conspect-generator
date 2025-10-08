import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-xl min-h-[120px]
          bg-white dark:bg-slate-800
          border border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          resize-y
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
