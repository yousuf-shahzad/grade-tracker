import type { Paper } from './paper';

export type SubjectId = 'MATHS' | 'FURTHER_MATHS'; 

export interface WeakTopic {
  topic: string;
  average: number;
}

export interface SubjectStats {
  total: number;
  count: number;
  highest: number;
  lowest: number;
  recentImprovement: number;
  papers: Paper[];
  weakTopics?: WeakTopic[];
} 