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
  title = "Финансовое приложение",
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
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  return (
    <header className={cn("px-4 pt-8 pb-4 border-b transition-all duration-300", className)}
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--border)',
              paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))'
            }}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {leftElement && (
          <div className="flex-shrink-0 mr-3">
            {leftElement}
          </div>
        )}
        <div className="flex-1">
          {title && title !== "Финансовое приложение" ? (
            <h1 className="text-xl font-semibold" style={{color: 'var(--foreground)'}}>{title}</h1>
          ) : userName ? (
            <div>
              <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{getGreeting()}</p>
              <h1 className="text-xl font-semibold" style={{color: 'var(--foreground)'}}>{userName}! 💪</h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold" style={{color: 'var(--foreground)'}}>{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {showSearch && (
            <button className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                    style={{backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)'}}>
              <Search className="w-5 h-5" />
            </button>
          )}

          {showReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              style={{backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)'}}
              title="Сбросить чат"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {showNotifications && (
            <button className="relative p-2 rounded-full transition-all duration-200 hover:scale-110"
                    style={{backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)'}}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse"
                    style={{backgroundColor: 'var(--primary)', borderColor: 'var(--card-bg)'}}></span>
            </button>
          )}

          {rightElement}

          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
               style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'}}>
            <span className="text-white text-sm font-bold">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}