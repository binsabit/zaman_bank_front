import Header from '@/components/navigation/Header';
import BalanceCard from '@/components/cards/BalanceCard';
import QuickActions from '@/components/cards/QuickActions';
import TransactionList from '@/components/cards/TransactionList';
import BottomNav from '@/components/navigation/BottomNav';

export default function Home() {
  return (
    <div className="h-screen h-dvh flex flex-col" style={{background: 'var(--background)'}}>
      <div className="flex-shrink-0">
        <Header userName="John" />
      </div>

      <main className="flex-1 overflow-y-auto max-w-md mx-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-20">
        <div className="px-4 py-6">
          <BalanceCard
            balance={12450.75}
            subtitle="Financial Health Score"
            className="mb-6"
          />
        </div>

        <QuickActions className="mb-8" />

        <TransactionList />
      </main>

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
