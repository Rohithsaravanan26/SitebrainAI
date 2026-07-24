import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: React.FC<HeadingProps> = ({ level = 2, className, children, ...props }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const styles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: 'text-2xl font-bold tracking-tight text-slate-900 dark:text-white',
    2: 'text-xl font-semibold tracking-tight text-slate-900 dark:text-white',
    3: 'text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100',
    4: 'text-base font-medium text-slate-900 dark:text-slate-100',
    5: 'text-sm font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300',
    6: 'text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400',
  };

  return (
    <Tag className={cn(styles[level], className)} {...props}>
      {children}
    </Tag>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg';
  variant?: 'default' | 'muted' | 'subtle' | 'danger';
}

export const Text: React.FC<TextProps> = ({
  size = 'sm',
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const sizes: Record<'xs' | 'sm' | 'base' | 'lg', string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const variants: Record<'default' | 'muted' | 'subtle' | 'danger', string> = {
    default: 'text-slate-800 dark:text-slate-200',
    muted: 'text-slate-600 dark:text-slate-400',
    subtle: 'text-slate-500 dark:text-slate-500',
    danger: 'text-red-700 dark:text-red-400',
  };

  return (
    <p className={cn(sizes[size], variants[variant], className)} {...props}>
      {children}
    </p>
  );
};

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, children, ...props }) => (
  <code
    className={cn(
      'font-mono text-xs px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
      className
    )}
    {...props}
  >
    {children}
  </code>
);
