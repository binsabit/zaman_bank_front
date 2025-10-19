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
  { id: 'home', label: 'Главная', icon: Home, path: '/' },
  { id: 'agent', label: 'Агент', icon: Bot, path: '/agent' },
  { id: 'wallet', label: 'Кошелёк', icon: CreditCard, path: '/wallet' },
  { id: 'goals', label: 'Цели', icon: Target, path: '/goals' },
  { id: 'profile', label: 'Профиль', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t px-4 py-2 safe-area-pb backdrop-blur-lg"
         style={{
           background: 'var(--card-bg)',
           borderColor: 'var(--border)',
           boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)'
         }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[60px] relative",
                isActive
                  ? "transform scale-110"
                  : "hover:scale-105"
              )}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-blue) 100%)'
                  : 'transparent'
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 w-8 h-1 rounded-full animate-pulse"
                     style={{background: 'var(--accent)'}}></div>
              )}

              <IconComponent
                className={cn(
                  "w-6 h-6 mb-1 transition-all duration-300",
                  isActive ? "text-white" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? "text-white" : "text-gray-500"
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