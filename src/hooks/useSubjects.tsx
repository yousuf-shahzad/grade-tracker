import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Subject } from '../types/subject';

export const useSubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'subjects'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const subjectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Subject[];
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to fetch subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    if (!user) {
      setError('You must be logged in to add a subject');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'subjects'), {
        ...subject,
        userId: user.uid
      });
      setSubjects(prev => [...prev, { id: docRef.id, ...subject }]);
      return docRef.id;
    } catch (err) {
      console.error('Error adding subject:', err);
      setError('Failed to add subject');
      throw err;
    }
  };

  const deleteSubject = async (subjectId: string) => {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
      setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError('Failed to delete subject');
      throw err;
    }
  };

  return {
    subjects,
    loading,
    error,
    addSubject,
    deleteSubject
  };
}; 