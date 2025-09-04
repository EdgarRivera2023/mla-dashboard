// src/app/api/podio/view-items/route.js

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
    // Now expecting limit and offset from the frontend
    const { viewId, limit = 100, offset = 0 } = await req.json(); 

    const PODIO_APP_ID = process.env.PODIO_CASOS_APP_ID;
    
    if (!viewId) {
      return NextResponse.json({ message: 'View ID is required' }, { status: 400 });
    }
    
    const API_URL = `https://api.podio.com/item/app/${PODIO_APP_ID}/filter/${viewId}/`;

    // No more while loop, we make ONE request per call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `OAuth2 ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: limit,
        offset: offset,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("!!! Podio API Error Response !!!", errorData); 
      throw new Error(`Podio API request failed: ${errorData.error_description}`);
    }
    
    const data = await response.json();
    
    // The Podio API response includes a 'total' count!
    return NextResponse.json({
        items: data.items || [],
        total: data.filtered || 0,
    });

  } catch (error) {
    console.error("--- CATCH BLOCK ERROR ---", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}