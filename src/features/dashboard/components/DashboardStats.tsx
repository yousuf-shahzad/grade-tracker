import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  totalPapers: number;
  averagePercentage: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ totalPapers, averagePercentage }) => {
  return (
    <div className="bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] rounded-2xl p-8 mb-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <AcademicCapIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
      </div>
      <p className="text-lg opacity-90">
        You've completed {totalPapers} papers with an average score of {averagePercentage}%. Keep up the great work!
      </p>
    </div>
  );
}; 