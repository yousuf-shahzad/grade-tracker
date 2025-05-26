import { SubjectId } from './subjects';

export type PaperType = 'EXAM' | 'TEST' | 'ASSIGNMENT' | 'COURSEWORK';
export type MathsPaperType = 'PURE' | 'STATS' | 'MECHANICS';
export type FurtherMathsPaperType = 'CORE_PURE_1' | 'CORE_PURE_2' | 'FURTHER_STATS' | 'FURTHER_MECHANICS';
export type ExamSeries = 'MAY_JUNE_2017' | 'OCT_NOV_2017' | 'MAY_JUNE_2018' | 'OCT_NOV_2018' | 'MAY_JUNE_2019' | 'OCT_NOV_2019' | 'MAY_JUNE_2020' | 'OCT_NOV_2020' | 'MAY_JUNE_2021' | 'OCT_NOV_2021' | 'MAY_JUNE_2022' | 'OCT_NOV_2022' | 'MAY_JUNE_2023' | 'OCT_NOV_2023' | 'MAY_JUNE_2024' | 'OCT_NOV_2024' | 'MAY_JUNE_2025' | 'CUSTOM';

export interface TopicScore {
  topic: string;
  marksAchieved: number;
  marksAvailable: number;
  score: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Paper {
  id: string;
  userId: string;
  subjectId: SubjectId;
  paperType: PaperType;
  mathsPaperType?: MathsPaperType;
  furtherMathsPaperType?: FurtherMathsPaperType;
  title: string;
  date: string;
  session: string;
  totalMarks: number;
  achievedMarks: number;
  percentage: number;
  topicScores: TopicScore[];
  notes?: string;
  isRetake?: boolean;
  retakeOf?: string;
  retakeNumber?: number;
  createdAt: Date;
  completedDate: Date;
  updatedAt?: Date;
} 