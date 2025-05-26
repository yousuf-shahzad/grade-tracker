import React, { useState } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

export const PaperCalendar: React.FC = () => {
  const { papers } = usePapers();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPapersForDay = (date: Date) => {
    return papers.filter(paper => 
      paper.completedDate && isSameDay(new Date(paper.completedDate), date)
    );
  };

  return (
    <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-[#EDF2F7] dark:hover:bg-[#4A5568] rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#4A5568] dark:text-[#A0AEC0]" />
        </button>
        <h2 className="text-lg font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-[#EDF2F7] dark:hover:bg-[#4A5568] rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-[#4A5568] dark:text-[#A0AEC0]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-[#718096] dark:text-[#A0AEC0] py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const papersForDay = getPapersForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg
                ${isCurrentMonth ? 'bg-white dark:bg-[#2D3748]' : 'bg-[#F7FAFC] dark:bg-[#1A202C]'}
                ${isCurrentDay ? 'ring-2 ring-[#9F7AEA] dark:ring-[#B794F4]' : ''}
              `}
            >
              <div className="text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {papersForDay.map(paper => (
                  <div
                    key={paper.id}
                    className="text-xs p-1 rounded bg-[#EDF2F7] dark:bg-[#4A5568] text-[#2D3748] dark:text-[#F7FAFC] truncate"
                    title={`${paper.paperName} - ${paper.percentage}%`}
                  >
                    {paper.paperName} - {paper.percentage}%
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 