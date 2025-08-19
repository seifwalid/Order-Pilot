"use client";

import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

type Plan = "basic" | "pro" | "enterprise";

export default function OnboardingPage() {
	const [plan, setPlan] = useState<Plan>("basic");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [inviteEmails, setInviteEmails] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const supabase = createClient();

	const createRestaurant = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		const { data: auth } = await supabase.auth.getUser();
		if (!auth.user) {
			setError("Not authenticated");
			setLoading(false);
			return;
		}
		const { data: rest, error } = await supabase
			.from("restaurants")
			.insert({ name, owner_id: auth.user.id, email, phone, address, onboarding_completed: false })
			.select("id")
			.single();
		if (error || !rest) {
			setError(error?.message || "Failed to create restaurant");
			setLoading(false);
			return;
		}

		// create staff invitations (optional)
		const emails = inviteEmails
			.split(",")
			.map((e) => e.trim())
			.filter((e) => e.length > 0);
		if (emails.length) {
			await supabase
				.from("staff_invitations")
				.insert(emails.map((e) => ({ restaurant_id: rest.id, email: e, role: "staff", invited_by: auth.user!.id })));
		}

		// mark onboarding completed
		await supabase.from("restaurants").update({ onboarding_completed: true }).eq("id", rest.id);
		router.push("/dashboard");
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center relative">
			<SignOutButton />
			<div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
				<h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
					Welcome to OrderPilot
				</h1>
				<form onSubmit={createRestaurant} className="space-y-4">
					<div>
						<label htmlFor="plan" className="block text-sm font-medium text-gray-700">
							Plan
						</label>
						<select
							id="plan"
							name="plan"
							value={plan}
							onChange={(e) => setPlan(e.target.value as Plan)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<option value="basic">Basic</option>
							<option value="pro">Pro</option>
							<option value="enterprise">Enterprise</option>
						</select>
					</div>

					<div>
						<label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
							Restaurant name
						</label>
						<input
							type="text"
							id="restaurantName"
							name="restaurantName"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="Acme Pizza"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Phone
							</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="address" className="block text-sm font-medium text-gray-700">
							Address
						</label>
						<input
							type="text"
							id="address"
							name="address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label htmlFor="staffEmails" className="block text-sm font-medium text-gray-700">
							Invite staff (comma-separated emails)
						</label>
						<textarea
							id="staffEmails"
							name="staffEmails"
							rows={3}
							value={inviteEmails}
							onChange={(e) => setInviteEmails(e.target.value)}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="e.g., chef@example.com, manager@example.com"
						/>
						<p className="mt-2 text-sm text-gray-500">
							Enter comma-separated email addresses.
						</p>
					</div>

					<button
						type="submit"
						disabled={loading || !name}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{loading ? "Creating..." : "Continue"}
					</button>
				</form>
				{error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
			</div>
		</div>
	);
}


