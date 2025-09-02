'use client';

import { useState } from 'react';

const views = [
  { id: 1, name: 'Todos los Casos Activos' },
  { id: 2, name: 'Mis Casos Asignados' },
  { id: 3, name: 'Cerrando Este Mes' },
];

export default function DashboardPage() {
  const [selectedView, setSelectedView] = useState(views[0]);

  return (
    <div className="flex h-full rounded-lg bg-white shadow-md">
      <aside className="w-1/4 flex-shrink-0 border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vistas</h2>
          <ul>
            {views.map((view) => (
              <li key={view.id} className="mb-1">
                <button
                  onClick={() => setSelectedView(view)}
                  className={`w-full text-left rounded-md p-2 text-sm ${
                    selectedView.id === view.id
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {view.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">{selectedView.name}</h1>
        <p className="mt-2 text-gray-600">
          Una tabla con los items de esta vista se mostrará aquí.
        </p>
      </main>
    </div>
  );
}