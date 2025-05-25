import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Papers', href: '/papers', icon: DocumentTextIcon },
    { name: 'Statistics', href: '/stats', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#1A202C]' : 'bg-[#FDF6F3]'}`}>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className={`flex flex-col flex-grow ${darkMode ? 'bg-[#2D3748] border-[#4A5568]' : 'bg-white border-[#E2E8F0]'} border-r overflow-y-auto`}>
          <div className="flex items-center h-16 flex-shrink-0 px-6">
            <h1 className={`text-xl font-medium ${darkMode ? 'text-[#F7FAFC]' : 'text-[#2D3748]'} tracking-tight`}>Grade Tracker</h1>
          </div>
          <div className="mt-6 flex flex-1 flex-col">
            <nav className="flex-1 space-y-1 px-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentPage === item.name
                      ? darkMode 
                        ? 'bg-[#4A5568] text-[#B794F4]'
                        : 'bg-[#F7FAFC] text-[#9F7AEA]'
                      : darkMode
                        ? 'text-[#A0AEC0] hover:bg-[#4A5568] hover:text-[#B794F4]'
                        : 'text-[#718096] hover:bg-[#F7FAFC] hover:text-[#9F7AEA]'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      currentPage === item.name 
                        ? darkMode ? 'text-[#B794F4]' : 'text-[#9F7AEA]'
                        : darkMode ? 'text-[#A0AEC0] group-hover:text-[#B794F4]' : 'text-[#718096] group-hover:text-[#9F7AEA]'
                    }`} 
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className={`p-4 border-t ${darkMode ? 'border-[#4A5568]' : 'border-[#E2E8F0]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 ${darkMode ? 'bg-[#4A5568] text-[#B794F4]' : 'bg-[#F7FAFC] text-[#9F7AEA]'} rounded-full flex items-center justify-center font-medium text-sm`}>
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-[#F7FAFC]' : 'text-[#2D3748]'}`}>
                    {user?.displayName || user?.email}
                  </p>
                  <button
                    onClick={logout}
                    className={`flex items-center text-xs ${darkMode ? 'text-[#A0AEC0] hover:text-[#B794F4]' : 'text-[#718096] hover:text-[#9F7AEA]'} transition-colors duration-200`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-1 h-3 w-3" />
                    Sign out
                  </button>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'text-[#A0AEC0] hover:text-[#B794F4]' : 'text-[#718096] hover:text-[#9F7AEA]'} transition-colors duration-200`}
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 ${darkMode ? 'bg-[#1A202C]' : 'bg-[#2D3748]'} bg-opacity-25 transition-opacity ease-in-out duration-300 ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`} 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className={`relative flex-1 flex flex-col max-w-xs w-full ${darkMode ? 'bg-[#2D3748]' : 'bg-white'} transform transition ease-in-out duration-300 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset ${darkMode ? 'focus:ring-[#B794F4]' : 'focus:ring-[#9F7AEA]'} ${
                  mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className={`h-6 w-6 ${darkMode ? 'text-[#A0AEC0]' : 'text-[#718096]'}`} />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center justify-between px-4">
                <h1 className={`text-xl font-medium ${darkMode ? 'text-[#F7FAFC]' : 'text-[#2D3748]'}`}>Grade Tracker</h1>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${darkMode ? 'text-[#A0AEC0] hover:text-[#B794F4]' : 'text-[#718096] hover:text-[#9F7AEA]'} transition-colors duration-200`}
                >
                  {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentPage === item.name
                        ? darkMode 
                          ? 'bg-[#4A5568] text-[#B794F4]'
                          : 'bg-[#F7FAFC] text-[#9F7AEA]'
                        : darkMode
                          ? 'text-[#A0AEC0] hover:bg-[#4A5568] hover:text-[#B794F4]'
                          : 'text-[#718096] hover:bg-[#F7FAFC] hover:text-[#9F7AEA]'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        currentPage === item.name 
                          ? darkMode ? 'text-[#B794F4]' : 'text-[#9F7AEA]'
                          : darkMode ? 'text-[#A0AEC0] group-hover:text-[#B794F4]' : 'text-[#718096] group-hover:text-[#9F7AEA]'
                      }`}
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className={`flex-shrink-0 p-4 border-t ${darkMode ? 'border-[#4A5568]' : 'border-[#E2E8F0]'}`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 ${darkMode ? 'bg-[#4A5568] text-[#B794F4]' : 'bg-[#F7FAFC] text-[#9F7AEA]'} rounded-full flex items-center justify-center font-medium text-sm`}>
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${darkMode ? 'text-[#F7FAFC]' : 'text-[#2D3748]'} truncate`}>
                    {user?.displayName || user?.email}
                  </p>
                  <button
                    onClick={logout}
                    className={`flex items-center text-xs ${darkMode ? 'text-[#A0AEC0] hover:text-[#B794F4]' : 'text-[#718096] hover:text-[#9F7AEA]'} transition-colors duration-200`}
                  >
                    <ArrowRightOnRectangleIcon className="mr-1 h-3 w-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className="lg:pl-72">
        <div className={`sticky top-0 z-10 flex h-16 flex-shrink-0 ${darkMode ? 'bg-[#2D3748] border-[#4A5568]' : 'bg-white border-[#E2E8F0]'} border-b`}>
          <button
            type="button"
            className={`lg:hidden px-4 ${darkMode ? 'text-[#A0AEC0] hover:text-[#B794F4]' : 'text-[#718096] hover:text-[#9F7AEA]'} focus:outline-none transition-colors duration-200`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-4 items-center">
            <h1 className={`text-xl font-medium ${darkMode ? 'text-[#F7FAFC]' : 'text-[#2D3748]'} lg:hidden`}>
              {currentPage}
            </h1>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown can go here */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};