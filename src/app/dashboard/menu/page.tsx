'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Menu Items</h2>
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
            <p className="text-gray-500">No menu items found. Upload a menu to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}

