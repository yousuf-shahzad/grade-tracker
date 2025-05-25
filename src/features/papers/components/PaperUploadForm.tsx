import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { PREDEFINED_SUBJECTS, type TopicScore } from '../../../types/index';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { usePapers } from '../../../hooks/usePapers';
import { Button } from '../../../shared/components/Button';
import type { Paper } from '../../../types';

interface FirebaseError {
  message: string;
}

type PaperType = 'Exam' | 'Coursework' | 'Test' | 'Assignment';
type SubjectId = 'MATHS' | 'FURTHER_MATHS';

interface PaperUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
  retakePaper?: Paper | null;
}

export const PaperUploadForm: React.FC<PaperUploadFormProps> = ({ onClose, onSuccess, retakePaper }) => {
  const { user } = useAuth();
  const { addPaper } = usePapers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [paper, setPaper] = useState<Partial<Paper>>({
    paperName: retakePaper ? `${retakePaper.paperName} (Retake)` : '',
    subjectId: retakePaper?.subjectId || '',
    paperType: retakePaper?.paperType || '',
    session: retakePaper?.session || '',
    achievedMarks: 0,
    totalMarks: retakePaper?.totalMarks || 0,
    topicScores: retakePaper?.topicScores?.map(topic => ({
      ...topic,
      marksAchieved: 0,
      score: 0
    })) || [],
    notes: '',
    isRetake: true,
    retakeNumber: retakePaper?.isRetake ? (retakePaper.retakeNumber || 1) + 1 : 1
  });

  // Add a topic score
  const addTopicScore = () => {
    if (!paper.subjectId) return;
    
    const subjectId = paper.subjectId as SubjectId;
    const availableTopics = PREDEFINED_SUBJECTS[subjectId]?.topics || [];
    const unusedTopics = availableTopics.filter(
      (topic: string) => !paper.topicScores?.find(score => score.topic === topic)
    );
    
    if (unusedTopics.length > 0) {
      setPaper(prev => ({
        ...prev,
        topicScores: [...(prev.topicScores || []), {
          topic: unusedTopics[0],
          marksAchieved: 0,
          marksAvailable: 0,
          difficulty: 'Medium',
          score: 0
        }]
      }));
    }
  };

  // Remove a topic score
  const removeTopicScore = (index: number) => {
    setPaper(prev => ({
      ...prev,
      topicScores: prev.topicScores?.filter((_, i) => i !== index) || []
    }));
  };

  // Calculate percentage
  const percentage = (paper.totalMarks || 0) > 0 
    ? Math.round(((paper.achievedMarks || 0) / (paper.totalMarks || 0)) * 100) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      await addPaper(paper as Paper);
      onSuccess();
    } catch (err: unknown) {
      const error = err as FirebaseError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaper(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (index: number, field: keyof TopicScore, value: string | number) => {
    setPaper(prev => {
      const newTopicScores = [...(prev.topicScores || [])];
      newTopicScores[index] = { ...newTopicScores[index], [field]: value };
      return { ...prev, topicScores: newTopicScores };
    });
  };

  return (
    <div className="fixed inset-0 bg-[#1F2937]/25 dark:bg-[#1A202C]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#2D3748] rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#4A5568] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] dark:border-[#4A5568]">
          <h2 className="text-xl font-medium text-[#2D3748] dark:text-[#F7FAFC]">Add Paper Result</h2>
          <button
            onClick={onClose}
            className="text-[#718096] dark:text-[#A0AEC0] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Paper Name *</label>
              <input
                type="text"
                required
                name="paperName"
                value={paper.paperName}
                onChange={handleChange}
                placeholder="e.g., Paper 1, Paper 2, etc."
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] placeholder-[#A0AEC0] dark:placeholder-[#718096] 
                          text-sm font-medium px-3 py-2 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Session *</label>
              <input
                type="text"
                required
                name="session"
                value={paper.session}
                onChange={handleChange}
                placeholder="e.g., May/June 2024, Oct/Nov 2024"
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] placeholder-[#A0AEC0] dark:placeholder-[#718096] 
                          text-sm font-medium px-3 py-2 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Subject *</label>
              <select
                value={paper.subjectId}
                onChange={(e) => setPaper(prev => ({ ...prev, subjectId: e.target.value as SubjectId }))}
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                          transition-colors duration-200"
              >
                <option value="MATHS">Mathematics</option>
                <option value="FURTHER_MATHS">Further Mathematics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Paper Type *</label>
              <select
                value={paper.paperType}
                onChange={(e) => setPaper(prev => ({ ...prev, paperType: e.target.value as PaperType }))}
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                          transition-colors duration-200"
              >
                <option value="Exam">Exam</option>
                <option value="Test">Test</option>
                <option value="Assignment">Assignment</option>
                <option value="Coursework">Coursework</option>
              </select>
            </div>
          </div>

          {/* Marks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Total Marks *</label>
              <input
                type="number"
                required
                name="totalMarks"
                value={paper.totalMarks}
                onChange={handleChange}
                min="0"
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                          transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Achieved Marks *</label>
              <input
                type="number"
                required
                name="achievedMarks"
                value={paper.achievedMarks}
                onChange={handleChange}
                min="0"
                max={paper.totalMarks}
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                          bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                          transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Percentage</label>
              <input
                type="text"
                value={`${percentage}%`}
                disabled
                className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                          bg-[#F7FAFC] dark:bg-[#4A5568] text-[#718096] dark:text-[#A0AEC0] text-sm font-medium px-3 py-2"
              />
            </div>
          </div>

          {/* Topic Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC]">Topic Breakdown</h3>
              <button
                type="button"
                onClick={addTopicScore}
                className="inline-flex items-center px-3 py-1.5 border border-[#E2E8F0] dark:border-[#4A5568] 
                          rounded-lg text-sm font-medium text-[#718096] dark:text-[#A0AEC0] bg-white dark:bg-[#2D3748] 
                          hover:bg-[#F7FAFC] dark:hover:bg-[#4A5568] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] 
                          transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Topic
              </button>
            </div>

            <div className="space-y-4">
              {paper.topicScores?.map((score, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <select
                      value={score.topic}
                      onChange={(e) => handleTopicChange(index, 'topic', e.target.value)}
                      className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                                focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                                bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                                transition-colors duration-200"
                    >
                      {paper.subjectId && PREDEFINED_SUBJECTS[paper.subjectId as SubjectId]?.topics.map((topic: string) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24">
                    <input
                      type="number"
                      value={score.marksAchieved}
                      onChange={(e) => handleTopicChange(index, 'marksAchieved', Number(e.target.value))}
                      min="0"
                      placeholder="Marks"
                      className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                                focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                                bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                                transition-colors duration-200"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={score.marksAvailable}
                      onChange={(e) => handleTopicChange(index, 'marksAvailable', Number(e.target.value))}
                      min="0"
                      placeholder="Total"
                      className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                                focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                                bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                                transition-colors duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTopicScore(index)}
                    className="text-[#718096] dark:text-[#A0AEC0] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] transition-colors duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Notes</label>
            <textarea
              value={paper.notes}
              onChange={(e) => setPaper(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                        bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                        transition-colors duration-200"
              placeholder="Add any additional notes or comments..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Paper'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};