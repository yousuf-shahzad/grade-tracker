import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Paper } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { SUBJECTS, PAPER_TYPES } from '../../../constants/paper';
import { ChartBarIcon, TrashIcon } from '@heroicons/react/24/outline';

const getSubjectLabel = (subjectId: string) => {
  const found = SUBJECTS.find(s => s.value === subjectId);
  return found ? found.label : subjectId;
};

const getPaperTypeName = (typeId: string) => {
  const found = PAPER_TYPES.find(t => t.value === typeId);
  return found ? found.label : typeId;
};

interface PaperCardProps {
  paper: Paper;
  onClick: () => void;
  onRetake: (paper: Paper) => void;
  onDelete: (paperId: string) => void;
}

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return 'text-[#48BB78] dark:text-[#68D391]';
  if (percentage >= 80) return 'text-[#38A169] dark:text-[#48BB78]';
  if (percentage >= 70) return 'text-[#ED8936] dark:text-[#F6AD55]';
  if (percentage >= 60) return 'text-[#DD6B20] dark:text-[#ED8936]';
  return 'text-[#E53E3E] dark:text-[#FC8181]';
};

const formatExamSeries = (series: string) => {
  if (series === 'CUSTOM') return 'Custom Series';
  
  // Handle predefined series format (e.g., MAY_JUNE_2024)
  const [period, year] = series.split('_');
  if (period && year) {
    const formattedPeriod = period.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
    return `${formattedPeriod} ${year}`;
  }
  
  return series;
};

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onClick, onRetake, onDelete }) => {
  const navigate = useNavigate();
  const gradeColor = getGradeColor(paper.percentage);

  const handleRetake = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetake(paper);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this paper?')) {
      onDelete(paper.id);
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#2D3748] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#4A5568] p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-1">
            {paper.paperName}
            {paper.isRetake && (
              <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">
                (Retake #{paper.retakeNumber})
              </span>
            )}
          </h3>
          <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
            {getSubjectLabel(paper.subjectId)} • {formatExamSeries(paper.session)}
          </p>
        </div>
        <div className="flex items-center">
          <ChartBarIcon className="h-5 w-5 text-[#718096] dark:text-[#A0AEC0] mr-2" />
          <span className={`text-lg font-semibold ${gradeColor}`}>
            {paper.percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#718096] dark:text-[#A0AEC0]">Type</span>
          <span className="text-[#2D3748] dark:text-[#F7FAFC]">
            {getPaperTypeName(paper.paperType)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#718096] dark:text-[#A0AEC0]">Completed</span>
          <span className="text-[#2D3748] dark:text-[#F7FAFC]">
            {new Date(paper.completedDate).toLocaleDateString()}
          </span>
        </div>
        {paper.topicScores && paper.topicScores.length > 0 && (
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#4A5568]">
            <h4 className="text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-2">
              Topic Breakdown
            </h4>
            <div className="space-y-1">
              {paper.topicScores.map((score, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-[#718096] dark:text-[#A0AEC0]">{score.topic}</span>
                  <span className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">
                    {score.marksAchieved} / {score.marksAvailable}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="secondary"
          onClick={handleRetake}
        >
          Retake
        </Button>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/papers/${paper.id}/edit`);
          }}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          onClick={handleDelete}
          className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}; 