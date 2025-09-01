import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SignOutButton from "../components/SignOutButton";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar (no changes here) */}
      <aside className="relative w-64 flex-shrink-0 bg-gray-800 p-6 text-white">
        <h2 className="mb-8 text-2xl font-bold">DataLink Web</h2>
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="block rounded py-2 px-3 hover:bg-gray-700">Dashboard</a></li>
            <li className="mb-2"><a href="/dashboard/casos" className="block rounded py-2 px-3 hover:bg-gray-700">Casos</a></li>
            {session?.user?.role === 'admin' && (
              <li className="mb-2"><a href="/dashboard/admin" className="block rounded py-2 px-3 text-yellow-400 hover:bg-gray-700">Admin Panel</a></li>
            )}
          </ul>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-4 border-t border-gray-700"></div>
          <p className="mb-1 truncate text-sm font-medium">{session?.user?.name}</p>
          <p className="mb-4 truncate text-xs text-gray-400">{session?.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area (with new Header) */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div>{/* Global App Links will go here later */}</div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}