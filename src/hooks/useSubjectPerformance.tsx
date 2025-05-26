import { useMemo } from 'react';
import type { Paper } from '../types';
import type { Subject } from '../types/subject';

interface SubjectPerformance {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalPapers: number;
  recentPapers: Paper[];
  topicBreakdown: {
    [topic: string]: {
      averageScore: number;
      totalMarks: number;
      achievedMarks: number;
      count: number;
    };
  };
}

export const useSubjectPerformance = (papers: Paper[], subject: Subject) => {
  return useMemo(() => {
    // Filter papers for this subject
    const subjectPapers = papers.filter(paper => paper.subjectId === subject.id);
    
    if (subjectPapers.length === 0) {
      return {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalPapers: 0,
        recentPapers: [],
        topicBreakdown: {}
      };
    }

    // Calculate overall statistics
    const scores = subjectPapers.map(paper => paper.percentage);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // Get recent papers (last 5)
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
    }, {} as SubjectPerformance['topicBreakdown']);

    return {
      averageScore,
      highestScore,
      lowestScore,
      totalPapers: subjectPapers.length,
      recentPapers,
      topicBreakdown
    };
  }, [papers, subject.id]);
}; 