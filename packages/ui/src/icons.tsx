import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as LucideIcons from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 'md', title, className, ...props }) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons.`);
    return null;
  }

  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <IconComponent
      aria-hidden={!title}
      role={title ? 'img' : undefined}
      className={cn(sizes[size], 'shrink-0', className)}
      {...props}
    >
      {title && <title>{title}</title>}
    </IconComponent>
  );
};
