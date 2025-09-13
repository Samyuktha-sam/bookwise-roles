import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { LeftNav } from './LeftNav';

export function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}