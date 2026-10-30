import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DemoSwitcher } from './DemoSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { Menu, Bell, ShieldCheck, Heart } from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';

export function DashboardLayout() {
  const { currentUser } = useAuth();
  const { notifications } = useBloodData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const userUnreadCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 pb-16 lg:pb-0">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 fixed inset-y-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition flex items-center gap-1">
                <span>BloodConnect</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-800 capitalize">
                {currentUser?.role} Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Leak Privacy Engine</span>
            </div>

            <Link
              to="/notifications"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {userUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </Link>

            <Link to="/profile" className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          <Outlet />
        </main>
      </div>

      {/* Floating Demo Role Switcher for Hackathon Judges */}
      <DemoSwitcher />
    </div>
  );
}
