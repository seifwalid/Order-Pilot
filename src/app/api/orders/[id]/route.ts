import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
	const { id } = await ctx.params;
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
			},
		}
	);
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	const { data: order, error } = await supabase
		.from("orders")
		.select("*, order_items(*)")
		.eq("id", id)
		.single();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ order });
}


