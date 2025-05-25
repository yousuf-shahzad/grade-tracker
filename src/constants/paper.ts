export const PAPER_TYPES = [
  { value: 'Exam', label: 'Exam' },
  { value: 'Test', label: 'Test' },
  { value: 'Assignment', label: 'Assignment' },
  { value: 'Coursework', label: 'Coursework' },
] as const;

export const SUBJECTS = [
  { value: 'MATHS', label: 'Mathematics' },
  { value: 'FURTHER_MATHS', label: 'Further Mathematics' },
] as const;

export const LEVELS = [
  { value: 'AS', label: 'AS Level' },
  { value: 'A2', label: 'A2 Level' },
] as const;

export const GRADE_COLORS = {
  A: {
    light: '#48BB78',
    dark: '#68D391',
  },
  B: {
    light: '#38A169',
    dark: '#48BB78',
  },
  C: {
    light: '#ED8936',
    dark: '#F6AD55',
  },
  D: {
    light: '#DD6B20',
    dark: '#ED8936',
  },
  E: {
    light: '#E53E3E',
    dark: '#FC8181',
  },
} as const;

export const GRADE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
} as const; 