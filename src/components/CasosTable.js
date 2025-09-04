// src/components/CasosTable.js

import Link from 'next/link';
import HtmlRenderer from './HtmlRenderer';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function CasosTable({ casos, handleDelete }) {
  // Find a specific field in the Podio item's field array
  const findField = (item, externalId) => {
    return item.fields.find(f => f.external_id === externalId);
  };
  
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          {/* THE CHANGE IS ON THE NEXT LINE */}
          <th scope="col" className="sticky top-0 z-10 bg-gray-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
            Edit
          </th>
          <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Case Title
          </th>
          <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Created By
          </th>
          <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Created On
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {casos.length > 0 ? (
          casos.map((caso) => {
            const createdByField = findField(caso, 'created-by-2');
            const createdByName = createdByField?.values[0]?.value?.name || 'N/A';

            return (
              <tr key={caso.item_id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                  <Link href={`/dashboard/casos/${caso.item_id}`}>
                    <span className="text-indigo-600 hover:text-indigo-900">Edit</span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.title}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{createdByName}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(caso.created_on)}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-sm text-gray-500">
              No cases found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}