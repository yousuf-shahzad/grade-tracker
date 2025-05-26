import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  viewAllLink?: { to: string; text: string };
  collapsible?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  children, 
  viewAllLink, 
  collapsible = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  return (
    <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC]">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link 
              to={viewAllLink.to} 
              className="text-sm text-[#9F7AEA] hover:text-[#B794F4] dark:text-[#B794F4] dark:hover:text-[#9F7AEA]"
            >
              {viewAllLink.text}
            </Link>
          )}
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#718096] hover:text-[#2D3748] dark:hover:text-[#F7FAFC]"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
      {isExpanded && children}
    </div>
  );
}; 