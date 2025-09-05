// src/app/api/casos/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Helper function to get the app template
async function getAppTemplate(accessToken, appId) {
  const response = await fetch(`https://api.podio.com/app/${appId}`, {
    headers: { Authorization: `OAuth2 ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch app template');
  return await response.json();
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.podioAccessToken) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const formData = await req.json();
    const appId = process.env.PODIO_CASOS_APP_ID;

    // 1. Get the app blueprint to know the type of each field
    const appTemplate = await getAppTemplate(token.podioAccessToken, appId);

    // 2. Build the correctly formatted 'fields' object for Podio
    const fields = {};
    for (const external_id in formData) {
      const value = formData[external_id];
      const field = appTemplate.fields.find(f => f.external_id === external_id);

      if (field && value) {
        switch (field.type) {
          case 'date':
            // Dates must be in an object with a 'start' key
            fields[external_id] = { start: value };
            break;
          case 'money':
            // Money fields should be converted to numbers
            fields[external_id] = parseFloat(value);
            break;
          case 'category':
          case 'app':
             // Category and App References need to be item_ids (numbers)
             // Our form already sends the ID, but let's ensure it's a number/array of numbers
            if (Array.isArray(value)) {
              fields[external_id] = value.map(id => parseInt(id, 10));
            } else {
              fields[external_id] = parseInt(value, 10);
            }
            break;
          default:
            // All other fields (like text) can be sent as is
            fields[external_id] = value;
            break;
        }
      }
    }

    // 3. Create the final request body for Podio
    const podioRequestBody = {
      fields: fields,
    };

    const response = await fetch(`https://api.podio.com/item/app/${appId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `OAuth2 ${token.podioAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(podioRequestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Podio Create Item Error:", errorData);
      throw new Error(`Podio API Error: ${errorData.error_description}`);
    }

    const newPodioItem = await response.json();
    return NextResponse.json(newPodioItem, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}