'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface UserRole {
  isOwner: boolean;
  isManager: boolean;
  isStaff: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userRole, setUserRole] = useState<UserRole>({ isOwner: false, isManager: false, isStaff: false });

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
      }
    };

    checkUserRole();
  }, [supabase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // First, get the user's restaurant
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found.");

      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (restaurantError || !restaurant) throw new Error("Restaurant not found.");

      formData.append('restaurantId', restaurant.id);
      
      // Upload and process the menu
      const response = await fetch('/api/menus/ingest', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ingest menu.');
      }

      // Refresh menu items from the database
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurant.id);

      if (itemsError) throw itemsError;
      
      setMenuItems(items as MenuItem[]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canEditMenu = userRole.isOwner || userRole.isManager;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
      
      {/* Role-based header */}
      <div className="mt-2 mb-6">
        {userRole.isStaff && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">View Only Mode</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>As a staff member, you can view the menu but cannot make changes. Contact a manager or owner to update the menu.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Upload Section - Only for owners and managers */}
      {canEditMenu && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Upload Menu PDF</h2>
          <div className="mt-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {canEditMenu ? 'Your Menu Items' : 'Menu Items'}
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                <p className="text-lg font-bold text-gray-800 mt-3">${item.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
              <p className="mt-1 text-sm text-gray-500">
                {canEditMenu 
                  ? "Upload a menu to get started." 
                  : "No menu items available yet."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

