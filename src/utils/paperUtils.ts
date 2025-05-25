export const getPaperTypeName = (paperType: string): string => {
  switch (paperType) {
    case 'Exam':
      return 'Exam';
    case 'Test':
      return 'Test';
    case 'Assignment':
      return 'Assignment';
    case 'Coursework':
      return 'Coursework';
    default:
      return paperType;
  }
}; 