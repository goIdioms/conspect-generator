import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-light text-green-200 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-lg min-h-[120px]
          bg-green-900/10 backdrop-blur-md
          border border-green-800/30
          text-white
          placeholder:text-green-300/50
          focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500
          hover:border-green-700/50
          transition-all duration-300
          resize-y
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
