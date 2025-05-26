import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { AuthForm } from '../components/AuthForm';
import { PaperList } from '../features/papers/components/PaperList';
import { EditPaper } from '../features/papers/components/EditPaper';
import { SubjectStats } from '../features/subjects/components/SubjectStats';
import { Statistics } from '../features/statistics/components/Statistics';
import { Dashboard } from '../features/dashboard/components/Dashboard';
import { Settings } from '../features/settings/components/Settings';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirects to home if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard/>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/papers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PaperList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/papers/:id/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditPaper />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Statistics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SubjectStats />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/papers" replace />} />
    </Routes>
  );
}; 