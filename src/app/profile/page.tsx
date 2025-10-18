'use client';

import Header from '@/components/navigation/Header';
import BottomNav from '@/components/navigation/BottomNav';
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Profile" showNotifications={false} />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xl font-medium">J</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-500">john.doe@example.com</p>
              <p className="text-sm text-[#2D9A86] font-medium">Premium Member</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Account Settings</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">General Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">Security & Privacy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Support</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="font-medium text-red-600">Sign Out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Finance App v1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}