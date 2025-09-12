import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
  className?: string;
}

export function PageTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  return (
    <div 
      key={pageKey}
      className={`animate-in fade-in duration-300 ${className}`}
    >
      {children}
    </div>
  );
}