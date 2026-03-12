'use client';

import React from 'react';
import { Package2, Search, Settings, Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

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
        
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              {/* This search will be handled by search params in the feature component */}
            </div>
          </form>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5 text-dashsuba-secondary" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {children}
        </div>
      </main>
      
      <footer className="border-t border-dashsuba-border bg-white p-4 text-center text-sm text-dashsuba-secondary">
        &copy; {new Date().getFullYear()} DashSuba Pro. Built with Next.js 15 & Redux.
      </footer>
    </div>
  );
};
