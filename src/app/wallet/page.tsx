'use client';

import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

export default function WalletPage() {
  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0 sticky top-0 z-50" style={{background: 'var(--background)'}}>
        <Header title="Кошелёк" showNotifications={false} />
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full p-4 pb-24 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0">
        {/* Balance Card - Fitness Style */}
        <div className="rounded-3xl p-6 text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
             style={{
               background: 'linear-gradient(119deg, rgb(255, 107, 53) 0%, rgb(0, 0, 0) 50%, rgb(63, 129, 207) 100%)',
               boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)'
             }}>
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Баланс счёта</h2>
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold mb-2">$12,450.75</p>
            <p className="text-sm opacity-80">Доступный баланс</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="rounded-2xl p-4 shadow-lg border transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'}}>
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium" style={{color: 'var(--foreground)'}}>Перевод</span>
          </button>

          <button className="rounded-2xl p-4 shadow-lg border transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, var(--primary-blue) 0%, #60A5FA 100%)'}}>
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium" style={{color: 'var(--foreground)'}}>Пополнение</span>
          </button>

          <button className="rounded-2xl p-4 shadow-lg border transition-all duration-300 hover:scale-105 flex flex-col items-center space-y-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{background: 'linear-gradient(135deg, var(--accent) 0%, #A3E635 100%)'}}>
              <Plus className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-medium" style={{color: 'var(--foreground)'}}>Добавить счёт</span>
          </button>
        </div>

        {/* Accounts */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>Ваши счета</h3>

          <div className="rounded-xl p-4 shadow-lg border transition-all duration-300 hover:scale-[1.02]"
               style={{
                 background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                 borderColor: 'var(--border)',
                 boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
               }}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium" style={{color: 'var(--foreground)'}}>Текущий счёт</h4>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>•••• 4567</p>
              </div>
              <p className="text-lg font-semibold text-orange-400">$8,230.50</p>
            </div>
          </div>

          <div className="rounded-xl p-4 shadow-lg border transition-all duration-300 hover:scale-[1.02]"
               style={{
                 background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                 borderColor: 'var(--border)',
                 boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
               }}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium" style={{color: 'var(--foreground)'}}>Сберегательный счёт</h4>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>•••• 8901</p>
              </div>
              <p className="text-lg font-semibold text-blue-400">$4,220.25</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>Последние операции</h3>

          <div className="rounded-xl p-4 shadow-lg border space-y-3"
               style={{
                 background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                 borderColor: 'var(--border)',
                 boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, #FF8A65 100%)'}}>
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium" style={{color: 'var(--foreground)'}}>Покупка кофе</p>
                  <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Сегодня, 14:30</p>
                </div>
              </div>
              <p className="font-semibold text-orange-400">-$5.50</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                     style={{background: 'linear-gradient(135deg, var(--primary-blue) 0%, #60A5FA 100%)'}}>
                  <ArrowDownLeft className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium" style={{color: 'var(--foreground)'}}>Прямое поступление</p>
                  <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Вчера</p>
                </div>
              </div>
              <p className="font-semibold text-blue-400">+$3,200.00</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}