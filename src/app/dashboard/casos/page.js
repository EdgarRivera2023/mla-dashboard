import CasosTable from '@/components/CasosTable';
import Link from 'next/link';

// THIS FUNCTION WAS MISSING
async function getCasos() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/casos`, { 
    cache: 'no-store' 
  });
  if (!response.ok) {
    console.error("Failed to fetch cases, returning empty array.");
    return []; // Return empty array on error to prevent crash
  }
  return response.json();
}

export default async function CasosPage() {
  const initialCasos = await getCasos();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            Todos los Casos
          </h1>
          <p className="mt-2 text-sm text-gray-700">Un listado de todos los casos de Podio ({initialCasos.length} items).</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/casos/new"
            className="block rounded-md bg-blue-600 py-2 px-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Añadir Nuevo Caso
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <CasosTable casos={initialCasos} />
          </div>
        </div>
      </div>
    </div>
  );
}