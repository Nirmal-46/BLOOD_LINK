import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DemoSwitcher } from './DemoSwitcher';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-12 sm:pb-0">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <DemoSwitcher />
    </div>
  );
}
