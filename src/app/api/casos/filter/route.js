// src/app/api/casos/filter/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function getPodioAccessToken(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.podioAccessToken) {
    throw new Error('Podio access token not found.');
  }
  return token.podioAccessToken;
}

export async function POST(req) {
  try {
    const accessToken = await getPodioAccessToken(req);
    // Expect a body with filters, limit, and offset
    const { filters, limit = 100, offset = 0 } = await req.json();

    const appId = process.env.PODIO_CASOS_APP_ID;
    const API_URL = `https://api.podio.com/item/app/${appId}/filter/`;

    const requestBody = {
      filters: filters,
      limit: limit,
      offset: offset,
      sort_by: "created_on",
      sort_desc: true,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `OAuth2 ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API request failed: ${errorData.error_description}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
        items: data.items || [],
        total: data.filtered || 0,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}