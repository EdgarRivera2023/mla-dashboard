// src/app/api/podio/search-items/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ... (getPodioAccessToken function is unchanged)
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
    const { appId, searchText } = await req.json();

    if (!appId || !searchText) {
      return NextResponse.json([]);
    }
    
    const queryParams = new URLSearchParams({
      query: searchText,
      limit: "25",
      ref_type: "item",
    });

    const API_URL = `https://api.podio.com/search/app/${appId}/v2?${queryParams.toString()}`;

    const response = await fetch(API_URL, {
      method: 'GET', 
      headers: { 'Authorization': `OAuth2 ${accessToken}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API search failed: ${errorData.error_description}`);
    }

    const searchData = await response.json();
    
    // --- THE FIX IS HERE ---
    // The results are in searchData.results, not searchData itself
    const simplifiedItems = (searchData.results || []).map(result => ({
      value: result.id,
      label: result.title
    }));

    return NextResponse.json(simplifiedItems);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}