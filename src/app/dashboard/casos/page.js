// A new function to fetch our cases from our own API
async function getCasos() {
  // We use the full URL here because this is a Server Component fetching its own API route
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/casos`, { 
    cache: 'no-store' 
  });

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export default async function CasosPage() {
  const casos = await getCasos(); // Fetch the cases

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        All Cases ({casos.length})
      </h1>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Case Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created By</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {casos.map((caso) => (
                    <tr key={caso.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{caso.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{caso.createdBy}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(caso.createdOn).toLocaleDateString()}</td>
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