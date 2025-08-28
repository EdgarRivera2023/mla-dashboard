'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCasePage({ params }) {
  const [title, setTitle] = useState('');
  const [demandado, setDemandado] = useState('');
  const [fechaDemanda, setFechaDemanda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { caseId } = params;

function stripHtml(html) {
  if (!html || typeof window === 'undefined') return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`/api/casos/${caseId}`);
        if (!response.ok) throw new Error('Failed to fetch case data');
        const data = await response.json();
        
        const getFieldValue = (externalId) => {
          const field = data.fields.find(f => f.external_id === externalId);
          if (!field || !field.values || field.values.length === 0) return '';
          const firstValue = field.values[0];
          if (firstValue.start_date) return firstValue.start_date.split(' ')[0];
          return firstValue.value;
        };

        setTitle(data.title || '');
        setDemandado(stripHtml(getFieldValue('nombre-demandados')) || '');
        setFechaDemanda(getFieldValue('fecha-demanda') || '');

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCaseData();
  }, [caseId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(`/api/casos/${caseId}`, {
      method: 'PUT', // Use PUT for updates
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        demandado,
        fechaDemanda,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to update case');
    }
    
    // On success, redirect back to the main cases list page
    router.push('/dashboard/casos');

  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) return <p className="p-8">Loading case data...</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Edit Case</h1>
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
            <div className="flex justify-end pt-4">
              <button type="submit" className="rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}