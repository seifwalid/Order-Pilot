import Link from 'next/link';
import { ReactNode } from 'react';
import SignOutButton from '@/components/SignOutButton';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-2xl font-bold text-indigo-600">OrderPilot</h1>
        </div>
        <nav className="mt-4">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/menu" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
            <span>Menu</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex justify-end items-center px-6">
            <SignOutButton />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

