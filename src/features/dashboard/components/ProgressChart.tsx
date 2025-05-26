import React from 'react';

interface DataPoint {
  date: Date;
  score: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const range = maxScore - minScore;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <div className="h-32 relative">
        <div className="absolute inset-0 flex items-end">
          {data.map((point, index) => {
            const height = ((point.score - minScore) / range) * 100;
            return (
              <div
                key={index}
                className="flex-1 mx-0.5 bg-[#9F7AEA] dark:bg-[#B794F4] rounded-t"
                style={{ height: `${height}%` }}
                title={`${point.date.toLocaleDateString()}: ${Math.round(point.score)}%`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{data[0].date.toLocaleDateString()}</span>
        <span>{data[data.length - 1].date.toLocaleDateString()}</span>
      </div>
    </div>
  );
}; 