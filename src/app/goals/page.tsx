'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import CreateGoalModal from '@/components/CreateGoalModal';
import { Target, TrendingUp, Clock, Plus } from 'lucide-react';

const initialGoals = [
  {
    id: 1,
    name: "Резервный фонд",
    progress: 75,
    products: ["Счёт с высокой доходностью", "Фонд денежного рынка"],
    targetAmount: 10000,
    currentAmount: 7500,
    type: "savings"
  },
  {
    id: 2,
    name: "Первоначальный взнос за дом",
    progress: 45,
    products: ["Депозитный сертификат", "Инвестиционный портфель"],
    targetAmount: 50000,
    currentAmount: 22500,
    type: "savings"
  },
  {
    id: 3,
    name: "Пенсионные накопления",
    progress: 60,
    products: ["Пенсионный план 401(k)", "ИРА Рот", "Традиционная ИРА"],
    targetAmount: 100000,
    currentAmount: 60000,
    type: "savings"
  },
  {
    id: 4,
    name: "Фонд отпуска",
    progress: 30,
    products: ["Сберегательный счёт"],
    targetAmount: 5000,
    currentAmount: 1500,
    type: "savings"
  },
  {
    id: 5,
    name: "Консолидация долгов",
    progress: 25,
    products: ["Потребительский кредит", "Карта перевода баланса"],
    targetAmount: 15000,
    currentAmount: 3750,
    type: "debts"
  },
  {
    id: 6,
    name: "Погашение кредитной карты",
    progress: 40,
    products: ["Перевод баланса", "План управления долгами"],
    targetAmount: 8000,
    currentAmount: 3200,
    type: "debts"
  },
];

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState(initialGoals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'savings' | 'debts'>('all');

  const handleGoalClick = (goalId: number) => {
    router.push(`/goals/${goalId}`);
  };

  const handleGoalCreated = (newGoal: any) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'all') return true;
    return goal.type === activeFilter;
  });

  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0 sticky top-0 z-50" style={{background: 'var(--background)'}}>
        <Header
        title="Цели"
        showNotifications={false}
        rightElement={
          <button
            onClick={() => router.push('/agent?text=Я хочу ')}
            className="p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ml-3"
            style={{
              background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)',
              color: 'white'
            }}
          >
            <Plus className="w-5 h-5" />
          </button>
        }
        />
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 pb-24 pt-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0">

        <div className="mb-4 rounded-xl p-4 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 mr-2" style={{color: 'var(--primary)'}} />
            <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>Сводка по целям</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold" style={{color: 'var(--primary)'}}>{filteredGoals.length}</p>
              <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Активные цели</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{color: 'var(--accent)'}}>
                {filteredGoals.length > 0 ? Math.round(filteredGoals.reduce((acc, goal) => acc + goal.progress, 0) / filteredGoals.length) : 0}%
              </p>
              <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Средний прогресс</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex rounded-xl p-1" style={{background: 'var(--border)'}}>
            <button
              onClick={() => setActiveFilter('all')}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                background: activeFilter === 'all'
                  ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
                  : 'transparent',
                color: activeFilter === 'all' ? 'white' : 'var(--text-secondary)',
                boxShadow: activeFilter === 'all' ? '0 2px 10px rgba(255, 107, 53, 0.3)' : 'none'
              }}
            >
Все
            </button>
            <button
              onClick={() => setActiveFilter('savings')}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                background: activeFilter === 'savings'
                  ? 'linear-gradient(135deg, var(--primary-blue) 0%, #60A5FA 100%)'
                  : 'transparent',
                color: activeFilter === 'savings' ? 'white' : 'var(--text-secondary)',
                boxShadow: activeFilter === 'savings' ? '0 2px 10px rgba(74, 144, 226, 0.3)' : 'none'
              }}
            >
Накопления
            </button>
            <button
              onClick={() => setActiveFilter('debts')}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                background: activeFilter === 'debts'
                  ? 'linear-gradient(135deg, var(--primary-orange) 0%, #FF8A65 100%)'
                  : 'transparent',
                color: activeFilter === 'debts' ? 'white' : 'var(--text-secondary)',
                boxShadow: activeFilter === 'debts' ? '0 2px 10px rgba(255, 107, 53, 0.3)' : 'none'
              }}
            >
Долги
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => handleGoalClick(goal.id)}
              className="rounded-xl p-4 shadow-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
                borderColor: 'var(--border)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" style={{color: 'var(--primary)'}} />
                  <h3 className="font-semibold" style={{color: 'var(--foreground)'}}>{goal.name}</h3>
                </div>
                <span className="text-sm font-medium"
                      style={{color: goal.progress >= 80 ? 'var(--accent)' : 'var(--primary)'}}>
                  {goal.progress}%
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1" style={{color: 'var(--text-secondary)'}}>
                  <span>${goal.currentAmount.toLocaleString()}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full rounded-full h-2" style={{background: 'var(--border)'}}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${goal.progress}%`,
                      background: goal.progress >= 80
                        ? 'linear-gradient(90deg, var(--accent) 0%, var(--primary-blue) 100%)'
                        : 'linear-gradient(90deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-xs" style={{color: 'var(--text-secondary)'}}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Продукты: {goal.products.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {goal.products.slice(0, 2).map((product, index) => (
                    <span
                      key={index}
                      className="inline-block text-xs px-2 py-1 rounded"
                      style={{
                        background: 'var(--border)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {product}
                    </span>
                  ))}
                  {goal.products.length > 2 && (
                    <span className="inline-block text-xs px-2 py-1 rounded"
                          style={{
                            background: 'var(--border)',
                            color: 'var(--text-secondary)'
                          }}>
                      +{goal.products.length - 2} ещё
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />

      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
}