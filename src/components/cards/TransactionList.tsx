'use client';

import { ArrowUpRight, ArrowDownLeft, Coffee, Car, Home, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 4.50,
    description: 'Coffee Shop',
    category: 'Food & Drink',
    date: 'Today',
    icon: Coffee,
  },
  {
    id: '2',
    type: 'income',
    amount: 2500.00,
    description: 'Salary Deposit',
    category: 'Income',
    date: 'Yesterday',
    icon: ArrowDownLeft,
  },
  {
    id: '3',
    type: 'expense',
    amount: 89.99,
    description: 'Grocery Store',
    category: 'Shopping',
    date: 'Yesterday',
    icon: ShoppingBag,
  },
  {
    id: '4',
    type: 'expense',
    amount: 45.00,
    description: 'Gas Station',
    category: 'Transportation',
    date: '2 days ago',
    icon: Car,
  },
  {
    id: '5',
    type: 'expense',
    amount: 1200.00,
    description: 'Rent Payment',
    category: 'Housing',
    date: '3 days ago',
    icon: Home,
  },
];

interface TransactionItemProps {
  transaction: Transaction;
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const IconComponent = transaction.icon;
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isIncome
            ? "bg-green-50"
            : "bg-gray-50"
        )}>
          <IconComponent className={cn(
            "w-6 h-6",
            isIncome
              ? "text-green-600"
              : "text-gray-600"
          )} />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
          <p className="text-sm text-gray-500">{transaction.category}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={cn(
          "font-semibold",
          isIncome
            ? "text-green-600"
            : "text-gray-900"
        )}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">{transaction.date}</p>
      </div>
    </div>
  );
}

interface TransactionListProps {
  className?: string;
}

export default function TransactionList({ className }: TransactionListProps) {
  return (
    <div className={cn("px-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
          See All
        </button>
      </div>

      <div className="space-y-3">
        {mockTransactions.slice(0, 4).map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}