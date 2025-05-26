import React from 'react';

interface StatItemProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, subtext, trend }) => (
  <div className="flex justify-between items-center">
    <span className="text-[#718096] dark:text-[#A0AEC0]">{label}</span>
    <div className="text-right">
      <div className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">
        {value}
        {trend !== undefined && (
          <span className={`ml-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {subtext && <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">{subtext}</div>}
    </div>
  </div>
); 