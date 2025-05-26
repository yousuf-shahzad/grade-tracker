import React from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { useSubjects } from '../../../hooks/useSubjects';

export const SubjectStats: React.FC = () => {
  const { papers } = usePapers();
  const { subjects, loading: subjectsLoading } = useSubjects();

  if (subjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-[#718096] dark:text-[#A0AEC0]">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {subjects.map(subject => {
        // Calculate performance for each subject
        const subjectPapers = papers.filter(paper => paper.subjectId === subject.id);
        const scores = subjectPapers.map(paper => paper.percentage);
        const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

        // Get recent papers
        const recentPapers = [...subjectPapers]
          .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
          .slice(0, 5);

        // Calculate topic breakdown
        const topicBreakdown = subjectPapers.reduce((breakdown, paper) => {
          paper.topicScores.forEach(topic => {
            if (!breakdown[topic.topic]) {
              breakdown[topic.topic] = {
                averageScore: 0,
                totalMarks: 0,
                achievedMarks: 0,
                count: 0
              };
            }

            const topicStats = breakdown[topic.topic];
            topicStats.totalMarks += topic.marksAvailable;
            topicStats.achievedMarks += topic.marksAchieved;
            topicStats.count += 1;
            topicStats.averageScore = (topicStats.achievedMarks / topicStats.totalMarks) * 100;
          });
          return breakdown;
        }, {} as Record<string, { averageScore: number; totalMarks: number; achievedMarks: number; count: number }>);
        
        return (
          <div key={subject.id} className="mb-8 p-6 bg-white dark:bg-[#2D3748] rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                {subject.name}
              </h2>
              <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                {subjectPapers.length} papers
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Overall Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Average</div>
                    <div className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                      {Math.round(averageScore)}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Highest</div>
                    <div className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                      {highestScore}%
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Lowest</div>
                    <div className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                      {lowestScore}%
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Topic Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(topicBreakdown).map(([topic, stats]) => (
                    <div key={topic} className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{topic}</div>
                      <div className="text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                        {Math.round(stats.averageScore)}%
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {stats.count} papers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {recentPapers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Papers</h3>
                <div className="space-y-2">
                  {recentPapers.map(paper => (
                    <div key={paper.id} className="p-3 bg-gray-50 dark:bg-[#1A202C] rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-[#2D3748] dark:text-[#F7FAFC]">
                            {paper.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(paper.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-[#2D3748] dark:text-[#F7FAFC]">
                          {paper.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 