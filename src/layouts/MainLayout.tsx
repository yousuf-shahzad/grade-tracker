import React, { useEffect } from 'react';
import { Navigation } from '../shared/components/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    
    // Then check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navigation darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          {children}
        </div>
      </main>
    </div>
  );
}; 