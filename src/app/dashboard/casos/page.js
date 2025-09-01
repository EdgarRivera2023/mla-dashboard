'use client'; // <-- Now a Client Component to handle clicks

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CasosPage() {
  const [casos, setCasos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on the client side since the page is now interactive
  useEffect(() => {
    const fetchCasos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/casos');
        if (!response.ok) throw new Error('Failed to fetch cases');
        const data = await response.json();
        setCasos(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCasos();
  }, []);

  const handleDelete = async (caseId) => {
  if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
    try {
      const response = await fetch(`/api/casos/${caseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to delete case');
      }
      
      toast.success('Case deleted successfully!');
      
      // Refresh the list by removing the deleted case from our state
      setCasos(currentCasos => currentCasos.filter(caso => caso.id !== caseId));

    } catch (error) {
      toast.error(error.message);
    }
  }
};

  if (isLoading) {
    return <div className="p-8">Loading cases...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">All Cases ({casos.length})</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a href="/dashboard/casos/new" className="block rounded-md bg-blue-600 py-2 px-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Add New Case</a>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Edit</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Case Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created By</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created On</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {casos.map((caso) => (
                    <tr key={caso.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                        <a href={`/dashboard/casos/${caso.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.createdBy}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(caso.createdOn).toLocaleDateString()}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleDelete(caso.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}