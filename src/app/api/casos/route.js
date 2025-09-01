import { NextResponse } from 'next/server';

// --- Helper function for Authentication ---
// We put this outside so both GET and POST can use it.
async function getAccessToken() {
  const clientId = process.env.PODIO_CLIENT_ID;
  const clientSecret = process.env.PODIO_CLIENT_SECRET;
  const username = process.env.PODIO_USERNAME;
  const password = process.env.PODIO_PASSWORD;
  
  const authResponse = await fetch('https://api.podio.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
      }),
    });
    if (!authResponse.ok) throw new Error('Podio authentication failed');
    const authData = await authResponse.json();
    return authData.access_token;
}

// --- GET Handler (to fetch the list of cases) ---
export async function GET(request) {
  try {
    const accessToken = await getAccessToken();
    const appId = process.env.PODIO_CASOS_APP_ID;
    
    const dataResponse = await fetch(`https://api.podio.com/item/app/${appId}/filter/`, {
      method: 'POST',
      headers: { 'Authorization': `OAuth2 ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 100, sort_by: "created_on", sort_desc: true }),
    });
    if (!dataResponse.ok) throw new Error('Podio data fetch failed');
    
    const data = await dataResponse.json();
    
    const cases = data.items.map(item => ({
      id: item.item_id,
      title: item.title,
      createdBy: item.created_by.name,
      createdOn: item.created_on,
    }));

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Podio API Process Error:', error);
    return NextResponse.json({ error: 'Failed to process Podio request.', details: error.message }, { status: 500 });
  }
}

// --- NEW POST Handler (to create a new case) ---
export async function POST(request) {
  try {
    const accessToken = await getAccessToken();
    const appId = process.env.PODIO_CASOS_APP_ID;
    const body = await request.json(); // Get the data from the front-end form

    // We must format the data into the structure Podio expects
    const podioData = {
      fields: {
        // IMPORTANT: Replace these with your actual external_ids from Podio
        'title': body.title,
        'proyecto': body.proyecto,
        'estatus-de-record': body.estatusDeRecord,
        'fecha-demanda': {
          start_date: body.fechaDemanda, // Podio expects date objects
        'demandante': body.demandante,
        'tipo-de-emplazamiento': body.tipoDeEmplazamiento,
        'nombre-demandados': body.nombreDemandados,
        'propiedad': body.propiedad,
        'pueblo-2': body.pueblo2,
        'finca': body.finca,
        'pagare-original': body.pagareOriginal,
        'fecha-pagare-original': {
          start_date: body.fechaPagareOriginal,
        },
        'cuantia-demanda': body.cuantiaDemanda,
        },
      }
    };

    const response = await fetch(`https://api.podio.com/item/app/${appId}/`, {
      method: 'POST',
      headers: { 'Authorization': `OAuth2 ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(podioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API Error: ${JSON.stringify(errorData)}`);
    }

    const newPodioItem = await response.json();

    return NextResponse.json({ status: 'success', newItemId: newPodioItem.item_id });
  } catch (error) {
    console.error('Podio Create Item Error:', error);
    return NextResponse.json({ error: 'Failed to create item in Podio.', details: error.message }, { status: 500 });
  }
}

// ... your existing getAccessToken and GET functions are above this ...
export async function PUT(request, { params }) {
  const { caseId } = params;
  const accessToken = await getAccessToken();
  const body = await request.json(); // Get the updated data from the front-end

  // Format the data into the structure Podio expects for an update
  const podioData = {
    fields: {
      // IMPORTANT: Replace these with your actual external_ids
      'title': body.title, 
      'your-nombre-demandado-external-id': body.demandado,
      'your-fecha-demanda-external-id': {
        start_date: body.fechaDemanda,
      },
    }
  };

  try {
    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'PUT', // Use PUT for updates
      headers: {
        'Authorization': `OAuth2 ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(podioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API Error: ${JSON.stringify(errorData)}`);
    }

    const revisionData = await response.json();
    return NextResponse.json({ status: 'success', revision: revisionData.revision });

  } catch (error) {
    console.error('Podio Update Item Error:', error);
    return NextResponse.json({ error: 'Failed to update item in Podio.', details: error.message }, { status: 500 });
  }
}