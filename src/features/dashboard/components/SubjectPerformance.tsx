import React, { useMemo } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { useSubjects } from '../../../hooks/useSubjects';

export const SubjectPerformance: React.FC = () => {
  const { papers } = usePapers();
  const { subjects, loading: subjectsLoading } = useSubjects();

  // Calculate performance for all subjects
  const performances = useMemo(() => 
    subjects.map(subject => {
      const subjectPapers = papers.filter(paper => paper.subjectId === subject.id);
      const scores = subjectPapers.map(paper => paper.percentage);
      const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

      // Get recent papers
      const recentPapers = [...subjectPapers]
        .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
        .slice(0, 5);

      return {
        subject,
        performance: {
          averageScore,
          highestScore,
          lowestScore,
          totalPapers: subjectPapers.length,
          recentPapers
        }
      };
    }),
    [subjects, papers]
  );

  if (subjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-[#718096] dark:text-[#A0AEC0]">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {performances.map(({ subject, performance }) => (
        <div key={subject.id} className="p-6 bg-white dark:bg-[#2D3748] rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
              {subject.name}
            </h2>
            <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">
              {performance.totalPapers} papers
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average</div>
                <div className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                  {Math.round(performance.averageScore)}%
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Highest</div>
                <div className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                  {performance.highestScore}%
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Lowest</div>
                <div className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                  {performance.lowestScore}%
                </div>
              </div>
            </div>

            {performance.recentPapers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Papers</h3>
                <div className="space-y-2">
                  {performance.recentPapers.map(paper => (
                    <div key={paper.id} className="p-2 bg-gray-50 dark:bg-[#1A202C] rounded">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-[#2D3748] dark:text-[#F7FAFC]">
                          {paper.title}
                        </div>
                        <div className="text-sm font-medium text-[#2D3748] dark:text-[#F7FAFC]">
                          {paper.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 