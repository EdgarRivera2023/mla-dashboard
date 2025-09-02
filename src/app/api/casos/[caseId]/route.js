import { NextResponse } from 'next/server';

// Helper function for Authentication
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

// GET Handler (to fetch a single case)
export async function GET(request, { params }) {
  const { caseId } = params;

  try {
    const accessToken = await getAccessToken();
    const dataResponse = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'GET',
      headers: { 'Authorization': `OAuth2 ${accessToken}` },
    });
    
    // New, more detailed error handling
    if (!dataResponse.ok) {
      const errorBody = await dataResponse.json();
      console.error("Podio API Error Body:", errorBody);
      throw new Error(`Podio API returned status ${dataResponse.status}: ${errorBody.error_description}`);
    }
    
    const data = await dataResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Podio API GET Error:', error);
    return NextResponse.json({ error: 'Failed to process Podio request.', details: error.message }, { status: 500 });
  }
}

// PUT Handler (to update a single case)
export async function PUT(request, { params }) {
  const { caseId } = params;
  const accessToken = await getAccessToken();
  const body = await request.json();

  const podioData = {
    fields: {
      'title': body.title,
      'proyecto': body.proyecto,
      'estatus-de-record': body.estatusDeRecord,
      'fecha-demanda': { start_date: body.fechaDemanda },
      'demandante': body.demandante,
      'tipo-de-emplazamiento': body.tipoDeEmplazamiento,
      'nombre-demandados': body.nombreDemandados,
      'propiedad': body.propiedad,
      //'pueblo-2': body.pueblo2,
      'finca': body.finca,
      'pagare-original': String(body.pagareOriginal),
      'fecha-pagare-original': { start_date: body.fechaPagareOriginal },
      'cuantia-demanda': String(body.cuantiaDemanda),
    }
  };

  try {
    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'PUT',
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
    
    if (response.status === 204) {
      return NextResponse.json({ status: 'success' });
    }

    const revisionData = await response.json();
    return NextResponse.json({ status: 'success', revision: revisionData.revision });

  } catch (error) {
    console.error('Podio Update Item Error:', error);
    return NextResponse.json({ error: 'Failed to update item in Podio.', details: error.message }, { status: 500 });
  }
}

// DELETE Handler (to delete a single case)
export async function DELETE(request, { params }) {
  const { caseId } = params;
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `OAuth2 ${accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API Error: ${JSON.stringify(errorData)}`);
    }
    
    return NextResponse.json({ status: 'success', message: 'Item deleted successfully.' });

  } catch (error) {
    console.error('Podio Delete Item Error:', error);
    return NextResponse.json({ error: 'Failed to delete item in Podio.', details: error.message }, { status: 500 });
  }
}