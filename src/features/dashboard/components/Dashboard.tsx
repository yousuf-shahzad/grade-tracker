import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePapers } from '../../../hooks/usePapers';
import { Button } from '../../../components/ui/Button';
import { DashboardStats } from './DashboardStats';
import { SubjectPerformance } from './SubjectPerformance';
import { StatCard } from './StatCard';
import { getSubjectName } from '../../../utils/subjectUtils';
import { getPaperTypeName } from '../../../utils/paperUtils';
import type { SubjectStats } from '../../../types/subjects';

export const Dashboard: React.FC = () => {
  const { papers } = usePapers();

  const stats = useMemo(() => {
    if (!papers.length) return null;

    const totalPapers = papers.length;
    const totalMarks = papers.reduce((sum, paper) => sum + paper.achievedMarks, 0);
    const totalPossibleMarks = papers.reduce((sum, paper) => sum + paper.totalMarks, 0);
    const averagePercentage = Math.round((totalMarks / totalPossibleMarks) * 100);

    // Calculate subject averages
    const subjectStats = papers.reduce((acc, paper) => {
      if (!acc[paper.subjectId]) {
        acc[paper.subjectId] = {
          total: 0,
          count: 0,
          highest: 0,
          lowest: 100,
          recentImprovement: 0,
          papers: []
        };
      }
      const percentage = Math.round((paper.achievedMarks / paper.totalMarks) * 100);
      acc[paper.subjectId].total += percentage;
      acc[paper.subjectId].count += 1;
      acc[paper.subjectId].highest = Math.max(acc[paper.subjectId].highest, percentage);
      acc[paper.subjectId].lowest = Math.min(acc[paper.subjectId].lowest, percentage);
      acc[paper.subjectId].papers.push(paper);
      return acc;
    }, {} as Record<string, SubjectStats>);

    // Calculate recent improvement and identify weak topics
    Object.keys(subjectStats).forEach(subjectId => {
      const subjectPapers = subjectStats[subjectId].papers
        .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime());
      
      if (subjectPapers.length >= 6) {
        const recentAvg = subjectPapers
          .slice(0, 3)
          .reduce((sum, p) => sum + (p.achievedMarks / p.totalMarks) * 100, 0) / 3;
        const previousAvg = subjectPapers
          .slice(3, 6)
          .reduce((sum, p) => sum + (p.achievedMarks / p.totalMarks) * 100, 0) / 3;
        subjectStats[subjectId].recentImprovement = Math.round(recentAvg - previousAvg);
      }

      // Calculate weak topics
      const topicScores = subjectPapers.reduce((acc, paper) => {
        paper.topicScores.forEach(topic => {
          if (!acc[topic.topic]) {
            acc[topic.topic] = { total: 0, count: 0 };
          }
          acc[topic.topic].total += topic.score;
          acc[topic.topic].count += 1;
        });
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      subjectStats[subjectId].weakTopics = Object.entries(topicScores)
        .map(([topic, { total, count }]) => ({
          topic,
          average: Math.round(total / count)
        }))
        .sort((a, b) => a.average - b.average)
        .slice(0, 3);
    });

    // Get most common topics
    const topicStats = papers.reduce((acc, paper) => {
      paper.topicScores.forEach(topic => {
        if (!acc[topic.topic]) {
          acc[topic.topic] = {
            count: 0,
            totalScore: 0,
            averageScore: 0
          };
        }
        acc[topic.topic].count += 1;
        acc[topic.topic].totalScore += topic.score;
        acc[topic.topic].averageScore = Math.round(acc[topic.topic].totalScore / acc[topic.topic].count);
      });
      return acc;
    }, {} as Record<string, { count: number; totalScore: number; averageScore: number }>);

    // Sort topics by count and get top 3
    const topTopics = Object.entries(topicStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([topic, stats]) => ({
        topic,
        ...stats
      }));

    // Get recent papers (last 5)
    const recentPapers = papers
      .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
      .slice(0, 5);

    return {
      totalPapers,
      averagePercentage,
      subjectStats,
      topTopics,
      recentPapers
    };
  }, [papers]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-[#2D3748] dark:text-[#F7FAFC] mb-2">Welcome to Meritum!</h1>
        <p className="text-[#718096] dark:text-[#A0AEC0] mb-6 max-w-md">
          Start tracking your academic progress by adding your first paper result. This will help you monitor your performance and identify areas for improvement.
        </p>
        <Link to="/papers/new">
          <Button variant="primary">Add Your First Paper</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardStats 
        totalPapers={stats.totalPapers}
        averagePercentage={stats.averagePercentage}
      />

      <SubjectPerformance subjectStats={stats.subjectStats} />

      {/* Recent Papers and Top Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Recent Papers */}
        <StatCard 
          title="Recent Papers" 
          viewAllLink={{ to: "/papers", text: "View All" }}
        >
          <div className="space-y-4">
            {stats.recentPapers.map((paper) => (
              <div key={paper.id} className="flex justify-between items-center p-3 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
                <div>
                  <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">{paper.paperName}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    {getSubjectName(paper.subjectId)} • {getPaperTypeName(paper.paperType)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">
                    {Math.round((paper.achievedMarks / paper.totalMarks) * 100)}%
                  </div>
                  <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    {paper.achievedMarks}/{paper.totalMarks} marks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Top Topics */}
        <StatCard 
          title="Top Topics" 
          viewAllLink={{ to: "/statistics", text: "View Details" }}
        >
          <div className="space-y-4">
            {stats.topTopics.map((topic) => (
              <div key={topic.topic} className="flex justify-between items-center p-3 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
                <div>
                  <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">{topic.topic}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    {topic.count} papers completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">{topic.averageScore}%</div>
                  <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    Average Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      {/* Weak Areas */}
      <StatCard title="Areas for Improvement" collapsible>
        <div className="space-y-4">
          {Object.entries(stats.subjectStats).map(([subjectId, stats]) => (
            <div key={subjectId} className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
              <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-2">
                {getSubjectName(subjectId)}
              </h3>
              <div className="space-y-2">
                {stats.weakTopics?.map(({ topic, average }) => (
                  <div
                    key={topic}
                    className="flex justify-between items-center cursor-pointer hover:bg-[#EDF2F7] dark:hover:bg-[#2D3748] p-2 rounded"
                  >
                    <span className="text-sm text-[#718096] dark:text-[#A0AEC0]">{topic}</span>
                    <span className="text-sm font-medium text-red-500">{average}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StatCard>
    </div>
  );
}; 