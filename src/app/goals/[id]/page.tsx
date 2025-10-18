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
    name: "Emergency Fund",
    description: "Build a safety net for unexpected expenses. This fund will cover 6 months of living expenses and provide financial security.",
    progress: 75,
    products: [
      {
        name: "High-Yield Savings Account",
        description: "FDIC-insured savings account with competitive APY",
        rate: "4.5% APY",
        balance: 5000
      },
      {
        name: "Money Market Fund",
        description: "Low-risk investment fund with higher yields than traditional savings",
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
    name: "House Down Payment",
    description: "Save for a 20% down payment on a $250,000 home to avoid PMI and secure better mortgage terms.",
    progress: 45,
    products: [
      {
        name: "Certificate of Deposit",
        description: "12-month CD with guaranteed returns",
        rate: "5.2% APY",
        balance: 15000
      },
      {
        name: "Investment Portfolio",
        description: "Diversified portfolio of stocks and bonds",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Goal not found</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title={goal.name}
        showNotifications={false}
        leftElement={
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

      <div className="flex-1 max-w-md mx-auto w-full px-4 pb-24 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Target className="w-6 h-6 text-[#2D9A86] mr-2" />
            <h2 className="text-xl font-bold text-gray-900">{goal.name}</h2>
          </div>
          <p className="text-gray-600 mb-4">{goal.description}</p>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>${goal.currentAmount.toLocaleString()}</span>
              <span>{goal.progress}%</span>
              <span>${goal.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#2D9A86] h-3 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">{duration} months</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <p className="text-gray-500">Monthly</p>
                <p className="font-medium">${goal.monthlyContribution}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Bank Products</h3>
          <div className="space-y-3">
            {goal.products.map((product, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <span className="text-sm font-medium text-[#2D9A86]">{product.rate}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm font-medium">Balance: ${product.balance.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
          <div className="mb-4">
            <div className="h-56 border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-x-auto">
              <svg width="500" height="100%" viewBox="0 0 500 160" className="min-w-full">
                <defs>
                  <pattern id="grid" width="30" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 24" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.5"/>
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
                          stroke="#2D9A86"
                          strokeWidth="2"
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
                          r="4"
                          fill="#2D9A86"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y="170"
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {payment.date.split('-')[1]}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g className="text-xs fill-gray-500">
                  <text x="15" y="25" textAnchor="start">${maxAmount}</text>
                  <text x="15" y="85" textAnchor="start">${Math.round(maxAmount / 2)}</text>
                  <text x="15" y="145" textAnchor="start">$0</text>
                </g>
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Monthly payment trends over the last 10 months</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Comparison</h3>
          <p className="text-sm text-gray-600 mb-4">
            Compare your current profile (red) with the ideal profile (green) needed to achieve this goal.
          </p>

          <ProfileTriangle
            currentProfile={userProfile}
            idealProfile={goal.idealProfile}
            size={180}
          />

        </div>
      </div>

      <BottomNav />
    </div>
  );
}