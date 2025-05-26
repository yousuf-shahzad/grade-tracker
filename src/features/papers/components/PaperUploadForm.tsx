import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapers } from '../../../hooks/usePapers';
import { Button } from '../../../components/ui/Button';
import { MATHS_PAPER_TYPES, MATHS_TOPICS, FURTHER_MATHS_PAPER_TYPES, FURTHER_MATHS_TOPICS, EXAM_SERIES } from '../../../constants/paper';
import type { Paper, TopicScore, MathsPaperType, FurtherMathsPaperType, PaperType } from '../../../types/paper';
import type { SubjectId } from '../../../types/subjects';
import type { ExamSeries } from '../../../constants/paper';

interface PaperUploadFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  retakePaper?: Paper;
}

export const PaperUploadForm: React.FC<PaperUploadFormProps> = ({ onClose, onSuccess, retakePaper }) => {
  const navigate = useNavigate();
  const { addPaper } = usePapers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paper, setPaper] = useState<Partial<Paper>>({
    subjectId: retakePaper?.subjectId || '',
    paperType: retakePaper?.paperType || 'EXAM',
    mathsPaperType: retakePaper?.mathsPaperType,
    furtherMathsPaperType: retakePaper?.furtherMathsPaperType,
    title: retakePaper?.title || '',
    paperName: retakePaper?.paperName || '',
    date: retakePaper?.date || '',
    session: retakePaper?.session || '',
    totalMarks: retakePaper?.totalMarks || 0,
    achievedMarks: retakePaper?.achievedMarks || 0,
    topicScores: retakePaper?.topicScores || [],
    notes: retakePaper?.notes || '',
    isRetake: !!retakePaper,
    retakeOf: retakePaper?.id,
    retakeNumber: retakePaper?.retakeNumber ? retakePaper.retakeNumber + 1 : 1,
    completedDate: retakePaper?.completedDate || new Date()
  });

  const [selectedExamSeries, setSelectedExamSeries] = useState<ExamSeries>('MAY_JUNE_2024');
  const [customExamSeries, setCustomExamSeries] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const session = selectedExamSeries === 'CUSTOM' ? customExamSeries : selectedExamSeries;
      
      // Create a base paper object without optional fields
      const { 
        mathsPaperType, 
        furtherMathsPaperType, 
        retakeOf,
        retakeNumber,
        ...basePaperFields 
      } = paper;
      
      const basePaper = {
        ...basePaperFields,
        session,
        paperName: paper.title || `${paper.subjectId} ${paper.paperType}`,
        percentage: paper.totalMarks ? Math.round((paper.achievedMarks! / paper.totalMarks) * 100) : 0,
        completedDate: paper.completedDate || new Date(),
      };

      // Only include paper type fields if they are set
      const paperToAdd = {
        ...basePaper,
        ...(paper.subjectId === 'MATHS' && mathsPaperType ? { mathsPaperType } : {}),
        ...(paper.subjectId === 'FURTHER_MATHS' && furtherMathsPaperType ? { furtherMathsPaperType } : {}),
        ...(paper.isRetake && retakeOf ? { retakeOf, retakeNumber } : {})
      };

      await addPaper(paperToAdd as Omit<Paper, 'id' | 'userId' | 'createdAt' | 'completedDate'>);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      navigate('/papers');
    } catch (err) {
      console.error('Error adding paper:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaper(prev => ({ ...prev, [name]: value }));
  };

  const handleExamSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ExamSeries;
    setSelectedExamSeries(value);
    if (value !== 'CUSTOM') {
      setPaper(prev => ({ ...prev, session: value }));
    }
  };

  const handleCustomExamSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomExamSeries(value);
    setPaper(prev => ({ ...prev, session: value }));
  };

  const addTopicScore = () => {
    const availableTopics = paper.subjectId === 'MATHS' && paper.mathsPaperType
      ? [...MATHS_TOPICS[paper.mathsPaperType]]
      : paper.subjectId === 'FURTHER_MATHS' && paper.furtherMathsPaperType
        ? [...FURTHER_MATHS_TOPICS[paper.furtherMathsPaperType as keyof typeof FURTHER_MATHS_TOPICS]]
        : ['Topic 1', 'Topic 2', 'Topic 3'];

    const newTopicScore: TopicScore = {
      topic: availableTopics[0],
      marksAchieved: 0,
      marksAvailable: 0,
      score: 0,
      difficulty: 'Medium'
    };

    setPaper(prev => ({
      ...prev,
      topicScores: [...(prev.topicScores || []), newTopicScore]
    }));
  };

  const removeTopicScore = (index: number) => {
    setPaper(prev => ({
      ...prev,
      topicScores: prev.topicScores?.filter((_, i) => i !== index)
    }));
  };

  const handleTopicChange = (index: number, field: keyof TopicScore, value: string | number) => {
    const newTopicScores = [...(paper.topicScores || [])];
    newTopicScores[index] = { ...newTopicScores[index], [field]: value };
    
    // Calculate score for the topic if marks are changed
    if (field === 'marksAchieved' || field === 'marksAvailable') {
      const topic = newTopicScores[index];
      if (topic.marksAvailable > 0) {
        topic.score = Math.round((topic.marksAchieved / topic.marksAvailable) * 100);
      }
    }
    
    // Recalculate total achieved marks from topic scores
    const totalAchievedMarks = newTopicScores.reduce((sum, topic) => sum + topic.marksAchieved, 0);
    const newPercentage = paper.totalMarks ? Math.round((totalAchievedMarks / paper.totalMarks) * 100) : 0;
    
    setPaper(prev => ({
      ...prev,
      topicScores: newTopicScores,
      achievedMarks: totalAchievedMarks,
      percentage: newPercentage
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-6">
        {retakePaper ? 'Retake Paper' : 'Add New Paper'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Subject *</label>
          <select
            value={paper.subjectId}
            onChange={(e) => {
              const newSubjectId = e.target.value as SubjectId;
              setPaper(prev => ({ 
                ...prev, 
                subjectId: newSubjectId,
                mathsPaperType: newSubjectId === 'MATHS' ? 'PURE' : undefined,
                furtherMathsPaperType: newSubjectId === 'FURTHER_MATHS' ? 'CORE_PURE_1' : undefined,
                topicScores: [] // Reset topic scores when subject changes
              }));
            }}
            className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                      focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                      bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                      transition-colors duration-200"
            required
          >
            <option value="">Select Subject</option>
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
            required
          >
            <option value="EXAM">Exam</option>
            <option value="TEST">Test</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="COURSEWORK">Coursework</option>
          </select>
        </div>

        {paper.subjectId === 'MATHS' && (
          <div>
            <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Mathematics Paper Type *</label>
            <select
              value={paper.mathsPaperType || ''}
              onChange={(e) => {
                const newMathsPaperType = e.target.value as MathsPaperType;
                setPaper(prev => ({ 
                  ...prev, 
                  mathsPaperType: newMathsPaperType,
                  topicScores: [] // Reset topic scores when paper type changes
                }));
              }}
              className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                        bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                        transition-colors duration-200"
            >
              <option value="">Select Paper Type</option>
              {MATHS_PAPER_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        )}

        {paper.subjectId === 'FURTHER_MATHS' && (
          <div>
            <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Further Mathematics Paper Type *</label>
            <select
              value={paper.furtherMathsPaperType || ''}
              onChange={(e) => {
                const newFurtherMathsPaperType = e.target.value as FurtherMathsPaperType;
                setPaper(prev => ({ 
                  ...prev, 
                  furtherMathsPaperType: newFurtherMathsPaperType,
                  topicScores: [] // Reset topic scores when paper type changes
                }));
              }}
              className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                        bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                        transition-colors duration-200"
            >
              <option value="">Select Paper Type</option>
              {Object.entries(FURTHER_MATHS_PAPER_TYPES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Exam Series *</label>
          <select
            value={selectedExamSeries}
            onChange={handleExamSeriesChange}
            className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                      focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                      bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                      transition-colors duration-200"
            required
          >
            {EXAM_SERIES.map(series => (
              <option key={series.value} value={series.value}>
                {series.label}
              </option>
            ))}
          </select>
        </div>

        {selectedExamSeries === 'CUSTOM' && (
          <div>
            <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Custom Exam Series *</label>
            <input
              type="text"
              value={customExamSeries}
              onChange={handleCustomExamSeriesChange}
              placeholder="Enter custom exam series (e.g., 'Mock Exam 1')"
              className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                        bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                        transition-colors duration-200"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Completion Date *</label>
          <input
            type="date"
            required
            name="completedDate"
            value={paper.completedDate ? new Date(paper.completedDate).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setPaper(prev => ({ ...prev, completedDate: date }));
            }}
            max={new Date().toISOString().split('T')[0]}
            className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                      focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                      bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                      transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#718096] dark:text-[#A0AEC0] mb-1">Notes</label>
          <textarea
            name="notes"
            value={paper.notes || ''}
            onChange={handleChange}
            rows={4}
            className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                      focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                      bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                      transition-colors duration-200"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC]">Topic Scores</h3>
            <Button
              type="button"
              variant="secondary"
              onClick={addTopicScore}
            >
              Add Topic
            </Button>
          </div>
          
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
                  {paper.subjectId === 'MATHS' && paper.mathsPaperType ? (
                    MATHS_TOPICS[paper.mathsPaperType].map((topic: string) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))
                  ) : paper.subjectId === 'FURTHER_MATHS' && paper.furtherMathsPaperType ? (
                    FURTHER_MATHS_TOPICS[paper.furtherMathsPaperType as keyof typeof FURTHER_MATHS_TOPICS].map((topic: string) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))
                  ) : (
                    ['Topic 1', 'Topic 2', 'Topic 3'].map((topic: string) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="w-32">
                <input
                  type="number"
                  value={score.marksAchieved}
                  onChange={(e) => handleTopicChange(index, 'marksAchieved', parseInt(e.target.value))}
                  min="0"
                  max={score.marksAvailable}
                  placeholder="Marks"
                  className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                            focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                            bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                            transition-colors duration-200"
                />
              </div>
              
              <div className="w-32">
                <input
                  type="number"
                  value={score.marksAvailable}
                  onChange={(e) => handleTopicChange(index, 'marksAvailable', parseInt(e.target.value))}
                  min="0"
                  placeholder="Total"
                  className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                            focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                            bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                            transition-colors duration-200"
                />
              </div>
              
              <div className="w-32">
                <select
                  value={score.difficulty}
                  onChange={(e) => handleTopicChange(index, 'difficulty', e.target.value)}
                  className="block w-full border border-[#E2E8F0] dark:border-[#4A5568] rounded-lg shadow-sm 
                            focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] focus:border-[#9F7AEA] dark:focus:border-[#B794F4] 
                            bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC] text-sm font-medium px-3 py-2 
                            transition-colors duration-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <button
                type="button"
                onClick={() => removeTopicScore(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          {onClose && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Paper'}
          </Button>
        </div>
      </form>
    </div>
  );
};