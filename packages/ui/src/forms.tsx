import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Label Component
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', isInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={isInvalid}
        className={cn(
          'flex h-9 w-full rounded-sm border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-3 py-1 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid && 'border-red-600 focus-visible:ring-red-600 dark:border-red-500',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isInvalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isInvalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={isInvalid}
        className={cn(
          'flex min-h-[80px] w-full rounded-sm border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid && 'border-red-600 focus-visible:ring-red-600',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isInvalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, isInvalid, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={isInvalid}
        className={cn(
          'flex h-9 w-full rounded-sm border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 px-3 py-1 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid && 'border-red-600',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

// Checkbox Component
export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      'h-4 w-4 rounded-sm border border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500 dark:bg-slate-900 accent-orange-600 cursor-pointer',
      className
    )}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

// Form Item Wrapper
export const FormItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('space-y-1.5', className)} {...props} />;

export const FormHelperText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => <p className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props} />;

export const FormErrorMessage: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn('text-xs font-medium text-red-600 dark:text-red-400', className)} {...props} />
);
