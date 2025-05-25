import React, { useState } from 'react';
import { usePapers } from '../../../hooks/usePapers';
import { useNavigate } from 'react-router-dom';
import type { Paper } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { SUBJECTS, PAPER_TYPES } from '../../../constants/paper';
import { PaperCard } from './PaperCard';
import { PaperUploadForm } from './PaperUploadForm';
import { PlusIcon } from '@heroicons/react/24/outline';

const getSubjectLabel = (subjectId: string) => {
  const found = SUBJECTS.find(s => s.value === subjectId);
  return found ? found.label : subjectId;
};

const getPaperTypeName = (typeId: string) => {
  const found = PAPER_TYPES.find(t => t.value === typeId);
  return found ? found.label : typeId;
};

const getRetakeLabel = (paper: Paper) => {
  if (!paper.isRetake) return null;
  return paper.retakeNumber ? `Retake #${paper.retakeNumber}` : 'Retake';
};

const PaperDetailModal: React.FC<{ paper: Paper; onClose: () => void; onEdit: () => void; onDelete: () => void; onRetake: () => void }> = ({ 
  paper, 
  onClose, 
  onEdit, 
  onDelete,
  onRetake 
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{paper.paperName}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Subject: {getSubjectLabel(paper.subjectId)}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Type: {getPaperTypeName(paper.paperType)} • Session: {paper.session}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Completed: {paper.completedDate.toLocaleDateString()}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Score: {paper.achievedMarks}/{paper.totalMarks} ({paper.percentage}%)</p>
      {paper.isRetake && (
        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">{getRetakeLabel(paper)}</p>
      )}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic Performance</h4>
        <div className="grid grid-cols-2 gap-2">
          {paper.topicScores.map((topic, idx) => (
            <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
              <div className="font-semibold">{topic.topic}</div>
              <div>Score: {topic.score}%</div>
              <div>Marks: {topic.marksAchieved}/{topic.marksAvailable}</div>
              <div>Difficulty: {topic.difficulty}</div>
            </div>
          ))}
        </div>
      </div>
      {paper.notes && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{paper.notes}</p>
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={onRetake}>Retake</Button>
        <Button variant="secondary" onClick={onEdit}>Edit</Button>
        <Button variant="secondary" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  </div>
);

export const PaperList: React.FC = () => {
  const { papers, loading, error, deletePaper, refreshPapers } = usePapers();
  const navigate = useNavigate();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [retakePaper, setRetakePaper] = useState<Paper | null>(null);

  const handleDelete = async (paperId: string) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        await deletePaper(paperId);
      } catch (err) {
        console.error('Error deleting paper:', err);
      }
    }
  };

  const handleRetake = (paper: Paper) => {
    setRetakePaper(paper);
    setShowUploadForm(true);
  };

  const handleUploadSuccess = async () => {
    setShowUploadForm(false);
    setRetakePaper(null);
    await refreshPapers();
  };

  if (loading) {
    return <div className="text-center py-8">Loading papers...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">Papers</h1>
        <Button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Paper
        </Button>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No papers found.</p>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="mt-4"
          >
            Add Your First Paper
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onClick={() => setSelectedPaper(paper)}
              onRetake={handleRetake}
            />
          ))}
        </div>
      )}

      {selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
          onEdit={() => {
            setSelectedPaper(null);
            navigate(`/papers/${selectedPaper.id}/edit`);
          }}
          onDelete={() => handleDelete(selectedPaper.id)}
          onRetake={() => {
            setSelectedPaper(null);
            handleRetake(selectedPaper);
          }}
        />
      )}

      {showUploadForm && (
        <PaperUploadForm
          onClose={() => {
            setShowUploadForm(false);
            setRetakePaper(null);
          }}
          onSuccess={handleUploadSuccess}
          retakePaper={retakePaper}
        />
      )}
    </div>
  );
}; 