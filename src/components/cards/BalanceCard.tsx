'use client';

import { Eye, EyeOff, TrendingUp, Zap, Target } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  subtitle?: string;
  className?: string;
}

export default function BalanceCard({
  balance,
  currency = "USD",
  subtitle = "Оценка финансового здоровья",
  className
}: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate fitness-style health score (0-100) based on balance
  const healthScore = Math.min(Math.round((balance / 15000) * 100), 100);
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4A90E2'; // Blue
    if (score >= 60) return '#CCFF00'; // Electric lime
    return '#FF6B35'; // Orange
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    if (score >= 40) return 'Удовлетворительно';
    return 'Нуждается в работе';
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl p-6 text-white transition-all duration-300 hover:scale-[1.02]",
      className
    )}
    style={{
      background: `linear-gradient(135deg, rgb(255, 107, 53) 0%, rgb(0, 0, 0) 50%, rgb(74, 144, 226) 100%)`,
      boxShadow: 'rgba(255, 107, 53, 0.3) 0px 10px 30px'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Fitness-style decorative elements */}
      <div className="absolute top-4 right-4">
        <div className="flex space-x-1">
          <div className="w-1 h-8 bg-white/30 rounded animate-pulse"></div>
          <div className="w-1 h-6 bg-white/40 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-1 h-10 bg-white/50 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
          <div className="w-1 h-4 bg-white/30 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <p className="text-white/90 text-sm font-medium">{subtitle}</p>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-white/80" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/80" />
            )}
          </button>
        </div>

        {/* Health Score Display */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-3">
            <div className="text-4xl font-bold text-white">
              {isVisible ? healthScore : '***'}
            </div>
            <div className="text-lg text-white/80">
              {isVisible ? '/100' : ''}
            </div>
          </div>
          <div className="text-sm text-white/70 mt-1">
            {isVisible ? getScoreLevel(healthScore) : 'Скрыто'}
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-4">
          {isVisible ? (
            <h2 className="text-2xl font-semibold text-white/90">
              {formatBalance(balance)}
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold text-white/90">
              {"*".repeat(8)}
            </h2>
          )}
        </div>

        {/* Fitness-style metrics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-blue-300" />
            <span className="text-white/80">+2.5% в этом месяце</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-blue-300" />
            <span className="text-white/80">Цель: $15K</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Прогресс к цели</span>
            <span>{Math.round((balance / 15000) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((balance / 15000) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #4A90E2 0%, #CCFF00 100%)'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}