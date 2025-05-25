import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  level: "AS" | "A2";
  examBoard?: string;
  color: string;
  topicCategories: string[];
  commonTopics: string[];
  createdAt: Timestamp;
}

export interface Paper {
  id: string;
  userId: string;
  subjectId: string;
  paperName: string;
  session: string;
  totalMarks: number;
  achievedMarks: number;
  percentage: number;
  completedDate: Date;
  topicScores: TopicScore[];
  paperType: string;
  isRetake?: boolean;
  originalPaperId?: string;
  retakeNumber?: number;
  notes?: string;
  timeTaken?: number; // in minutes
  attemptNumber?: number; // for retakes
  createdAt?: Date; // Make createdAt optional
}

export interface TopicScore {
  topic: string;
  category?: string;
  marksAchieved: number;
  marksAvailable: number;
  score: number; // percentage (0-100)
  difficulty: "Easy" | "Medium" | "Hard";
}

// Predefined subjects for MVP
export const PREDEFINED_SUBJECTS = {
  MATHS: {
    name: "Mathematics",
    topics: [
      "Algebra", "Calculus", "Statistics", "Mechanics", "Geometry", 
      "Trigonometry", "Coordinate Geometry", "Sequences and Series"
    ]
  },
  FURTHER_MATHS: {
    name: "Further Mathematics", 
    topics: [
      "Complex Numbers", "Matrices", "Further Calculus", "Further Statistics",
      "Further Mechanics", "Hyperbolic Functions", "Differential Equations"
    ]
  }
} as const;