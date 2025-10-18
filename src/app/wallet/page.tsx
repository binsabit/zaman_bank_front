'use client';

import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Wallet" showNotifications={false} />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#2D9A86] to-[#1e6b5c] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Total Balance</h2>
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold mb-2">$12,450.75</p>
          <p className="text-sm opacity-80">Available balance</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-[#2D9A86] rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Send</span>
          </button>

          <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-[#2D9A86] rounded-full flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Receive</span>
          </button>

          <button className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-[#2D9A86] rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Money</span>
          </button>
        </div>

        {/* Account Cards */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Your Accounts</h3>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Checking Account</h4>
                <p className="text-sm text-gray-500">•••• 4567</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">$8,230.50</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Savings Account</h4>
                <p className="text-sm text-gray-500">•••• 8901</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">$4,220.25</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Coffee Shop</p>
                  <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                </div>
              </div>
              <p className="font-semibold text-red-600">-$5.50</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Salary Deposit</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">+$3,200.00</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}