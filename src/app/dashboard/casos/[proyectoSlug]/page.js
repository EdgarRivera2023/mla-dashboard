// src/app/dashboard/casos/[proyectoSlug]/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import CasosTable from '@/components/CasosTable';
import { useSidebar } from '@/context/SidebarContext';
import { premadeFilters } from './filter-config';

// The component now receives 'params' to know which project we're on
export default function CasosListPage({ params }) {
  const [allCasos, setAllCasos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    setSidebarView, 
    activeCasosFilter, 
    setActiveCasosFilter, 
    setCasosFilters 
  } = useSidebar();

  const LIMIT = 100;

  useEffect(() => {
    setCasosFilters(premadeFilters);
    
    // CHANGE #1: Find the active filter based on the URL
    const currentFilter = premadeFilters.find(f => f.id === params.proyectoSlug);
    if (currentFilter) {
      setActiveCasosFilter(currentFilter);
    }
    
    // CHANGE #2: Set the correct sidebar view for this page
    setSidebarView('casosDashboard'); 

    return () => {
      setSidebarView('main');
      setCasosFilters([]);
      setActiveCasosFilter(null);
    };
  }, [setSidebarView, setCasosFilters, setActiveCasosFilter, params.proyectoSlug]);

  // Effect for the INITIAL fetch (your original logic)
  useEffect(() => {
    if (!activeCasosFilter) {
      setAllCasos([]);
      setTotalItems(0);
      return;
    };

    const fetchInitialItems = async () => {
      setIsLoading(true);
      setIsFullyLoaded(false);
      setSearchTerm('');
      try {
        const response = await fetch('/api/casos/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filters: activeCasosFilter.podioQuery.filters,
            limit: LIMIT,
            offset: 0 
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setAllCasos(data.items);
        setTotalItems(data.total);
        if (data.items.length >= data.total) {
            setIsFullyLoaded(true);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialItems();
  }, [activeCasosFilter]);

  // Effect for the BACKGROUND fetch (your original logic)
  useEffect(() => {
    if (isLoading || isFullyLoaded || !activeCasosFilter || allCasos.length === 0) return;

    const fetchAllRemainingItems = async () => {
      let currentOffset = allCasos.length;
      
      while (currentOffset < totalItems) {
        try {
          const response = await fetch('/api/casos/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filters: activeCasosFilter.podioQuery.filters,
              limit: LIMIT,
              offset: currentOffset
            }),
          });
          if (!response.ok) break;
          const data = await response.json();
          if (data.items.length === 0) break;
          
          setAllCasos(prev => [...prev, ...data.items]);
          currentOffset += data.items.length;
          await new Promise(res => setTimeout(res, 1));
        } catch (error) {
          console.error("Background fetch error:", error);
          break;
        }
      }
      setIsFullyLoaded(true);
    };
    
    fetchAllRemainingItems();
  }, [isLoading, isFullyLoaded, totalItems, activeCasosFilter, allCasos.length]);

  const filteredCasos = useMemo(() => {
    if (!searchTerm) return allCasos;
    return allCasos.filter(caso =>
      caso.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCasos, searchTerm]);

  const handleDelete = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await fetch(`/api/casos/${caseId}`, { method: 'DELETE' });
        toast.success('Caso borrado exitosamente!');
        setAllCasos(current => current.filter(caso => caso.item_id !== caseId));
        setTotalItems(prevTotal => prevTotal - 1);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 border-b border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">{activeCasosFilter?.name || 'Casos'}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Mostrando <strong>{filteredCasos.length}</strong> resultados. 
              ({isFullyLoaded ? `Todos los ${totalItems} casos cargados.` : `Cargando ${allCasos.length} de ${totalItems}...`})
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {/* CHANGE #3: Updated Link for the new route */}
            <Link href={`/dashboard/casos/${params.proyectoSlug}/new`}>
              <button type="button" className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                Añadir Nuevo Caso
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
            placeholder="Filtrar casos cargados..."
            disabled={!isFullyLoaded}
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <p>Cargando casos iniciales...</p>
        ) : (
          <CasosTable casos={filteredCasos} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}