import React, { useMemo, useState } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { getSubjectName } from '../../../utils/subjectUtils';
import { getPaperTypeName } from '../../../utils/paperUtils';
import type { Paper } from '../../../types';
import { Link } from 'react-router-dom';
import { Button } from '../../../shared/components/Button';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Common card styles
const cardStyles = "bg-white dark:bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#E2E8F0] dark:border-[#4A5568]";
const cardHeaderStyles = "flex items-center justify-between mb-4";
const cardTitleStyles = "text-xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]";
const linkStyles = "text-[#9F7AEA] hover:text-[#805AD5] dark:text-[#B794F4] dark:hover:text-[#9F7AEA]";
const itemStyles = "flex items-center justify-between p-3 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg";
const labelStyles = "text-[#718096] dark:text-[#A0AEC0]";
const valueStyles = "font-medium text-[#2D3748] dark:text-[#F7FAFC]";

interface WeakTopic {
  topic: string;
  average: number;
}

interface SubjectStats {
  total: number;
  count: number;
  highest: number;
  lowest: number;
  recentImprovement: number;
  papers: Paper[];
  weakTopics?: WeakTopic[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface StudyGoal {
  id: string;
  subjectId: string;
  targetScore: number;
  deadline: Date;
  completed: boolean;
}

interface TopicAnalysis {
  topic: string;
  trend: number;
  papers: number;
  averageScore: number;
  improvement: number;
}

// Reusable components
const StatCard: React.FC<{
  title: string;
  children: React.ReactNode;
  viewAllLink?: { to: string; text: string };
  collapsible?: boolean;
}> = ({ title, children, viewAllLink, collapsible }) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  return (
    <div className={cardStyles}>
      <div className={cardHeaderStyles}>
        <h2 className={cardTitleStyles}>{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link to={viewAllLink.to} className={linkStyles}>
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

const StatItem: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number;
}> = ({ label, value, subtext, trend }) => (
  <div className="flex justify-between items-center">
    <span className={labelStyles}>{label}</span>
    <div className="text-right">
      <div className={valueStyles}>
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

const ProgressChart: React.FC<{
  data: { date: Date; score: number }[];
  title: string;
}> = ({ data, title }) => {
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));

  return (
    <div className="h-32 relative">
      <div className="absolute inset-0 flex items-end">
        {data.map((point, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center"
            style={{
              height: `${((point.score - minScore) / (maxScore - minScore)) * 100}%`
            }}
          >
            <div className="w-full bg-[#9F7AEA] rounded-t-sm" />
            <div className="text-xs text-[#718096] mt-1">
              {point.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementBadge: React.FC<{
  achievement: Achievement;
}> = ({ achievement }) => (
  <div className={`p-4 rounded-lg ${achievement.unlocked ? 'bg-[#9F7AEA]' : 'bg-[#E2E8F0] dark:bg-[#4A5568]'}`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-white' : 'bg-[#CBD5E0]'}`}>
        {achievement.icon}
      </div>
      <div>
        <h3 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-[#2D3748] dark:text-[#F7FAFC]'}`}>
          {achievement.title}
        </h3>
        <p className={`text-sm ${achievement.unlocked ? 'text-white/90' : 'text-[#718096] dark:text-[#A0AEC0]'}`}>
          {achievement.description}
        </p>
      </div>
    </div>
  </div>
);

const StudyGoalItem: React.FC<{
  goal: StudyGoal;
  onComplete: (id: string) => void;
}> = ({ goal, onComplete }) => (
  <div className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC]">
          {getSubjectName(goal.subjectId)}
        </h3>
        <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
          Target: {goal.targetScore}% by {goal.deadline.toLocaleDateString()}
        </p>
      </div>
      {!goal.completed && (
        <Button
          variant="secondary"
          onClick={() => onComplete(goal.id)}
          className="text-sm"
        >
          Mark Complete
        </Button>
      )}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { papers, loading, error } = usePapers();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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

  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'first_paper',
      title: 'First Paper',
      description: 'Completed your first paper',
      icon: <AcademicCapIcon className="h-6 w-6 text-[#9F7AEA]" />,
      unlocked: papers.length > 0
    },
    {
      id: 'consistent',
      title: 'Consistent Performer',
      description: 'Maintained above 80% for 3 papers',
      icon: <ChartBarIcon className="h-6 w-6 text-[#9F7AEA]" />,
      unlocked: papers.filter(p => (p.achievedMarks / p.totalMarks) * 100 >= 80).length >= 3
    },
    {
      id: 'improvement',
      title: 'Rising Star',
      description: 'Improved by 10% in any subject',
      icon: <TrophyIcon className="h-6 w-6 text-[#9F7AEA]" />,
      unlocked: Object.values(stats?.subjectStats || {}).some(s => s.recentImprovement >= 10)
    }
  ], [papers, stats]);

  const studyGoals: StudyGoal[] = useMemo(() => [
    {
      id: 'math_goal',
      subjectId: 'MATHS',
      targetScore: 85,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      completed: false
    },
    {
      id: 'further_math_goal',
      subjectId: 'FURTHER_MATHS',
      targetScore: 80,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      completed: false
    }
  ], []);

  const handleGoalComplete = (goalId: string) => {
    // Implement goal completion logic
    console.log('Goal completed:', goalId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9F7AEA]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <AcademicCapIcon className="h-16 w-16 text-[#9F7AEA] mb-4" />
        <h1 className="text-2xl font-bold text-[#2D3748] dark:text-[#F7FAFC] mb-2">Welcome to Your Grade Tracker!</h1>
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#9F7AEA] to-[#B794F4] rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-lg opacity-90">
          You've completed {stats.totalPapers} papers with an average score of {stats.averagePercentage}%. Keep up the great work!
        </p>
      </div>

      {/* Quick Stats with Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(stats.subjectStats).map(([subjectId, stats]) => (
          <StatCard key={subjectId} title={getSubjectName(subjectId)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <StatItem label="Average" value={`${Math.round(stats.total / stats.count)}%`} />
                <StatItem label="Highest" value={`${stats.highest}%`} />
                <StatItem label="Lowest" value={`${stats.lowest}%`} />
                {stats.recentImprovement !== 0 && (
                  <StatItem 
                    label="Recent Trend" 
                    value={`${stats.recentImprovement > 0 ? '+' : ''}${stats.recentImprovement}%`}
                    trend={stats.recentImprovement}
                  />
                )}
              </div>
              <ProgressChart
                data={stats.papers
                  .sort((a, b) => a.completedDate.getTime() - b.completedDate.getTime())
                  .map(p => ({
                    date: p.completedDate,
                    score: (p.achievedMarks / p.totalMarks) * 100
                  }))}
                title="Progress"
              />
            </div>
          </StatCard>
        ))}
      </div>

      {/* Achievements */}
      <StatCard title="Achievements" collapsible>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </StatCard>

      {/* Study Goals */}
      <StatCard title="Study Goals" collapsible>
        <div className="space-y-4">
          {studyGoals.map(goal => (
            <StudyGoalItem
              key={goal.id}
              goal={goal}
              onComplete={handleGoalComplete}
            />
          ))}
        </div>
      </StatCard>

      {/* Recent Papers and Top Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Recent Papers */}
        <StatCard 
          title="Recent Papers" 
          viewAllLink={{ to: "/papers", text: "View All" }}
        >
          <div className="space-y-4">
            {stats.recentPapers.map((paper) => (
              <div key={paper.id} className={itemStyles}>
                <div>
                  <h3 className={valueStyles}>{paper.paperName}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    {getSubjectName(paper.subjectId)} • {getPaperTypeName(paper.paperType)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={valueStyles}>
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
              <div key={topic.topic} className={itemStyles}>
                <div>
                  <h3 className={valueStyles}>{topic.topic}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    {topic.count} papers completed
                  </p>
                </div>
                <div className="text-right">
                  <div className={valueStyles}>{topic.averageScore}%</div>
                  <div className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                    Average Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      {/* Interactive Topic Analysis */}
      <StatCard title="Topic Analysis" collapsible>
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
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <span className="text-sm text-[#718096] dark:text-[#A0AEC0]">{topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-500">{average}%</span>
                      <ChartBarIcon className="h-4 w-4 text-[#9F7AEA]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StatCard>

      {/* Study Tips and Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Study Tips */}
        <StatCard title="Study Tips">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
              <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-2">Focus on Weak Areas</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Review your lowest scoring topics and dedicate more time to practicing these areas.
              </p>
            </div>
            <div className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
              <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-2">Regular Practice</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Aim to complete at least one practice paper per week to maintain momentum.
              </p>
            </div>
            <div className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
              <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-2">Track Progress</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Monitor your improvement over time and celebrate your achievements!
              </p>
            </div>
          </div>
        </StatCard>

        {/* Weak Areas */}
        <StatCard title="Areas for Improvement">
          <div className="space-y-4">
            {Object.entries(stats.subjectStats).map(([subjectId, stats]) => (
              <div key={subjectId} className="p-4 bg-[#F7FAFC] dark:bg-[#4A5568] rounded-lg">
                <h3 className="font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-2">
                  {getSubjectName(subjectId)}
                </h3>
                <div className="space-y-2">
                  {stats.weakTopics?.map(({ topic, average }) => (
                    <div key={topic} className="flex justify-between items-center">
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
    </div>
  );
}; 