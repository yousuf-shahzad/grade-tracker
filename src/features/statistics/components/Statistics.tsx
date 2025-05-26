import React, { useMemo } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { SUBJECTS, PAPER_TYPES } from '../../../constants/paper';
import { PaperCalendar } from '../../papers/components/PaperCalendar';
import type { PaperType } from '../../../types/paper';

export const Statistics: React.FC = () => {
  const { papers } = usePapers();

  const stats = useMemo(() => {
    // Sort papers by date
    const sortedPapers = [...papers].sort((a, b) => 
      new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime()
    );

    // Calculate overall statistics
    const overallStats = {
      totalPapers: papers.length,
      averageScore: papers.length > 0
        ? Math.round(papers.reduce((sum, paper) => sum + paper.percentage, 0) / papers.length)
        : 0,
      highestScore: papers.length > 0
        ? Math.max(...papers.map(paper => paper.percentage))
        : 0,
      lowestScore: papers.length > 0
        ? Math.min(...papers.map(paper => paper.percentage))
        : 0,
      totalRetakes: papers.filter(paper => paper.isRetake).length,
    };

    // Calculate monthly trends
    const monthlyTrends = sortedPapers.reduce((acc, paper) => {
      const date = new Date(paper.completedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          total: 0,
          count: 0,
          papers: []
        };
      }
      
      acc[monthKey].total += paper.percentage;
      acc[monthKey].count += 1;
      acc[monthKey].papers.push(paper);
      
      return acc;
    }, {} as Record<string, { total: number; count: number; papers: typeof papers }>);

    // Calculate subject performance trends
    const subjectTrends = SUBJECTS.map(subject => {
      const subjectPapers = papers.filter(paper => paper.subjectId === subject.value);
      const trend = subjectPapers.map(paper => ({
        date: new Date(paper.completedDate),
        score: paper.percentage,
        paperName: paper.paperName
      })).sort((a, b) => a.date.getTime() - b.date.getTime());

      return {
        subject: subject.label,
        trend,
        average: trend.length > 0
          ? Math.round(trend.reduce((sum, item) => sum + item.score, 0) / trend.length)
          : 0
      };
    });

    // Calculate paper type distribution
    const paperTypeDistribution = PAPER_TYPES.map(type => {
      const typePapers = papers.filter(paper => paper.paperType === type.value.toUpperCase() as PaperType);
      return {
        type: type.label,
        count: typePapers.length,
        average: typePapers.length > 0
          ? Math.round(typePapers.reduce((sum, paper) => sum + paper.percentage, 0) / typePapers.length)
          : 0
      };
    });

    return {
      overallStats,
      monthlyTrends,
      subjectTrends,
      paperTypeDistribution
    };
  }, [papers]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-6">Statistics</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
            Overall Average
          </h2>
          <p className="text-3xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
            {stats.overallStats.averageScore}%
          </p>
          <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-2">
            Based on {stats.overallStats.totalPapers} papers
          </p>
        </div>

        <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
            Score Range
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">Highest</div>
              <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                {stats.overallStats.highestScore}%
              </div>
            </div>
            <div>
              <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">Lowest</div>
              <div className="text-xl font-semibold text-red-600 dark:text-red-400">
                {stats.overallStats.lowestScore}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
            Retakes
          </h2>
          <p className="text-3xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
            {stats.overallStats.totalRetakes}
          </p>
          <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mt-2">
            Total retake attempts
          </p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-4">Monthly Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.monthlyTrends).map(([month, data]) => (
            <div key={month} className="p-4 bg-white dark:bg-[#2D3748] rounded-lg shadow">
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {new Date(month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </div>
              <div className="text-2xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
                {Math.round(data.total / data.count)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {data.count} papers
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Trends */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-4">Subject Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.subjectTrends.map(({ subject, trend, average }) => (
            <div key={subject} className="p-6 bg-white dark:bg-[#2D3748] rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{subject}</h3>
                <div className="text-xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
                  {average}%
                </div>
              </div>
              <div className="space-y-2">
                {trend.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.paperName}
                    </span>
                    <span className="font-medium text-[#2D3748] dark:text-[#F7FAFC]">
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Type Distribution */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-4">Paper Type Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.paperTypeDistribution.map(({ type, count, average }) => (
            <div key={type} className="p-4 bg-white dark:bg-[#2D3748] rounded-lg shadow">
              <div className="text-sm text-gray-500 dark:text-gray-400">{type}</div>
              <div className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                {average}%
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {count} papers
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Calendar */}
      <div>
        <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-4">
          Paper Completion Calendar
        </h2>
        <PaperCalendar />
      </div>
    </div>
  );
}; 