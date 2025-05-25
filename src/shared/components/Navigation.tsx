import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface NavigationProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ darkMode, onToggleDarkMode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Papers', href: '/papers' },
    { name: 'Subjects', href: '/subjects' },
    { name: 'Statistics', href: '/statistics' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                Grade Tracker
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'border-indigo-500 dark:border-indigo-400 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-gray-900 dark:hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop right menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            {user ? (
              <button
                onClick={() => {
                  // Handle sign out
                  window.location.href = '/auth';
                }}
                className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-4 space-x-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            {user ? (
              <button
                onClick={() => {
                  // Handle sign out
                  window.location.href = '/auth';
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 