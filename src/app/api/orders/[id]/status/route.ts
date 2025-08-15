import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id:string }> }) {
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
	const { id: orderId } = await ctx.params;
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { data: order } = await supabase.from("orders").select("restaurant_id").eq("id", orderId).single();
	if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
	const { data: rest } = await supabase
		.from("restaurants")
		.select("id")
		.eq("id", order.restaurant_id)
		.eq("owner_id", userData.user.id)
		.single();
	if (!rest) return NextResponse.json({ error: "forbidden" }, { status: 403 });

	const body = await req.json();
	const { error } = await supabase.from("orders").update({ status: body.status }).eq("id", orderId);
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ ok: true });
}


