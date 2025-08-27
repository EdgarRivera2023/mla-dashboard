import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

// A reusable component for our stat cards
function StatCard({ title, value, description }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

// A new function to fetch our stats from our own API
async function getStats() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/stats`, { 
    cache: 'no-store' 
  });

  if (!response.ok) {
    // Return default values on error
    return { totalCases: 'Error' };
  }
  return response.json();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getStats(); // Fetch the stats

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {session?.user?.name}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Here's a snapshot of your business.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Active Cases" 
          value={stats.totalCases} // <-- Using our live data!
          description="From Podio" 
        />
        <StatCard 
          title="New Leads This Week" 
          value="--" // Placeholder
          description="Coming soon" 
        />
        <StatCard 
          title="Closing This Month" 
          value="--" // Placeholder
          description="Coming soon" 
        />
      </div>
    </div>
  );
}