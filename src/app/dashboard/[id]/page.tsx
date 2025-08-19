"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Order = {
	id: string;
	status: string;
	placed_at: string;
	customer_name: string | null;
	total_amount: number;
	restaurant_id: string;
};

type OrderItem = {
	id: string;
	order_id: string;
	menu_item_id: string | null;
	item_name: string;
	quantity: number;
	unit_price: number;
	notes: string | null;
};

export default function OrderDetailPage() {
	const params = useParams<{ id: string }>();
	const id = Array.isArray(params.id) ? params.id[0] : params.id;
	const supabase = createClient();
	const [order, setOrder] = useState<Order | null>(null);
	const [items, setItems] = useState<OrderItem[]>([]);

	useEffect(() => {
		if (!id) return;
		(async () => {
			const { data: order } = await supabase
				.from("orders")
				.select("*")
				.eq("id", id)
				.single<Order>();
			setOrder(order ?? null);
			const { data: items } = await supabase
				.from("order_items")
				.select("*")
				.eq("order_id", id);
			setItems((items as OrderItem[]) || []);
		})();
	}, [id, supabase]);

	async function updateStatus(status: string) {
		await fetch(`/api/orders/${id}/status`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		});
		setOrder((o) => (o ? { ...o, status } : o));
	}

	if (!order) return <div className="p-6">Loading...</div>;
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Order {order.id}</h1>
			<div className="space-x-2">
				{["pending", "preparing", "ready", "completed", "cancelled"].map((s) => (
					<button key={s} className="border rounded px-3 py-1" onClick={() => updateStatus(s)}>
						{s}
					</button>
				))}
			</div>
			<div>
				<h2 className="font-medium mb-2">Items</h2>
				<div className="grid gap-2">
					{items.map((it) => (
						<div key={it.id} className="border rounded p-2 flex justify-between">
							<div>
								<div className="font-medium">{it.item_name}</div>
								<div className="text-sm text-gray-600">Qty {it.quantity}</div>
							</div>
							<div>${""}{Number(it.unit_price).toFixed(2)}</div>
						</div>
					))}
					{items.length === 0 && <div className="text-sm text-gray-600">No items</div>}
				</div>
			</div>
		</div>
	);
}


