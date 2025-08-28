'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCasePage() {
  const [title, setTitle] = useState('');
  const [demandado, setDemandado] = useState('');
  const [fechaDemanda, setFechaDemanda] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          demandado,
          fechaDemanda,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create case');
      }
      
      // On success, redirect to the main cases list page
      router.push('/dashboard/casos');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Create a New Case</h1>
      <div className="mt-8 max-w-2xl">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="case-title" className="block text-sm font-medium text-gray-700">Case Title</label>
              <input id="case-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="nombre-demandado" className="block text-sm font-medium text-gray-700">Nombre Demandado</label>
              <input id="nombre-demandado" type="text" required value={demandado} onChange={(e) => setDemandado(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="fecha-demanda" className="block text-sm font-medium text-gray-700">Fecha Demanda</label>
              <input id="fecha-demanda" type="date" required value={fechaDemanda} onChange={(e) => setFechaDemanda(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isLoading} className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Creating...' : 'Create Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}