'use client'; // <-- This page is now interactive, so it's a Client Component

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('my-views'); // State to track the active tab

  // We show a loading state while the session is being fetched
  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {session.user.name}!
      </h1>
      
      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('my-views')}
              className={`${
                activeTab === 'my-views'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              My Views
            </button>
            
            {/* Admin-only Master Views Tab */}
            {session.user.role === 'admin' && (
               <button
                onClick={() => setActiveTab('master-views')}
                className={`${
                  activeTab === 'master-views'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Master Views
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'my-views' && (
            <div>
              <h2 className="text-xl font-semibold">Content for My Views</h2>
              <p>The list of this user's views and items will go here.</p>
            </div>
          )}

          {activeTab === 'master-views' && session.user.role === 'admin' && (
            <div>
              <h2 className="text-xl font-semibold">Content for Master Views</h2>
              <p>The admin view content for all users will go here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}