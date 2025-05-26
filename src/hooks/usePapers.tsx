import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, Timestamp, deleteDoc, doc, updateDoc, serverTimestamp, type FieldValue } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Paper } from '../types';

export const usePapers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPapers = async () => {
    if (!user) {
      setPapers([]);
      setLoading(false);
      return;
    }

    try {
      const papersRef = collection(db, 'papers');
      const q = query(
        papersRef,
        where('userId', '==', user.uid),
        orderBy('completedDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const papersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedDate: doc.data().completedDate.toDate()
      })) as Paper[];

      setPapers(papersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to fetch papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retakePaper = async (originalPaper: Paper) => {
    if (!user) {
      setError('You must be logged in to retake a paper');
      return;
    }

    try {
      // Create a new paper entry with the same details but new scores
      const newPaper: Omit<Paper, 'id'> = {
        userId: user.uid,
        subjectId: originalPaper.subjectId,
        paperName: originalPaper.paperName,
        title: originalPaper.title,
        date: originalPaper.date,
        session: originalPaper.session,
        totalMarks: originalPaper.totalMarks,
        achievedMarks: 0, // Will be updated when the retake is completed
        percentage: 0, // Will be updated when the retake is completed
        completedDate: new Date(), // Use JavaScript Date instead of Firestore Timestamp
        topicScores: originalPaper.topicScores.map(topic => ({
          ...topic,
          score: 0, // Reset percentage for the retake
          marksAchieved: 0 // Also reset marks for the retake
        })),
        paperType: originalPaper.paperType,
        isRetake: true,
        retakeOf: originalPaper.id,
        retakeNumber: (originalPaper.retakeNumber || 0) + 1
      };

      const docRef = await addDoc(collection(db, 'papers'), {
        ...newPaper,
        completedDate: Timestamp.fromDate(newPaper.completedDate) // Convert to Firestore Timestamp for storage
      });
      
      // Update the papers list
      await fetchPapers();
      
      return docRef.id;
    } catch (err) {
      console.error('Error creating retake:', err);
      setError('Failed to create retake. Please try again.');
      throw err;
    }
  };

  const deletePaper = async (paperId: string) => {
    try {
      await deleteDoc(doc(db, 'papers', paperId));
      await fetchPapers();
    } catch (err) {
      console.error('Error deleting paper:', err);
      setError('Failed to delete paper. Please try again.');
      throw err;
    }
  };

  const updatePaper = async (paperId: string, updatedPaper: Omit<Paper, 'id' | 'userId' | 'createdAt' | 'completedDate'>) => {
    try {
      const paperRef = doc(db, 'papers', paperId);
      
      // Create a clean update object without undefined values
      const updateData: Record<string, any> = {
        ...updatedPaper,
        updatedAt: serverTimestamp(),
      };

      // Remove any undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Handle retake fields
      if (!updateData.isRetake) {
        delete updateData.retakeOf;
        delete updateData.retakeNumber;
      }

      await updateDoc(paperRef, updateData);
      await fetchPapers();
    } catch (err) {
      console.error('Error updating paper:', err);
      throw err;
    }
  };

  const addPaper = async (paper: Omit<Paper, 'id' | 'userId' | 'createdAt' | 'completedDate'>) => {
    if (!user) throw new Error('User must be logged in to add a paper');

    try {
      const paperData = {
        ...paper,
        userId: user.uid,
        createdAt: Timestamp.now(),
        completedDate: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'papers'), paperData);
      await fetchPapers();
      return docRef.id;
    } catch (err) {
      console.error('Error adding paper:', err);
      throw new Error('Failed to add paper. Please try again.');
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [user]);

  return {
    papers,
    loading,
    error,
    retakePaper,
    deletePaper,
    refreshPapers: fetchPapers,
    updatePaper,
    addPaper,
  };
}; 