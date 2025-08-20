"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from '@/lib/supabase/client';

interface StaffInvitation {
  id: string;
  restaurant_id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
}

interface Restaurant {
  id: string;
  name: string;
}

export default function StaffOnboardingPage() {
  const [invitation, setInvitation] = useState<StaffInvitation | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    employeeId: '',
    email: ''
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const invitationId = searchParams.get('invitation');
        if (!invitationId) {
          setError('No invitation ID provided');
          setLoading(false);
          return;
        }

        // Get the invitation details
        const { data: invitationData, error: inviteError } = await supabase
          .from('staff_invitations')
          .select('*')
          .eq('id', invitationId)
          .eq('status', 'pending')
          .single();

        if (inviteError || !invitationData) {
          setError('Invalid or expired invitation');
          setLoading(false);
          return;
        }

        // Check if invitation is expired
        if (new Date(invitationData.expires_at) < new Date()) {
          setError('Invitation has expired');
          setLoading(false);
          return;
        }

        setInvitation(invitationData);

        // Get restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('id, name')
          .eq('id', invitationData.restaurant_id)
          .single();

        if (restaurantError || !restaurantData) {
          setError('Restaurant not found');
          setLoading(false);
          return;
        }

        setRestaurant(restaurantData);
        setFormData(prev => ({ ...prev, email: invitationData.email }));
        setLoading(false);

      } catch (err: any) {
        setError(err.message || 'Failed to load invitation');
        setLoading(false);
      }
    };

    checkInvitation();
  }, [searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!invitation || !restaurant) {
        throw new Error('Invitation or restaurant not found');
      }

      // Create the user account
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password: generateTemporaryPassword(), // Generate a temporary password
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            employee_id: formData.employeeId,
            role: 'staff'
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!user) {
        throw new Error('Failed to create user account');
      }

      // Add user to restaurant_staff table
      const { error: staffError } = await supabase
        .from('restaurant_staff')
        .insert({
          restaurant_id: restaurant.id,
          user_id: user.id,
          role: invitation.role,
          accepted_at: new Date().toISOString()
        });

      if (staffError) {
        throw new Error(staffError.message);
      }

      // Update invitation status to accepted
      const { error: updateError } = await supabase
        .from('staff_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (updateError) {
        console.warn('Failed to update invitation status:', updateError);
      }

      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  const generateTemporaryPassword = () => {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Invitation Error</h3>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to the Team!</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been created successfully. You'll be redirected to the dashboard shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to {restaurant?.name}</h1>
          <p className="text-sm text-gray-600 mt-2">Complete your staff profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="mt-1 text-xs text-gray-500">This is the email you were invited with</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your employee ID"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !formData.name}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {submitting ? "Creating Account..." : "Complete Setup"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By completing this setup, you agree to join {restaurant?.name} as a staff member.
          </p>
        </div>
      </div>
    </div>
  );
}
