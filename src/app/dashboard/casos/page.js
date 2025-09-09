// src/app/dashboard/casos/page.js
'use client';

import { useEffect } from 'react';
import { useSidebar } from '../../../context/SidebarContext';

// Placeholder data for our stat cards
const stats = [
    { name: 'Más Allá de Loss Mitigation', stat: '1,198' },
    { name: 'Bienes Raíces con Sensibilidad', stat: '243' },
    { name: 'Soluciones a Alquileres Defectuosos', stat: '52' },
]

export default function CasosDashboardPage() {
    const { setSidebarView } = useSidebar();

    // When this page loads, tell the sidebar to show the 'casosDashboard' view
    useEffect(() => {
        setSidebarView('casosDashboard');
        // When we leave, set it back to main
        return () => setSidebarView('main');
    }, [setSidebarView]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900">Resumen de Casos</h1>

            <div className="mt-6">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                        <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}