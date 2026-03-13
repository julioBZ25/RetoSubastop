'use client';

import React from 'react';
import { Package2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-dashsuba-surface">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-dashsuba-border bg-white px-4 md:px-6">
        <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <div className="flex items-center gap-2 rounded-lg bg-dashsuba-primary p-2 text-white">
            <Package2 className="h-5 w-5" />
          </div>
          <span className="text-dashsuba-primary hidden md:inline">DashSuba Inventory</span>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-dashsuba-border bg-white p-4 text-center text-sm text-dashsuba-secondary">
        &copy; {new Date().getFullYear()} DashSuba Pro.
      </footer>
    </div>
  );
};
