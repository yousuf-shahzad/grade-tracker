import { Timestamp } from 'firebase/firestore';

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

// Predefined subjects for MVP
export const PREDEFINED_SUBJECTS = {
  MATHS: {
    name: "Mathematics",
    topics: [
      "Algebra", "Calculus", "Statistics", "Mechanics", "Geometry", 
      "Trigonometry", "Coordinate Geometry", "Sequences and Series",
      "Complex Numbers", "Functions", "Logarithms", "Polynomials",
      "Data Presentation", "Probability", "Statistical Distributions", "Hypothesis Testing",
      "Correlation and Regression", "Sampling", "Statistical Diagrams", "Measures of Central Tendency",
      "Measures of Dispersion", "Normal Distribution",
      "Forces and Motion", "Kinematics", "Dynamics", "Moments", "Projectiles",
      "Vectors", "Work and Energy", "Power", "Collisions", "Circular Motion"
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