import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#9F7AEA] dark:bg-[#B794F4] text-white hover:bg-[#805AD5] dark:hover:bg-[#9F7AEA] focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4]',
    secondary: 'bg-white dark:bg-[#2D3748] text-[#718096] dark:text-[#A0AEC0] border border-[#E2E8F0] dark:border-[#4A5568] hover:bg-[#F7FAFC] dark:hover:bg-[#4A5568] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}; 