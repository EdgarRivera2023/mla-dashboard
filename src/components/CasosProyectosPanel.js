// src/components/CasosProyectosPanel.js
'use client';

import Link from 'next/link';
import { useSidebar } from '../context/SidebarContext';

// We get the filter definitions to build our links
import { premadeFilters } from '../app/dashboard/casos/[proyectoSlug]/filter-config';

export default function CasosProyectosPanel() {
  const { setSidebarView } = useSidebar();

  return (
    <div>
      <button 
        onClick={() => setSidebarView('main')}
        className="text-sm font-semibold text-gray-300 hover:text-white flex items-center mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
        Volver al Menú Principal
      </button>

      <div className="flex-grow">
        <ul className="space-y-2">
          <li className="font-bold text-white text-md">Proyectos</li>
          {premadeFilters.map(filter => (
            <li key={filter.id}>
              {/* These links now point to our new dynamic routes */}
              <Link href={`/dashboard/casos/${filter.id}`} className="block p-2 rounded-md text-gray-400 hover:bg-slate-700 hover:text-white">
                {filter.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}