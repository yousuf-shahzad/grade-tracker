import { GRADE_COLORS, GRADE_THRESHOLDS } from '../constants/paper';

export const getGradeColor = (percentage: number, isDarkMode: boolean = false): string => {
  if (percentage >= GRADE_THRESHOLDS.A) {
    return isDarkMode ? GRADE_COLORS.A.dark : GRADE_COLORS.A.light;
  }
  if (percentage >= GRADE_THRESHOLDS.B) {
    return isDarkMode ? GRADE_COLORS.B.dark : GRADE_COLORS.B.light;
  }
  if (percentage >= GRADE_THRESHOLDS.C) {
    return isDarkMode ? GRADE_COLORS.C.dark : GRADE_COLORS.C.light;
  }
  if (percentage >= GRADE_THRESHOLDS.D) {
    return isDarkMode ? GRADE_COLORS.D.dark : GRADE_COLORS.D.light;
  }
  return isDarkMode ? GRADE_COLORS.E.dark : GRADE_COLORS.E.light;
};

export const getGradeLetter = (percentage: number): string => {
  if (percentage >= GRADE_THRESHOLDS.A) return 'A';
  if (percentage >= GRADE_THRESHOLDS.B) return 'B';
  if (percentage >= GRADE_THRESHOLDS.C) return 'C';
  if (percentage >= GRADE_THRESHOLDS.D) return 'D';
  return 'E';
};

export const calculatePercentage = (achieved: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((achieved / total) * 100);
}; 