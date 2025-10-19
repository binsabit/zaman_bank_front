'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({ percentage, size = 60, strokeWidth = 4 }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return '#4A90E2'; // Blue
    if (percent >= 60) return '#CCFF00'; // Electric lime
    if (percent >= 40) return '#FF6B35'; // Orange-red
    return '#EF4444'; // Red
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#2A2A4A"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getProgressColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{color: 'var(--foreground)'}}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface QuickActionProps {
  label: string;
  percentage?: number;
  onClick?: () => void;
  className?: string;
  isProductsCard?: boolean;
}

function QuickAction({ label, percentage, onClick, className, isProductsCard }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 aspect-square group",
        className
      )}
      style={{
        background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
        borderColor: 'var(--border)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      }}
    >
      {isProductsCard ? (
        <>
          <div className="mb-3 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300"
               style={{background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'}}>
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-medium transition-all duration-300" style={{color: 'var(--foreground)'}}>{label}</span>
        </>
      ) : (
        <>
          <div className="mb-3">
            <CircularProgress percentage={percentage!} />
          </div>
          <span className="text-sm font-medium transition-all duration-300" style={{color: 'var(--foreground)'}}>{label}</span>
        </>
      )}
    </button>
  );
}

const quickActions = [
  { label: 'Индекс сбережений', percentage: 75, action: () => console.log('Send') },
  { label: 'Индекс долгов', percentage: 45, action: () => console.log('Receive') },
  { label: 'Индекс импульсивности', percentage: 90, action: () => console.log('Pay Bills') },
  { label: 'Продукты', isProductsCard: true, action: () => console.log('Products') },
];

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn("px-4", className)}>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {quickActions.map((action, index) => (
          <QuickAction
            key={index}
            label={action.label}
            percentage={action.percentage}
            onClick={action.action}
            isProductsCard={action.isProductsCard}
          />
        ))}
      </div>
    </div>
  );
}