import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Switch } from '../../../components/ui/Switch';
import { Select } from '../../../components/ui/Select';
import { AcademicCapIcon, SunIcon, MoonIcon, ComputerDesktopIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { usePapers } from '../../../hooks/usePapers';
import { useSubjects } from '../../../hooks/useSubjects';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { papers } = usePapers();
  const { subjects } = useSubjects();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [nickname, setNickname] = useState(user?.displayName || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleExportData = () => {
    const data = {
      papers,
      subjects,
      user: {
        email: user?.email,
        displayName: user?.displayName,
        nickname,
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      // TODO: Implement account deletion in Firebase
      await signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    // TODO: Implement nickname update in Firebase
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <AcademicCapIcon className="h-8 w-8 text-[#9F7AEA]" />
        <h1 className="text-2xl font-semibold text-[#2D3748] dark:text-[#F7FAFC]">Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
          Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-1">
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-[#9F7AEA] dark:focus:ring-[#B794F4] 
                       bg-white dark:bg-[#2D3748] text-[#2D3748] dark:text-[#F7FAFC]"
              placeholder="Enter your nickname"
            />
            <p className="mt-1 text-sm text-[#718096] dark:text-[#A0AEC0]">
              This is how you'll be referred to in the app
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">Theme</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Choose your preferred theme
              </p>
            </div>
            <Select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
              options={[
                { value: 'light', label: 'Light', icon: <SunIcon className="h-5 w-5" /> },
                { value: 'dark', label: 'Dark', icon: <MoonIcon className="h-5 w-5" /> },
                { value: 'system', label: 'System', icon: <ComputerDesktopIcon className="h-5 w-5" /> }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">Push Notifications</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Receive notifications about your progress
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium">Email Notifications</h3>
              <p className="text-sm text-[#718096] dark:text-[#A0AEC0]">
                Receive email updates about your progress
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-[#2D3748] rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-[#2D3748] dark:text-[#F7FAFC] mb-4">
          Data Management
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium mb-2">Export Data</h3>
            <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-4">
              Download all your data in a JSON format
            </p>
            <Button 
              variant="secondary" 
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export Data
            </Button>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-[#2D3748] dark:text-[#F7FAFC] font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-[#718096] dark:text-[#A0AEC0] mb-4">
              Permanently delete your account and all associated data
            </p>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 