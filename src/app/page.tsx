export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold">OrderPilot</h1>
        <p className="text-gray-600">Restaurants take phone orders via voice agents. Manage orders in your dashboard.</p>
        <div className="flex gap-3">
          <a href="/signup" className="bg-black text-white rounded px-4 py-2">Sign up</a>
          <a href="/login" className="border rounded px-4 py-2">Login</a>
        </div>
      </div>
    </main>
  );
}
