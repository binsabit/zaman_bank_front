'use client';

import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0">
        <Header title="Профиль спортсмена 🏋️" showNotifications={false} />
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-24 min-h-0">
        {/* Profile Header */}
        <div className="rounded-xl p-6 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center relative"
                 style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'}}>
              <span className="text-white text-xl font-bold">J</span>
              {/* Fitness ring around avatar */}
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{color: 'var(--foreground)'}}>John "Зверь" Doe 💪</h2>
              <p style={{color: 'var(--text-secondary)'}}>john.doe@example.com</p>
              <p className="text-sm font-medium" style={{color: 'var(--accent)'}}>Элитный тренер ⭐</p>
            </div>
          </div>
        </div>

        {/* Training Settings */}
        <div className="rounded-xl shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="p-4 border-b" style={{borderColor: 'var(--border)'}}>
            <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>Настройки тренировки ⚙️</h3>
          </div>

          <div className="divide-y" style={{color: 'var(--border)'}}>
            <button className="w-full p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02]"
                    style={{background: 'transparent'}}>
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" style={{color: 'var(--primary)'}} />
                <span className="font-medium" style={{color: 'var(--foreground)'}}>Предпочтения тренировки 🎯</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            </button>

            <button className="w-full p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02]"
                    style={{background: 'transparent'}}>
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" style={{color: 'var(--primary)'}} />
                <span className="font-medium" style={{color: 'var(--foreground)'}}>Оповещения о днях отдыха 🔔</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            </button>

            <button className="w-full p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02]"
                    style={{background: 'transparent'}}>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5" style={{color: 'var(--primary)'}} />
                <span className="font-medium" style={{color: 'var(--foreground)'}}>Защита данных 🛡️</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            </button>
          </div>
        </div>

        {/* Coach Support */}
        <div className="rounded-xl shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="p-4 border-b" style={{borderColor: 'var(--border)'}}>
            <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>Поддержка тренера 🏃‍♂️</h3>
          </div>

          <div className="divide-y" style={{color: 'var(--border)'}}>
            <button className="w-full p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02]"
                    style={{background: 'transparent'}}>
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5" style={{color: 'var(--primary)'}} />
                <span className="font-medium" style={{color: 'var(--foreground)'}}>Тренинг-центр 📚</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            </button>

            <button className="w-full p-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.02]"
                    style={{background: 'transparent'}}>
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-orange-400">Завершить сессию 🚪</span>
              </div>
              <ChevronRight className="w-5 h-5" style={{color: 'var(--text-secondary)'}} />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>FitFinance Pro v1.0.0 💪</p>
        </div>
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}