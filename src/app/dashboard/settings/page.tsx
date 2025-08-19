'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Restaurant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface StaffMember {
  id: string;
  email: string; // Assuming we can get the email from the user profile
  role: 'manager' | 'staff';
}

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'manager'>('staff');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);


  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        // Fetch restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_id', user.id)
          .single();
        if (restaurantError) throw restaurantError;
        setRestaurant(restaurantData);

        // Fetch staff members
        // This is a simplified fetch. We'll need to join with auth.users to get emails.
        const { data: staffData, error: staffError } = await supabase
          .from('restaurant_staff')
          .select('user_id, role')
          .eq('restaurant_id', restaurantData.id);
          
        if (staffError) throw staffError;

        // For now, we'll just show the user IDs. We'll enhance this later.
        const staffList = staffData.map(s => ({ id: s.user_id, email: s.user_id, role: s.role }));
        setStaff(staffList as StaffMember[]);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleRestaurantUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update logic will go here
    alert('Update functionality coming soon!');
  };

  const handleInviteStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage(null);

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        const response = await fetch('/api/staff/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                email: inviteEmail,
                role: inviteRole,
                restaurantId: restaurant?.id,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            if (result.migration_file) {
                throw new Error(`Database setup required: ${result.error}. Please run the migration file: ${result.migration_file}`);
            }
            throw new Error(result.error || 'Failed to send invitation.');
        }

        setInviteMessage(`Invitation sent to ${inviteEmail}.`);
        setInviteEmail('');

        // Here you might want to refresh the list of invitations, not staff.
        // For now, we'll just show a success message.

    } catch (err: any) {
        setInviteMessage(err.message);
    } finally {
        setInviteLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      
      {/* Restaurant Details Form */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700">Restaurant Information</h2>
        <form onSubmit={handleRestaurantUpdate} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" defaultValue={restaurant?.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" defaultValue={restaurant?.email ?? ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" id="phone" defaultValue={restaurant?.phone ?? ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" defaultValue={restaurant?.address ?? ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </div>

      {/* Staff Management */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700">Staff Management</h2>
        <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800">Current Staff</h3>
            <ul className="mt-2 space-y-2">
                {staff.map(member => (
                    <li key={member.id} className="flex justify-between items-center p-2 border rounded-md">
                        <span>{member.email}</span>
                        <span className="capitalize font-semibold">{member.role}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800">Invite New Staff</h3>
            <form onSubmit={handleInviteStaff} className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                    <input 
                        type="email" 
                        placeholder="new.staff@example.com" 
                        className="flex-grow block w-full rounded-md border-gray-300 shadow-sm" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                    />
                    <select 
                        className="rounded-md border-gray-300 shadow-sm"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'staff' | 'manager')}
                    >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        disabled={inviteLoading}
                    >
                        {inviteLoading ? 'Sending...' : 'Invite'}
                    </button>
                </div>
                {inviteMessage && <p className="text-sm text-gray-600">{inviteMessage}</p>}
            </form>
        </div>
      </div>
    </div>
  );
}
