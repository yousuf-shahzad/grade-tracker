import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-[#2D3748] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-[#9F7AEA] dark:text-[#B794F4]">
                Grade Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/papers"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-[#9F7AEA] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Papers
              </Link>
              <Link
                to="/subjects"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-[#9F7AEA] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Subject Stats
              </Link>
              <Link
                to="/statistics"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-[#9F7AEA] hover:text-[#9F7AEA] dark:hover:text-[#B794F4] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Statistics
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </span>
                <Button
                  variant="secondary"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 