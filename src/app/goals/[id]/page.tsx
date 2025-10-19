'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import { ArrowLeft, Target, Calendar, TrendingUp, DollarSign, Clock, ChevronDown, ChevronUp, Info } from 'lucide-react';
import ProfileTriangle from '@/components/ProfileTriangle';

const goalData = {
  1: {
    id: 1,
    name: "Резервный фонд",
    description: "Создайте страховочную сеть для неожиданных расходов. Этот фонд покроет 6 месяцев жизненных расходов и обеспечит финансовую безопасность.",
    progress: 75,
    products: [
      {
        name: "Счёт с высокой доходностью",
        description: "Страхованный сберегательный счёт с конкурентной ставкой",
        rate: "4.5% APY",
        balance: 5000
      },
      {
        name: "Фонд денежного рынка",
        description: "Малорисковый инвестиционный фонд с более высокой доходностью",
        rate: "3.8% APY",
        balance: 2500
      }
    ],
    targetAmount: 10000,
    currentAmount: 7500,
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    monthlyContribution: 625,
    idealProfile: {
      savingsIndex: 90,
      debtIndex: 20,
      impulsiveIndex: 10
    },
    paymentHistory: [
      { date: "2024-01", amount: 1000 },
      { date: "2024-02", amount: 625 },
      { date: "2024-03", amount: 625 },
      { date: "2024-04", amount: 625 },
      { date: "2024-05", amount: 625 },
      { date: "2024-06", amount: 625 },
      { date: "2024-07", amount: 625 },
      { date: "2024-08", amount: 625 },
      { date: "2024-09", amount: 625 },
      { date: "2024-10", amount: 625 }
    ],
    futureDates: [
      { date: "2024-11-15", amount: 625, type: "deposit" },
      { date: "2024-12-15", amount: 625, type: "deposit" }
    ]
  },
  2: {
    id: 2,
    name: "Первоначальный взнос за дом",
    description: "Накопите 20% первоначального взноса за дом стоимостью $250,000, чтобы избежать PMI и получить лучшие условия ипотеки.",
    progress: 45,
    products: [
      {
        name: "Депозитный сертификат",
        description: "12-месячный депозит с гарантированной доходностью",
        rate: "5.2% APY",
        balance: 15000
      },
      {
        name: "Инвестиционный портфель",
        description: "Диверсифицированный портфель акций и облигаций",
        rate: "7.8% avg return",
        balance: 7500
      }
    ],
    targetAmount: 50000,
    currentAmount: 22500,
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    monthlyContribution: 900,
    idealProfile: {
      savingsIndex: 70,
      debtIndex: 10,
      impulsiveIndex: 30
    },
    paymentHistory: [
      { date: "2024-01", amount: 900 },
      { date: "2024-02", amount: 900 },
      { date: "2024-03", amount: 900 },
      { date: "2024-04", amount: 900 },
      { date: "2024-05", amount: 900 },
      { date: "2024-06", amount: 900 },
      { date: "2024-07", amount: 900 },
      { date: "2024-08", amount: 900 },
      { date: "2024-09", amount: 900 },
      { date: "2024-10", amount: 900 }
    ],
    futureDates: [
      { date: "2024-11-01", amount: 900, type: "deposit" },
      { date: "2024-12-01", amount: 900, type: "deposit" },
      { date: "2025-01-01", amount: 900, type: "deposit" }
    ]
  }
};

const userProfile = {
  savingsIndex: 80,
  debtIndex: 30,
  impulsiveIndex: 20,
  savings: {
    accounts: [
      { name: "Primary Savings", balance: 15000, rate: "4.2%" },
      { name: "Emergency Fund", balance: 7500, rate: "4.5%" },
      { name: "CD - 12 Month", balance: 15000, rate: "5.2%" }
    ],
    deposits: [
      { name: "Auto-Save Weekly", amount: 150, frequency: "weekly" },
      { name: "Goal Contribution", amount: 625, frequency: "monthly" }
    ]
  },
  debts: [
    { name: "Credit Card", balance: 2500, rate: "18.9%", payment: 150 },
    { name: "Student Loan", balance: 8500, rate: "4.5%", payment: 200 }
  ],
  impulsivePurchases: {
    period: "Last 30 days",
    transactions: [
      { date: "2024-10-15", description: "Coffee Shop", amount: 45 },
      { date: "2024-10-12", description: "Online Shopping", amount: 120 },
      { date: "2024-10-08", description: "Restaurant", amount: 75 },
      { date: "2024-10-05", description: "Subscription Service", amount: 25 }
    ],
    total: 265
  }
};

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = params.id as string;
  const goal = goalData[goalId as keyof typeof goalData];

  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--background)'}}>
        <p style={{color: 'var(--text-secondary)'}}>Цель не найдена</p>
      </div>
    );
  }

  const duration = Math.ceil(
    (new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  const maxAmount = Math.max(...goal.paymentHistory.map(p => p.amount));

  const toggleIndex = (index: string) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getIndexColor = (value: number) => {
    if (value >= 0.7) return "text-green-600 bg-green-100";
    if (value >= 0.4) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0 sticky top-0 z-50" style={{background: 'var(--background)'}}>
        <Header
        title={goal.name}
        showNotifications={false}
        leftElement={
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{background: 'var(--card-bg)', color: 'var(--foreground)'}}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
        />
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 pb-24 pt-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0">
        <div className="rounded-xl p-4 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="flex items-center mb-3">
            <Target className="w-6 h-6 mr-2" style={{color: 'var(--primary)'}} />
            <h2 className="text-xl font-bold" style={{color: 'var(--foreground)'}}>{goal.name}</h2>
          </div>
          <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{goal.description}</p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2" style={{color: 'var(--text-secondary)'}}>
              <span>${goal.currentAmount.toLocaleString()}</span>
              <span>{goal.progress}%</span>
              <span>${goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full rounded-full h-3" style={{background: 'var(--border)'}}>
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${goal.progress}%`,
                  background: goal.progress >= 80
                    ? 'linear-gradient(90deg, var(--accent) 0%, var(--primary-blue) 100%)'
                    : 'linear-gradient(90deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" style={{color: 'var(--primary)'}} />
              <div>
                <p style={{color: 'var(--text-secondary)'}}>Продолжительность</p>
                <p className="font-medium" style={{color: 'var(--foreground)'}}>{duration} месяцев</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" style={{color: 'var(--primary)'}} />
              <div>
                <p style={{color: 'var(--text-secondary)'}}>Ежемесячно</p>
                <p className="font-medium" style={{color: 'var(--foreground)'}}>${goal.monthlyContribution}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <h3 className="font-semibold mb-3" style={{color: 'var(--foreground)'}}>История платежей</h3>
          <div className="mb-4">
            <div className="h-56 border rounded-lg p-4 overflow-x-auto"
                 style={{
                   borderColor: 'var(--border)',
                   background: 'rgba(255, 255, 255, 0.05)'
                 }}>
              <svg width="500" height="100%" viewBox="0 0 500 160" className="min-w-full">
                <defs>
                  <pattern id="grid" width="30" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" opacity="0.5"/>
                  </pattern>
                </defs>

                <rect width="500" height="160" fill="url(#grid)" />

                <g>
                  {goal.paymentHistory.slice(-10).map((payment, index) => {
                    const x = (index / (goal.paymentHistory.slice(-10).length - 1)) * 280 + 55;
                    const y = 130 - ((payment.amount / maxAmount) * 110);
                    const nextPayment = goal.paymentHistory.slice(-10)[index + 1];

                    if (nextPayment && index < goal.paymentHistory.slice(-10).length - 1) {
                      const nextX = ((index + 1) / (goal.paymentHistory.slice(-10).length - 1)) * 280 + 55;
                      const nextY = 130 - ((nextPayment.amount / maxAmount) * 110);

                      return (
                        <line
                          key={`line-${index}`}
                          x1={x}
                          y1={y}
                          x2={nextX}
                          y2={nextY}
                          stroke="#FF6B35"
                          strokeWidth="3"
                          className="opacity-80"
                        />
                      );
                    }
                    return null;
                  })}

                  {goal.paymentHistory.slice(-10).map((payment, index) => {
                    const x = (index / (goal.paymentHistory.slice(-10).length - 1)) * 280 + 55;
                    const y = 130 - ((payment.amount / maxAmount) * 110);

                    return (
                      <g key={`point-${index}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#4A90E2"
                          className="hover:r-7 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y="170"
                          textAnchor="middle"
                          className="text-xs"
                          fill="var(--text-secondary)"
                        >
                          {payment.date.split('-')[1]}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g className="text-xs" fill="var(--text-secondary)">
                  <text x="15" y="25" textAnchor="start">${maxAmount}</text>
                  <text x="15" y="85" textAnchor="start">${Math.round(maxAmount / 2)}</text>
                  <text x="15" y="145" textAnchor="start">$0</text>
                </g>
              </svg>
            </div>
            <p className="text-xs mt-2" style={{color: 'var(--text-secondary)'}}>Тренды ежемесячных платежей за последние 10 месяцев</p>
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <h3 className="font-semibold mb-4" style={{color: 'var(--foreground)'}}>Сравнение профилей</h3>
          <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
Сравните ваш текущий профиль (красный) с идеальным профилем (зелёный), необходимым для достижения этой цели.
          </p>

          <ProfileTriangle
            currentProfile={userProfile}
            idealProfile={goal.idealProfile}
            size={180}
          />

        </div>

        <div className="rounded-xl p-4 shadow-lg border"
             style={{
               background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
               borderColor: 'var(--border)',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
             }}>
          <h3 className="font-semibold mb-3" style={{color: 'var(--foreground)'}}>Продукты</h3>
          <div className="space-y-3">
            {goal.products.map((product, index) => (
              <div key={index} className="border rounded-lg p-3"
                   style={{
                     borderColor: 'var(--border)',
                     background: 'rgba(255, 255, 255, 0.05)'
                   }}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium" style={{color: 'var(--foreground)'}}>{product.name}</h4>
                  <span className="text-sm font-medium" style={{color: 'var(--accent)'}}>{product.rate}</span>
                </div>
                <p className="text-sm mb-2" style={{color: 'var(--text-secondary)'}}>{product.description}</p>
                <p className="text-sm font-medium" style={{color: 'var(--foreground)'}}>Баланс: ${product.balance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}