import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

function timingSafeEqual(a: string, b: string) {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return result === 0;
}

type MenuRow = { id: string; name: string; price: number };

type PayloadItem = { name?: string; quantity?: number; notes?: string; unit_price?: number };

export async function POST(req: Request) {
	const auth = req.headers.get("authorization") || "";
	const token = auth.replace(/^Bearer\s+/i, "");
	if (!timingSafeEqual(token, process.env.VAPI_WEBHOOK_SECRET || "")) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	const payload = await req.json();
	const supabase = getServiceSupabase();

	let restaurantId: string | null = payload.restaurant_id || null;
	if (!restaurantId && payload.restaurant_identifier) {
		const { data: row } = await supabase
			.from("agent_channels")
			.select("restaurant_id")
			.eq("did", payload.restaurant_identifier)
			.single();
		restaurantId = row?.restaurant_id ?? null;
	}
	if (!restaurantId) return NextResponse.json({ error: "restaurant not found" }, { status: 400 });

	const items: PayloadItem[] = Array.isArray(payload.items) ? payload.items : [];
	const { data: menuRaw } = await supabase.from("menu_items").select("id,name,price").eq("restaurant_id", restaurantId);
	type MenuQueryRow = { id: string | number; name: string; price: string | number | null };
	const menuRows: MenuQueryRow[] = (menuRaw as MenuQueryRow[] | null) ?? [];
	const menu: MenuRow[] = menuRows.map((m) => ({ id: String(m.id), name: String(m.name), price: Number(m.price ?? 0) }));

	function fuzzyFind(name: string) {
		const lower = name.toLowerCase();
		let best: MenuRow | null = null;
		let bestScore = 0;
		for (const m of menu) {
			const candidate = m.name.toLowerCase();
			let score = 0;
			if (candidate.includes(lower) || lower.includes(candidate)) score += 2;
			const tokens = lower.split(/\s+/);
			for (const t of tokens) if (candidate.includes(t)) score += 1;
			if (score > bestScore) {
				bestScore = score;
				best = m;
			}
		}
		return best;
	}

	const resolved = items.map((it) => {
		const match = it.name ? fuzzyFind(String(it.name)) : null;
		return {
			menu_item_id: match?.id ?? null,
			item_name: match ? match.name : String(it.name || "Unknown item"),
			quantity: Number(it.quantity || 1),
			unit_price: match ? match.price : Number(it.unit_price || 0),
			notes: it.notes ?? null,
		};
	});
	const total = resolved.reduce((sum, it) => sum + (it.unit_price || 0) * (it.quantity || 1), 0);

	const { data: orderRow, error } = await supabase
		.from("orders")
		.insert({
			restaurant_id: restaurantId,
			customer_name: payload.customer_name ?? null,
			customer_phone: payload.customer_phone ?? null,
			customer_email: payload.customer_email ?? null,
			type: payload.type ?? "pickup",
			status: "pending",
			total_amount: total,
		})
		.select("id")
		.single();
	if (error || !orderRow) return NextResponse.json({ error: error?.message || "insert failed" }, { status: 500 });

	await supabase.from("order_items").insert(
		resolved.map((it) => ({ ...it, order_id: orderRow.id }))
	);

	return NextResponse.json({ orderId: orderRow.id });
}


