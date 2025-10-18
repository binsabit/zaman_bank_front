'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, CreditCard, Target, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'agent', label: 'Agent', icon: Bot, path: '/agent' },
  { id: 'wallet', label: 'Wallet', icon: CreditCard, path: '/wallet' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px]",
                isActive
                  ? "text-[#2D9A86]"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <IconComponent
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-[#2D9A86]" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-[#2D9A86]" : "text-gray-500"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}