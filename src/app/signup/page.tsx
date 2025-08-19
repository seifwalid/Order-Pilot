"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
	const supabase = createClient();
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const origin = window.location.origin;
		await supabase.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: `${origin}/auth/callback` },
		});
		setSent(true);
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<h1 className="text-2xl font-semibold mb-6">Sign up</h1>
				{sent ? (
					<p className="text-sm">Magic link sent. Check your email.</p>
				) : (
					<form onSubmit={onSubmit} className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full border rounded px-3 py-2"
							required
						/>
						<button className="w-full bg-black text-white rounded px-3 py-2">
							Send magic link
						</button>
					</form>
				)}
			</div>
		</div>
	);
}



