'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/login');
    } else {
      console.error('Failed to sign out');
      // Optionally, show an error message to the user
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
    >
      Sign Out
    </button>
  );
}

