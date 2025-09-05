// src/app/api/casos/[caseId]/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function getPodioAccessToken(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.podioAccessToken) {
    throw new Error('Podio access token not found.');
  }
  return token.podioAccessToken;
}

async function getAppTemplate(accessToken, appId) {
  const response = await fetch(`https://api.podio.com/app/${appId}`, {
    headers: { Authorization: `OAuth2 ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch app template');
  return await response.json();
}

export async function GET(req, { params }) {
  try {
    const accessToken = await getPodioAccessToken(req);
    const { caseId } = params;

    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `OAuth2 ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API Error: ${errorData.error_description}`);
    }

    const itemData = await response.json();
    return NextResponse.json(itemData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.podioAccessToken) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { caseId } = params;
    const formData = await req.json();
    const appId = process.env.PODIO_CASOS_APP_ID;
    
    const appTemplate = await getAppTemplate(token.podioAccessToken, appId);

    const fields = {};
    for (const external_id in formData) {
      const value = formData[external_id];
      const field = appTemplate.fields.find(f => f.external_id === external_id);

      if (field && value !== null && value !== undefined) {
        switch (field.type) {
          case 'date':
            fields[external_id] = value ? { start: value } : null;
            break;
          case 'money':
            fields[external_id] = value ? parseFloat(value) : null;
            break;
          case 'category':
            fields[external_id] = value ? parseInt(value, 10) : null;
            break;
          case 'app':
            if (Array.isArray(value)) {
              fields[external_id] = value.map(item => item.value);
            } else if (value && typeof value === 'object' && value.hasOwnProperty('value')) {
              fields[external_id] = value.value;
            } else {
               fields[external_id] = value;
            }
            break;
          default:
            fields[external_id] = value;
            break;
        }
      }
    }

    const podioRequestBody = { fields: fields };

    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `OAuth2 ${token.podioAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(podioRequestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Podio Update Error:", errorData)
      throw new Error(`Podio API Error: ${errorData.error_description}`);
    }

    const updatedData = await response.json();
    return NextResponse.json(updatedData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const accessToken = await getPodioAccessToken(req);
    const { caseId } = params;

    const response = await fetch(`https://api.podio.com/item/${caseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `OAuth2 ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return NextResponse.json(null, { status: 204 });
    }

    const errorData = await response.json();
    throw new Error(`Podio API Error: ${errorData.error_description}`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}