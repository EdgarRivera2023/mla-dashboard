'use client';

import Link from 'next/link';

// This is a simple component that just displays the data it's given.
export default function CasosTable({ casos }) {
  // Add a safety check in case casos is not an array
  if (!Array.isArray(casos)) {
    return <p className="p-4">No cases to display.</p>;
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Edit</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Case Title</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created By</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {casos.map((caso) => (
            <tr key={caso.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                <Link href={`/dashboard/casos/${caso.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.title}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.createdBy}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(caso.createdOn).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}