'use client';

import { Bell, Search, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showReset?: boolean;
  userName?: string;
  className?: string;
  onReset?: () => void;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export default function Header({
  title = "Finance App",
  showSearch = false,
  showNotifications = true,
  showReset = false,
  userName = "John",
  className,
  onReset,
  leftElement,
  rightElement
}: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className={cn("bg-white px-4 py-4 border-b border-gray-100", className)}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {leftElement && (
          <div className="flex-shrink-0 mr-3">
            {leftElement}
          </div>
        )}
        <div className="flex-1">
          {title && title !== "Finance App" ? (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          ) : userName ? (
            <div>
              <p className="text-sm text-gray-500">{getGreeting()}</p>
              <h1 className="text-xl font-semibold text-gray-900">{userName}!</h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {showSearch && (
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {showReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Reset Chat"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {showNotifications && (
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          )}

          {rightElement}

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}