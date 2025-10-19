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
    description: 'Кофейня',
    category: 'Поддержка энергии',
    date: 'Сегодня',
    icon: Coffee,
  },
  {
    id: '2',
    type: 'income',
    amount: 2500.00,
    description: 'Поступление зарплаты',
    category: 'Получение энергии',
    date: 'Вчера',
    icon: ArrowDownLeft,
  },
  {
    id: '3',
    type: 'expense',
    amount: 89.99,
    description: 'Продуктовый магазин',
    category: 'Пополнение запасов',
    date: 'Вчера',
    icon: ShoppingBag,
  },
  {
    id: '4',
    type: 'expense',
    amount: 45.00,
    description: 'АЗС',
    category: 'Мобильность',
    date: '2 дня назад',
    icon: Car,
  },
  {
    id: '5',
    type: 'expense',
    amount: 1200.00,
    description: 'Оплата аренды',
    category: 'Базовые расходы',
    date: '3 дня назад',
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
    <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
         style={{
           background: 'linear-gradient(135deg, var(--card-bg) 0%, #2A2A4A 100%)',
           borderColor: 'var(--border)',
           boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
         }}>
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
          isIncome
            ? ""
            : ""
        )}
        style={{
          background: isIncome
            ? 'linear-gradient(135deg, var(--primary-blue) 0%, #60A5FA 100%)'
            : 'linear-gradient(135deg, var(--primary-orange) 0%, #FF8A65 100%)'
        }}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium" style={{color: 'var(--foreground)'}}>{transaction.description}</h4>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{transaction.category}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={cn(
          "font-bold",
          isIncome
            ? "text-blue-400"
            : "text-orange-400"
        )}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{transaction.date}</p>
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
        <h3 className="text-lg font-semibold" style={{color: 'var(--foreground)'}}>Последняя активность 🔥</h3>
        <button className="text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{color: 'var(--primary)'}}>
Посмотреть всё
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