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

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#2D9A86"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-900">
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
        "flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-105 aspect-square group",
        className
      )}
      style={{
        transition: 'all 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#EEFE6D';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isProductsCard ? (
        <>
          <div className="mb-3 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white/80">
            <ChevronRight className="w-8 h-8 text-[#2D9A86]" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
        </>
      ) : (
        <>
          <div className="mb-3">
            <CircularProgress percentage={percentage!} />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
        </>
      )}
    </button>
  );
}

const quickActions = [
  { label: 'Savings Index', percentage: 75, action: () => console.log('Send') },
  { label: 'Debt Index', percentage: 45, action: () => console.log('Receive') },
  { label: 'Impulsivity index', percentage: 90, action: () => console.log('Pay Bills') },
  { label: 'Products', isProductsCard: true, action: () => console.log('Products') },
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