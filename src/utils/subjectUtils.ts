export const getSubjectName = (subjectId: string): string => {
  switch (subjectId) {
    case 'MATHS':
      return 'Mathematics';
    case 'FURTHER_MATHS':
      return 'Further Mathematics';
    default:
      return subjectId;
  }
}; 