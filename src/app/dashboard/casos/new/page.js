'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function NewCasePage() {
  const [formData, setFormData] = useState({
    title: '',
    proyecto: '',
    estatusDeRecord: '',
    fechaDemanda: '',
    demandante: '',
    tipoDeEmplazamiento: '',
    nombreDemandados: '',
    propiedad: '',
    pueblo2: '',
    finca: '',
    pagareOriginal: '',
    fechaPagareOriginal: '',
    duantiaDemanda: '', // Note: Mispelled in your list, should be 'cuantia'
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/casos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create case');
      }
      
      toast.success('Case created successfully!');
      router.push('/dashboard/casos');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Create a New Case</h1>
      <div className="mt-8 max-w-4xl">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {/* Fields go here, mapped from formData */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Número Caso</label>
                <input id="title" name="title" type="text" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="proyecto" className="block text-sm font-medium text-gray-700">Proyecto (Category)</label>
                <input id="proyecto" name="proyecto" type="text" required value={formData.proyecto} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="estatusDeRecord" className="block text-sm font-medium text-gray-700">Estatus de Record (Category)</label>
                <input id="estatusDeRecord" name="estatusDeRecord" type="text" required value={formData.estatusDeRecord} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="fechaDemanda" className="block text-sm font-medium text-gray-700">Fecha Demanda</label>
                <input id="fechaDemanda" name="fechaDemanda" type="date" required value={formData.fechaDemanda} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="demandante" className="block text-sm font-medium text-gray-700">Demandante</label>
                <input id="demandante" name="demandante" type="text" required value={formData.demandante} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="tipoDeEmplazamiento" className="block text-sm font-medium text-gray-700">Tipo de Emplazamiento (Category)</label>
                <input id="tipoDeEmplazamiento" name="tipoDeEmplazamiento" type="text" required value={formData.tipoDeEmplazamiento} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="nombreDemandados" className="block text-sm font-medium text-gray-700">Nombre Demandado</label>
                <textarea id="nombreDemandados" name="nombreDemandados" required value={formData.nombreDemandados} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="propiedad" className="block text-sm font-medium text-gray-700">Dirección de la Propiedad</label>
                <textarea id="propiedad" name="propiedad" required value={formData.propiedad} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="pueblo2" className="block text-sm font-medium text-gray-700">Pueblo (Reference)</label>
                <input id="pueblo2" name="pueblo2" type="text" required value={formData.pueblo2} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="finca" className="block text-sm font-medium text-gray-700">Finca</label>
                <input id="finca" name="finca" type="text" required value={formData.finca} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="pagareOriginal" className="block text-sm font-medium text-gray-700">Pagaré Original (Money)</label>
                <input id="pagareOriginal" name="pagareOriginal" type="number" step="0.01" required value={formData.pagareOriginal} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="fechaPagareOriginal" className="block text-sm font-medium text-gray-700">Fecha Pagaré Original</label>
                <input id="fechaPagareOriginal" name="fechaPagareOriginal" type="date" required value={formData.fechaPagareOriginal} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label htmlFor="duantiaDemanda" className="block text-sm font-medium text-gray-700">Cuantía Demanda (Money)</label>
                <input id="duantiaDemanda" name="duantiaDemanda" type="number" step="0.01" required value={formData.duantiaDemanda} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
            <div className="flex justify-end pt-8">
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