import Header from '@/components/navigation/Header';
import BalanceCard from '@/components/cards/BalanceCard';
import QuickActions from '@/components/cards/QuickActions';
import TransactionList from '@/components/cards/TransactionList';
import BottomNav from '@/components/navigation/BottomNav';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header userName="John" />

      <main className="max-w-md mx-auto">
        <div className="px-4 py-6">
          <BalanceCard
            balance={12450.75}
            subtitle="Total Balance"
            className="mb-6"
          />
        </div>

        <QuickActions className="mb-8" />

        <TransactionList />
      </main>

      <BottomNav />
    </div>
  );
}
