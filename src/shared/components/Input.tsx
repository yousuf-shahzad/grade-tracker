import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'block border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] placeholder-[#A0AEC0] dark:placeholder-[#718096] text-sm font-medium px-3 py-2 transition-colors duration-200';
  const width = fullWidth ? 'w-full' : '';

  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0]">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${width} ${error ? 'border-red-300 dark:border-red-700' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}; 