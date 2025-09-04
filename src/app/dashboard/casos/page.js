// src/app/dashboard/casos/page.js

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import CasosTable from '../../../components/CasosTable';

export default function CasosPage() {
  const [displayedCasos, setDisplayedCasos] = useState([]);
  const [allCasos, setAllCasos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const LIMIT = 100;
  const ACTIVE_ITEMS_VIEW_ID = 60652715; // Your View ID

  useEffect(() => {
    const fetchInitialItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/podio/view-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ viewId: ACTIVE_ITEMS_VIEW_ID, limit: LIMIT, offset: 0 }),
        });
        if (!response.ok) throw new Error('Failed to fetch initial items');
        const data = await response.json();
        setDisplayedCasos(data.items);
        setAllCasos(data.items);
        setTotalItems(data.total);
        setOffset(data.items.length);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialItems();
  }, [ACTIVE_ITEMS_VIEW_ID]);

  useEffect(() => {
    // Run only after the initial load is done and there are more items to fetch
    if (!isLoading && offset > 0 && offset < totalItems) {
      const fetchAllRemainingItems = async () => {
        console.log("Background fetch started...");
        let currentOffset = offset;

        while (currentOffset < totalItems) {
          try {
            const response = await fetch('/api/podio/view-items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ viewId: ACTIVE_ITEMS_VIEW_ID, limit: LIMIT, offset: currentOffset }),
            });
            if (!response.ok) break;
            const data = await response.json();
            if (data.items.length === 0) break;
            
            // THE CHANGE IS HERE: Update state immediately with the new batch
            setAllCasos(prevAllCasos => [...prevAllCasos, ...data.items]);
            
            currentOffset += data.items.length;
          } catch (error) {
            console.error("Background fetch error:", error);
            break;
          }
        }
        setIsFullyLoaded(true);
        console.log("Background fetch complete!");
      };
      
      fetchAllRemainingItems();
    }
  }, [isLoading, offset, totalItems]);

  const filteredCasos = useMemo(() => {
    const sourceList = isFullyLoaded ? allCasos : displayedCasos;
    if (!searchTerm) {
      return sourceList;
    }
    return sourceList.filter(caso =>
      caso.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, displayedCasos, allCasos, isFullyLoaded]);

  const handleLoadMore = async () => {
    setIsAppending(true);
    try {
      const response = await fetch('/api/podio/view-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewId: ACTIVE_ITEMS_VIEW_ID, limit: LIMIT, offset: offset }),
      });
      if (!response.ok) throw new Error('Failed to fetch more items');
      const data = await response.json();
      setDisplayedCasos(prev => [...prev, ...data.items]);
      setAllCasos(prev => [...prev, ...data.items]); // Also update the master list
      setOffset(prev => prev + data.items.length);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAppending(false);
    }
  };

  const handleDelete = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/casos/${caseId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete case');
        toast.success('Caso borrado exitosamente!');
        // Remove from both lists
        setDisplayedCasos(current => current.filter(caso => caso.id !== caseId));
        setAllCasos(current => current.filter(caso => caso.id !== caseId));
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  
  const canLoadMore = displayedCasos.length < totalItems && !searchTerm;

  return (
    <div className="flex flex-col h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      
      <div className="flex-shrink-0 bg-gray-50 pb-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Casos Activos</h1>
            <p className="mt-2 text-sm text-gray-700">
              Mostrando <strong>{filteredCasos.length}</strong> resultados. 
              ({isFullyLoaded ? `${totalItems} de ${totalItems} cargados en segundo plano.` : `Cargados ${displayedCasos.length} de ${totalItems}.`})
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link href="/dashboard/casos/new" className="block rounded-md bg-blue-600 py-2 px-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Añadir Nuevo Caso
            </Link>
          </div>
        </div>
        
        <div className="mt-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
            placeholder={isFullyLoaded ? "Filtrar todos los casos..." : "Filtrar casos cargados..."}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-grow mt-2 overflow-y-auto">
        <div className="flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
               {isLoading ? (
                  <p className="text-center">Cargando casos...</p>
               ) : (
                  <CasosTable casos={filteredCasos} handleDelete={handleDelete} />
               )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          {canLoadMore && !isLoading && (
            <button
              onClick={handleLoadMore}
              disabled={isAppending}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {isAppending ? 'Cargando...' : 'Cargar Más'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}