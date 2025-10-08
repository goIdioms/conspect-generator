import { ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
  className?: string;
  variant?: 'row' | 'column';
}

export default function Box({ children, className = '', variant = 'row' }: BoxProps) {
  const variantStyles = {
    row: 'flex flex-row',
    column: 'flex flex-col',
  };

  return (
    <div className={`${variantStyles[variant]} gap-6 ${className}`}>
      {children}
    </div>
  );
}