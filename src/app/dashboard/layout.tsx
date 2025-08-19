"use client";

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import SignOutButton from '@/components/SignOutButton';

interface UserRole {
  isOwner: boolean;
  isManager: boolean;
  isStaff: boolean;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>({ isOwner: false, isManager: false, isStaff: false });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is a staff member
        const { data: staffMember } = await supabase
          .from("restaurant_staff")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (staffMember) {
          setUserRole({
            isOwner: false,
            isManager: staffMember.role === 'manager',
            isStaff: staffMember.role === 'staff'
          });
        } else {
          // User is an owner
          setUserRole({
            isOwner: true,
            isManager: false,
            isStaff: false
          });
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-2xl font-bold text-indigo-600">OrderPilot</h1>
        </div>
        
        {/* Role indicator */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="text-sm text-gray-600">
            {userRole.isOwner && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Owner</span>}
            {userRole.isManager && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Manager</span>}
            {userRole.isStaff && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Staff</span>}
          </div>
        </div>

        <nav className="mt-4">
          <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
            <span>Dashboard</span>
          </Link>
          
          <Link href="/dashboard/menu" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
            <span>Menu</span>
          </Link>
          
          {/* Only show settings for owners and managers */}
          {(userRole.isOwner || userRole.isManager) && (
            <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <span>Settings</span>
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex justify-between items-center px-6">
          <div className="text-sm text-gray-600">
            {userRole.isOwner && "Restaurant Owner Dashboard"}
            {userRole.isManager && "Manager Dashboard"}
            {userRole.isStaff && "Staff Dashboard"}
          </div>
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

