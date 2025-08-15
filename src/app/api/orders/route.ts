import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(req: Request) {
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
	const { data: rest } = await supabase
		.from("restaurants")
		.select("id")
		.eq("owner_id", userData.user.id)
		.single();
	if (!rest) return NextResponse.json({ orders: [] });
	const { data: orders, error } = await supabase
		.from("orders")
		.select("*")
		.eq("restaurant_id", rest.id)
		.order("placed_at", { ascending: false });
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ orders: orders ?? [] });
}

export async function POST(req: Request) {
	const payload = await req.json();
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
	const { data: rest } = await supabase
		.from("restaurants")
		.select("id")
		.eq("owner_id", userData.user.id)
		.single();
	if (!rest) return NextResponse.json({ error: "no restaurant" }, { status: 400 });

	const items = Array.isArray(payload.items) ? payload.items : [];
	const total = items.reduce(
		(sum: number, it: { unit_price?: number; quantity?: number }) =>
			sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 1),
		0
	);
	const { data: orderRow, error } = await supabase
		.from("orders")
		.insert({
			restaurant_id: rest.id,
			customer_name: payload.customer_name ?? null,
			customer_phone: payload.customer_phone ?? null,
			customer_email: payload.customer_email ?? null,
			type: payload.type ?? "pickup",
			status: payload.status ?? "pending",
			total_amount: total,
		})
		.select("id")
		.single();
	if (error || !orderRow) return NextResponse.json({ error: error?.message || "insert failed" }, { status: 500 });

	const orderId = orderRow.id as string;
	const orderItems = items.map((it: { menu_item_id?: string | null; item_name: string; quantity?: number; unit_price?: number; notes?: string | null; }) => ({
		order_id: orderId,
		menu_item_id: it.menu_item_id ?? null,
		item_name: it.item_name,
		quantity: it.quantity ?? 1,
		unit_price: it.unit_price ?? 0,
		notes: it.notes ?? null,
	}));
	if (orderItems.length > 0) {
		await supabase.from("order_items").insert(orderItems);
	}
	return NextResponse.json({ orderId });
}


