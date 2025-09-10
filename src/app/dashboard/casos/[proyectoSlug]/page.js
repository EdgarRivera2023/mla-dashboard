// src/app/dashboard/casos/[proyectoSlug]/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import CasosTable from '@/components/CasosTable';
import { useSidebar } from '@/context/SidebarContext';

const projectNames = {
    'mas-alla': 'Más Allá de Loss Mitigation',
    'bienes-raices': 'Bienes Raíces con Sensibilidad',
    'alquileres': 'Soluciones a Alquileres Defectuosos'
};

const projectMainFilters = {
    'mas-alla': { proyecto: 1 },
    'bienes-raices': { proyecto: 2 },
    'alquileres': { proyecto: 3 }
};

export default function CasosListPage({ params }) {
  const { setSidebarView, activeCasosFilter, setActiveCasosFilter, activeCasosSubFilter, setActiveCasosSubFilter } = useSidebar();

  const [allCasos, setAllCasos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  const LIMIT = 100;
  const projectName = projectNames[params.proyectoSlug] || 'Casos';

  useEffect(() => {
    setSidebarView('casosDetailFilters');
    setActiveCasosFilter({ id: params.proyectoSlug, name: projectName });
    return () => {
      setActiveCasosFilter(null);
      setActiveCasosSubFilter(null);
      setSidebarView('main');
    };
  }, [setSidebarView, setActiveCasosFilter, setActiveCasosSubFilter, params.proyectoSlug, projectName]);

  useEffect(() => {
    if (!activeCasosSubFilter) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      setIsFullyLoaded(false);
      setAllCasos([]);
      setTotalItems(0);
      setSearchTerm('');
      
      let collectedItems = [];
      let currentOffset = 0;
      let totalCount = 0;

      try {
        const mainFilter = projectMainFilters[params.proyectoSlug] || {};
        const subFilter = activeCasosSubFilter.query.filters || {};
        const mergedFilters = { ...mainFilter, ...subFilter };

        setLoadingStatus('Cargando casos iniciales...');
        const initialResponse = await fetch('/api/casos/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: mergedFilters, limit: LIMIT, offset: 0 }),
        });
        if (!initialResponse.ok) throw new Error('Failed to fetch initial items');
        
        const initialData = await initialResponse.json();
        collectedItems = initialData.items;
        totalCount = initialData.total;
        
        setAllCasos(collectedItems);
        setTotalItems(totalCount);
        setIsLoading(false);

        if (collectedItems.length >= totalCount) {
          setIsFullyLoaded(true);
          setLoadingStatus(totalCount > 0 ? `Todos los ${totalCount} casos cargados.` : 'No se encontraron casos.');
          return;
        }

        currentOffset = collectedItems.length;
        while (currentOffset < totalCount) {
          setLoadingStatus(`Cargando ${currentOffset} de ${totalCount}...`);
          const response = await fetch('/api/casos/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filters: mergedFilters, limit: LIMIT, offset: currentOffset }),
          });
          if (!response.ok) break;
          const data = await response.json();
          if (data.items.length === 0) break;
          
          setAllCasos(prev => {
            const combined = [...prev, ...data.items];
            const uniqueItems = Array.from(new Map(combined.map(item => [item.item_id, item])).values());
            return uniqueItems;
          });
          
          currentOffset = Array.from(new Map(collectedItems.map(item => [item.item_id, item])).values()).length;
          await new Promise(res => setTimeout(res, 1));
        }

      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      } finally {
        setIsFullyLoaded(true);
        if (totalCount > 0) {
            setLoadingStatus(`Todos los ${totalCount} casos cargados.`);
        } else {
            setLoadingStatus('No se encontraron casos.');
        }
      }
    };

    fetchAllData();
  }, [activeCasosSubFilter, params.proyectoSlug]);

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
            <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {activeCasosSubFilter?.name}: Mostrando <strong>{filteredCasos.length}</strong> resultados. ({loadingStatus})
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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