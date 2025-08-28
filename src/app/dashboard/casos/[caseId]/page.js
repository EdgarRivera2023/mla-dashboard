import HtmlRenderer from "../../../components/HtmlRenderer";

// A function to fetch a single case from our API
async function getCaso(id) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/casos/${id}`, { 
    cache: 'no-store' 
  });
  if (!response.ok) {
    throw new Error('Failed to fetch case data');
  }
  return response.json();
}

export default async function CaseDetailPage({ params }) {
  const caso = await getCaso(params.caseId);

  // The final, correct helper function for Podio fields
  const getFieldValue = (externalId) => {
    // --- DEBUGGING CODE ---
    if (externalId === 'your-nombre-demandado-external-id') {
      console.log("--- DEBUGGING 'Nombre Demandado' Field ---");
      console.log(JSON.stringify(
        caso.fields.find(f => f.external_id === externalId),
        null,
        2
      ));
    }
    // --- END DEBUGGING CODE ---

    const field = caso.fields.find(f => f.external_id === externalId);
    
    if (!field || !field.values || field.values.length === 0) {
      return 'N/A';
    }
    
    const firstValue = field.values[0];
    
    // Case 1: Handle Date objects
    if (firstValue.start_date) {
      return new Date(firstValue.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
    
    const fieldValue = firstValue.value;
    
    // Case 2: Handle Relationship objects
    if (typeof fieldValue === 'object' && fieldValue !== null && fieldValue.title) {
      return fieldValue.title;
    }
    
    // Case 3: Handle simple Text, Number, or Rich Text HTML
    return fieldValue;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        {caso.title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Case ID: {caso.item_id}
      </p>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Case Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre Demandado</dt>
            <dd className="mt-1 text-lg text-gray-900">
              <HtmlRenderer htmlString={getFieldValue('nombre-demandados')} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha Demanda</dt>
            <dd className="mt-1 text-lg text-gray-900">{getFieldValue('fecha-demanda')}</dd>
          </div>
        </div>
      </div>
    </div>
  );
}