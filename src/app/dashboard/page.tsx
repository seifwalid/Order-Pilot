"use client";

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type Order = {
	id: string;
	status: string;
	placed_at: string;
	customer_name: string | null;
	total_amount: number;
	restaurant_id: string;
};

export default function Dashboard() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>('all');

	const supabase = createClient();

	useEffect(() => {
		const fetchOrders = async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			const { data: rest } = await supabase
				.from("restaurants")
				.select("id")
				.eq("owner_id", auth.user.id)
				.single();
			if (rest?.id) {
				const { data } = await supabase
					.from("orders")
					.select("id,status,placed_at,customer_name,total_amount,restaurant_id")
					.eq("restaurant_id", rest.id)
					.order("placed_at", { ascending: false });
				setOrders(data ?? []);
			}
		};

		fetchOrders();

		const channel = supabase
			.channel('realtime orders')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'orders',
				},
				(payload) => {
					fetchOrders();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [statusFilter]);

	const filteredOrders = statusFilter === 'all'
		? orders
		: orders.filter(order => order.status === statusFilter);

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

			<div className="mt-6">
				<div className="flex space-x-4 mb-4">
					<button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>All</button>
					<button onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-md ${statusFilter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Pending</button>
					<button onClick={() => setStatusFilter('preparing')} className={`px-4 py-2 rounded-md ${statusFilter === 'preparing' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Preparing</button>
					<button onClick={() => setStatusFilter('ready')} className={`px-4 py-2 rounded-md ${statusFilter === 'ready' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Ready</button>
					<button onClick={() => setStatusFilter('completed')} className={`px-4 py-2 rounded-md ${statusFilter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Completed</button>
				</div>
				<div className="bg-white p-4 rounded-lg shadow">
					<h2 className="text-xl font-semibold text-gray-700">Orders</h2>
					<ul className="mt-4 space-y-4">
						{filteredOrders.map(order => (
							<li key={order.id} className="p-4 border rounded-md flex justify-between items-center">
								<div>
									<p className="font-semibold">{order.customer_name}</p>
									<p className="text-sm text-gray-500">{new Date(order.placed_at).toLocaleString()}</p>
								</div>
								<span className={`px-3 py-1 text-sm font-semibold rounded-full ${
									order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
									order.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
									order.status === 'ready' ? 'bg-green-200 text-green-800' :
									'bg-gray-200 text-gray-800'
								}`}>
									{order.status}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};


