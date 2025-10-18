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
    name: "Emergency Fund",
    progress: 75,
    products: ["High-Yield Savings Account", "Money Market Fund"],
    targetAmount: 10000,
    currentAmount: 7500,
    type: "savings"
  },
  {
    id: 2,
    name: "House Down Payment",
    progress: 45,
    products: ["Certificate of Deposit", "Investment Portfolio"],
    targetAmount: 50000,
    currentAmount: 22500,
    type: "savings"
  },
  {
    id: 3,
    name: "Retirement Savings",
    progress: 60,
    products: ["401(k)", "Roth IRA", "Traditional IRA"],
    targetAmount: 100000,
    currentAmount: 60000,
    type: "savings"
  },
  {
    id: 4,
    name: "Vacation Fund",
    progress: 30,
    products: ["Savings Account"],
    targetAmount: 5000,
    currentAmount: 1500,
    type: "savings"
  },
  {
    id: 5,
    name: "Debt Consolidation",
    progress: 25,
    products: ["Personal Loan", "Balance Transfer Card"],
    targetAmount: 15000,
    currentAmount: 3750,
    type: "debts"
  },
  {
    id: 6,
    name: "Credit Card Payoff",
    progress: 40,
    products: ["Balance Transfer", "Debt Management Plan"],
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title="Goals"
        showNotifications={false}
        rightElement={
          <button
            onClick={() => router.push('/agent?text=I want to ')}
            className="bg-[#2D9A86] text-white p-2 rounded-full shadow-lg hover:bg-[#258b7a] transition-colors ml-3"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pb-24">

        <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-[#2D9A86] mr-2" />
            <h3 className="font-semibold text-gray-900">Goal Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#2D9A86]">{filteredGoals.length}</p>
              <p className="text-xs text-gray-600">Active Goals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D9A86]">
                {filteredGoals.length > 0 ? Math.round(filteredGoals.reduce((acc, goal) => acc + goal.progress, 0) / filteredGoals.length) : 0}%
              </p>
              <p className="text-xs text-gray-600">Avg Progress</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-[#2D9A86] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Goals
            </button>
            <button
              onClick={() => setActiveFilter('savings')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'savings'
                  ? 'bg-white text-[#2D9A86] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Savings
            </button>
            <button
              onClick={() => setActiveFilter('debts')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'debts'
                  ? 'bg-white text-[#2D9A86] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Debts
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => handleGoalClick(goal.id)}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-[#2D9A86] mr-2" />
                  <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                </div>
                <span className="text-sm font-medium text-[#2D9A86]">{goal.progress}%</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>${goal.currentAmount.toLocaleString()}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#2D9A86] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Products: {goal.products.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {goal.products.slice(0, 2).map((product, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded"
                    >
                      {product}
                    </span>
                  ))}
                  {goal.products.length > 2 && (
                    <span className="inline-block bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded">
                      +{goal.products.length - 2} more
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