import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
	const res = NextResponse.json({ ok: true });
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return req.headers.get("cookie")?.split("; ")
						.find((c) => c.startsWith(`${name}=`))
						?.split("=")[1];
				},
				set(name: string, value: string, options: import("@supabase/ssr").CookieOptions) {
					res.cookies.set({ name, value, ...options });
				},
				remove(name: string, options: import("@supabase/ssr").CookieOptions) {
					res.cookies.set({ name, value: "", ...options, maxAge: 0 });
				},
			},
		}
	);
	await supabase.auth.signOut();
	return res;
}


