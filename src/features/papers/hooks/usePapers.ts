import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../hooks/useAuth';
import type { Paper } from '../../../types';

export const usePapers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPapers = async () => {
      if (!user) {
        setPapers([]);
        setLoading(false);
        return;
      }

      try {
        const papersQuery = query(
          collection(db, 'papers'),
          where('userId', '==', user.uid),
          orderBy('completedDate', 'desc')
        );

        const querySnapshot = await getDocs(papersQuery);
        const papersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Paper[];

        setPapers(papersData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch papers. Please try again later.');
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [user]);

  return { papers, loading, error };
}; 