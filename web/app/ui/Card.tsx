import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-2xl bg-white dark:bg-slate-900';

  const variantStyles = {
    default: '',
    bordered: 'border border-slate-200 dark:border-slate-800',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
