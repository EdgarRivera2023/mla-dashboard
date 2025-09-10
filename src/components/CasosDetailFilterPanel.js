// src/components/CasosDetailFilterPanel.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSidebar } from '@/context/SidebarContext';

export default function CasosDetailFilterPanel() {
  const { 
    setSidebarView, 
    activeCasosFilter, 
    activeCasosSubFilter, 
    setActiveCasosSubFilter 
  } = useSidebar();
  
  const [userFilters, setUserFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/podio/user-filters');
        if (!response.ok) throw new Error('Failed to fetch user filters');
        const data = await response.json();
        setUserFilters(data);

        // After fetching, find the default "all" filter for the current project and set it as active.
        const currentProjectName = activeCasosFilter?.name || '';
        // Find a default filter (either one named "Todos los Casos" or the very first one in the list)
        const defaultFilter = data.find(f => f.proyecto === currentProjectName && f.name.includes('Todos')) || data.find(f => f.proyecto === currentProjectName);
        if (defaultFilter) {
          setActiveCasosSubFilter(defaultFilter);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if(activeCasosFilter){
        fetchFilters();
    }
  }, [activeCasosFilter, setActiveCasosSubFilter]);

  const { premade, custom } = useMemo(() => {
    const currentProjectName = activeCasosFilter?.name || '';
    const premade = userFilters.filter(f => f.proyecto === currentProjectName && f.type === 'Pre-definido');
    const custom = userFilters.filter(f => f.proyecto === currentProjectName && f.type === 'Personalizado');
    return { premade, custom };
  }, [userFilters, activeCasosFilter]);

  if (isLoading) {
    return <p className="text-gray-400 text-sm">Loading filters...</p>;
  }

  return (
    <div>
      <div className="space-y-1">
        <button onClick={() => setSidebarView('main')} className="text-xs font-medium text-gray-400 hover:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
            Menú Principal
        </button>
        <button onClick={() => setSidebarView('casosDashboard')} className="text-sm font-semibold text-gray-300 hover:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
            Casos
        </button>
      </div>

      <div className="mt-4 flex-grow">
        <div className="font-bold text-white text-md pt-4 mb-2">{activeCasosFilter?.name}</div>
        
        <div className="font-semibold text-gray-300 text-sm mb-2">Filtros Pre-definidos</div>
        <ul className="space-y-1">
          {premade.map(filter => (
            <li key={filter.id}>
              <button 
                onClick={() => setActiveCasosSubFilter(filter)}
                className={`w-full text-left p-2 rounded-md text-gray-400 hover:bg-slate-700 hover:text-white ${activeCasosSubFilter?.id === filter.id ? 'bg-slate-700 text-white' : ''}`}
              >
                {filter.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="font-semibold text-gray-300 text-sm mt-4 mb-2">Mis Filtros</div>
        <ul className="space-y-1">
          {custom.map(filter => (
            <li key={filter.id}>
              <button 
                onClick={() => setActiveCasosSubFilter(filter)}
                className={`w-full text-left p-2 rounded-md text-gray-400 hover:bg-slate-700 hover:text-white ${activeCasosSubFilter?.id === filter.id ? 'bg-slate-700 text-white' : ''}`}
              >
                {filter.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}