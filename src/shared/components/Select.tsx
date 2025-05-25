import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: Option[];
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  fullWidth = false,
  className = '',
  onChange,
  ...props
}) => {
  const baseStyles = 'block border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 transition-colors duration-200';
  const width = fullWidth ? 'w-full' : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0]">
          {label}
        </label>
      )}
      <select
        className={`${baseStyles} ${width} ${error ? 'border-red-300 dark:border-red-700' : ''} ${className}`}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}; 