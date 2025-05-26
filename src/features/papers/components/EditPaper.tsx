import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePapers } from '../../../hooks/usePapers';
import { Button } from '../../../components/ui/Button';
import { SUBJECTS, PAPER_TYPES } from '../../../constants/paper';
import type { Paper, TopicScore } from '../../../types';

const SESSIONS = ['2023-2024', '2024-2025', '2025-2026'];

export const EditPaper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { papers, loading, error, updatePaper } = usePapers();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id && papers.length > 0) {
      const foundPaper = papers.find(p => p.id === id);
      if (foundPaper) {
        setPaper(foundPaper);
      } else {
        navigate('/papers');
      }
    }
  }, [id, papers, navigate]);

  const calculatePercentage = (achieved: number, total: number) => {
    return total > 0 ? Math.round((achieved / total) * 100) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paper || !id) return;

    setIsSubmitting(true);
    try {
      const paperToUpdate = {
        paperName: paper.paperName,
        title: paper.title,
        date: paper.date,
        subjectId: paper.subjectId,
        paperType: paper.paperType,
        session: paper.session,
        achievedMarks: paper.achievedMarks,
        totalMarks: paper.totalMarks,
        topicScores: paper.topicScores,
        notes: paper.notes,
        percentage: paper.percentage,
        isRetake: paper.isRetake,
        retakeOf: paper.retakeOf,
        retakeNumber: paper.retakeNumber,
        originalPaperId: paper.originalPaperId,
        timeTaken: paper.timeTaken,
        attemptNumber: paper.attemptNumber,
        mathsPaperType: paper.mathsPaperType,
        furtherMathsPaperType: paper.furtherMathsPaperType
      };
      await updatePaper(id, paperToUpdate);
      navigate('/papers');
    } catch (err) {
      console.error('Error updating paper:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!paper) return;
    const { name, value } = e.target;
    
    if (name === 'achievedMarks' || name === 'totalMarks') {
      const newValue = parseInt(value);
      const newPercentage = calculatePercentage(
        name === 'achievedMarks' ? newValue : paper.achievedMarks,
        name === 'totalMarks' ? newValue : paper.totalMarks
      );
      
      setPaper(prev => prev ? {
        ...prev,
        [name]: newValue,
        percentage: newPercentage
      } : null);
    } else {
      setPaper(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleTopicChange = (index: number, field: keyof TopicScore, value: string | number) => {
    if (!paper) return;
    const newTopicScores = [...paper.topicScores];
    newTopicScores[index] = { ...newTopicScores[index], [field]: value };
    
    // Recalculate total achieved marks from topic scores
    const totalAchievedMarks = newTopicScores.reduce((sum, topic) => sum + topic.marksAchieved, 0);
    const newPercentage = calculatePercentage(totalAchievedMarks, paper.totalMarks);
    
    setPaper(prev => prev ? {
      ...prev,
      topicScores: newTopicScores,
      achievedMarks: totalAchievedMarks,
      percentage: newPercentage
    } : null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading paper...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!paper) {
    return <div className="text-center py-8">Paper not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC] mb-6">Edit Paper</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paper Name
          </label>
          <input
            type="text"
            name="paperName"
            value={paper.paperName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                     bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
          </label>
          <select
            name="subjectId"
            value={paper.subjectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                     bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
            required
          >
            {SUBJECTS.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Paper Type
            </label>
            <select
              name="paperType"
              value={paper.paperType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                       bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
              required
            >
              {PAPER_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session
            </label>
            <select
              name="session"
              value={paper.session}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                       bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
              required
            >
              {SESSIONS.map(session => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Achieved Marks
            </label>
            <input
              type="number"
              name="achievedMarks"
              value={paper.achievedMarks}
              onChange={handleChange}
              min="0"
              max={paper.totalMarks}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                       bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Marks
            </label>
            <input
              type="number"
              name="totalMarks"
              value={paper.totalMarks}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                       bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={paper.notes || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                     bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC]">Topic Scores</h3>
          {paper.topicScores.map((topic, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={topic.topic}
                    onChange={(e) => handleTopicChange(index, 'topic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                             bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={topic.difficulty}
                    onChange={(e) => handleTopicChange(index, 'difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                             bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marks Achieved
                  </label>
                  <input
                    type="number"
                    value={topic.marksAchieved}
                    onChange={(e) => handleTopicChange(index, 'marksAchieved', parseInt(e.target.value))}
                    min="0"
                    max={topic.marksAvailable}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                             bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marks Available
                  </label>
                  <input
                    type="number"
                    value={topic.marksAvailable}
                    onChange={(e) => handleTopicChange(index, 'marksAvailable', parseInt(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                             bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/papers')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 