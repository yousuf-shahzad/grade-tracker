import React, { useMemo } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { SUBJECTS, PAPER_TYPES } from '../../../constants/paper';
import type { Paper } from '../../../types';

export const SubjectStats: React.FC = () => {
  const { papers } = usePapers();

  const subjectStats = useMemo(() => {
    return SUBJECTS.map(subject => {
      const subjectPapers = papers.filter(paper => paper.subjectId === subject.value);
      
      // Calculate averages by paper type
      const paperTypeAverages = PAPER_TYPES.map(type => {
        const typePapers = subjectPapers.filter(paper => paper.paperType === type.value);
        const average = typePapers.length > 0
          ? typePapers.reduce((sum, paper) => sum + paper.percentage, 0) / typePapers.length
          : 0;
        
        return {
          type: type.label,
          average: Math.round(average),
          count: typePapers.length
        };
      });

      // Calculate topic averages
      const topicAverages = new Map<string, { total: number; count: number }>();
      
      subjectPapers.forEach(paper => {
        paper.topicScores.forEach(topic => {
          const existing = topicAverages.get(topic.topic) || { total: 0, count: 0 };
          const percentage = (topic.marksAchieved / topic.marksAvailable) * 100;
          topicAverages.set(topic.topic, {
            total: existing.total + percentage,
            count: existing.count + 1
          });
        });
      });

      const topicStats = Array.from(topicAverages.entries()).map(([topic, { total, count }]) => ({
        topic,
        average: Math.round(total / count),
        count
      }));

      // Calculate overall subject average
      const overallAverage = subjectPapers.length > 0
        ? Math.round(subjectPapers.reduce((sum, paper) => sum + paper.percentage, 0) / subjectPapers.length)
        : 0;

      return {
        subject: subject.label,
        overallAverage,
        paperCount: subjectPapers.length,
        paperTypeAverages,
        topicStats
      };
    });
  }, [papers]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-6">Subject Statistics</h1>
      
      {subjectStats.map(({ subject, overallAverage, paperCount, paperTypeAverages, topicStats }) => (
        <div key={subject} className="mb-8 p-6 bg-white dark:bg-[#2D3748] rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">{subject}</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
                {overallAverage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {paperCount} papers
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Paper Type Averages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paperTypeAverages.map(({ type, average, count }) => (
                <div key={type} className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
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

          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Topic Averages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicStats.map(({ topic, average, count }) => (
                <div key={topic} className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{topic}</div>
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
        </div>
      ))}
    </div>
  );
}; 