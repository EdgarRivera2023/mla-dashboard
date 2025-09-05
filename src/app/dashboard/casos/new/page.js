// src/app/dashboard/casos/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import FormField from '../../../../components/FormField';

export default function NewCasoPage() {
  const [appTemplate, setAppTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppTemplate = async () => {
      try {
        const response = await fetch('/api/podio/app-template');
        if (!response.ok) {
          throw new Error('Failed to fetch the app template from the server.');
        }
        const data = await response.json();
        setAppTemplate(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppTemplate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formattedData = { ...formData };
    for (const key in formattedData) {
      const value = formattedData[key];
      // Handles single-select App Reference {value, label}
      if (value && typeof value === 'object' && !Array.isArray(value) && value.hasOwnProperty('value')) {
        formattedData[key] = value.value;
      } 
      // Handles multi-select App Reference [{value, label}, ...]
      else if (Array.isArray(value)) {
        formattedData[key] = value.map(item => item.value);
      }
    }

    try {
      const response = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create case');
      }
      
      toast.success('Case created successfully!');
      router.push('/dashboard/casos');
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading dynamic form...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Añadir Nuevo Caso</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {appTemplate && appTemplate.fields
          .filter(field => field.status === 'active' && !field.config.hidden)
          .map((field) => (
            <FormField
              key={field.external_id}
              field={field}
              value={formData[field.external_id] || ''}
              onChange={handleInputChange}
            />
          ))}
        <div className="flex justify-end pt-4 border-t mt-6">
          <Link href="/dashboard/casos">
             <button type="button" className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ring-1 ring-inset ring-gray-300">
                Cancel
             </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Case'}
          </button>
        </div>
      </form>
    </div>
  );
}