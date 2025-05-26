export interface TopicScore {
  topic: string;
  category?: string;
  marksAchieved: number;
  marksAvailable: number;
  score: number; // percentage (0-100)
  difficulty: "Easy" | "Medium" | "Hard";
}

export type PaperType = 'EXAM' | 'TEST' | 'ASSIGNMENT' | 'COURSEWORK';
export type MathsPaperType = 'PURE' | 'STATS' | 'MECHANICS';
export type FurtherMathsPaperType = 
  | 'CORE_PURE_1' 
  | 'CORE_PURE_2' 
  | 'FURTHER_MECHANICS_1' 
  | 'FURTHER_MECHANICS_2' 
  | 'FURTHER_STATISTICS_1' 
  | 'FURTHER_STATISTICS_2' 
  | 'FURTHER_PURE_1' 
  | 'FURTHER_PURE_2';

export interface Paper {
  id: string;
  userId: string;
  subjectId: string;
  paperName: string;
  title: string;
  date: string;
  session: string;
  totalMarks: number;
  achievedMarks: number;
  percentage: number;
  completedDate: Date;
  topicScores: TopicScore[];
  paperType: PaperType;
  mathsPaperType?: MathsPaperType;
  furtherMathsPaperType?: FurtherMathsPaperType;
  notes?: string;
  isRetake: boolean;
  retakeOf?: string;
  retakeNumber?: number;
  originalPaperId?: string;
  timeTaken?: number; // in minutes
  attemptNumber?: number; // for retakes
  createdAt?: Date;
  updatedAt?: Date;
} 