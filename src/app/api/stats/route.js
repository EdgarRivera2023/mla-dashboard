import { NextResponse } from 'next/server';

export async function GET(request) {
  // Step 1: Get all our secrets from the .env.local file
  const clientId = process.env.PODIO_CLIENT_ID;
  const clientSecret = process.env.PODIO_CLIENT_SECRET;
  const username = process.env.PODIO_USERNAME;
  const password = process.env.PODIO_PASSWORD;
  const appId = process.env.PODIO_CASOS_APP_ID;

  if (!clientId || !clientSecret || !username || !password || !appId) {
    return NextResponse.json({ error: 'Podio API credentials are not fully configured.' }, { status: 500 });
  }

  try {
    // Step 2: Authenticate with Podio to get an access token
    const authResponse = await fetch('https://api.podio.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
      }),
    });

    if (!authResponse.ok) {
      throw new Error('Podio authentication failed. Please check your credentials.');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Step 3: Use the access token to make the data request
    const dataResponse = await fetch(`https://api.podio.com/item/app/${appId}/filter/`, {
      method: 'POST',
      headers: {
        'Authorization': `OAuth2 ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 1,
      }),
    });

    if (!dataResponse.ok) {
      throw new Error('Podio data fetch failed.');
    }

    const data = await dataResponse.json();
    const totalCases = data.total;

    return NextResponse.json({
      status: 'success',
      totalCases: totalCases,
    });

  } catch (error) {
    console.error('Podio API Process Error:', error);
    return NextResponse.json({ error: 'Failed to process Podio request.', details: error.message }, { status: 500 });
  }
}