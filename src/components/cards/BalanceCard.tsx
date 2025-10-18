'use client';

import { Eye, EyeOff } from 'lucide-react';
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
  subtitle = "Total Balance",
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

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 text-white",
      className
    )}
    style={{
      background: `linear-gradient(135deg, #2D9A86 0%, #EEFE6D 100%)`
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/80 text-sm font-medium">{subtitle}</p>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-white/80" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/80" />
            )}
          </button>
        </div>

        <div className="mb-4">
          {isVisible ? (
            <h2 className="text-3xl font-bold">
              {formatBalance(balance)}
            </h2>
          ) : (
            <h2 className="text-3xl font-bold">
              {"*".repeat(8)}
            </h2>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <span className="text-white/80">+2.5% from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
}