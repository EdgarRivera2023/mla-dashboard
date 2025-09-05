// src/app/api/podio/app-template/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function getPodioAccessToken(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.podioAccessToken) {
    throw new Error('Podio access token not found.');
  }
  return token.podioAccessToken;
}

export async function GET(req) {
  try {
    const accessToken = await getPodioAccessToken(req);
    const PODIO_APP_ID = process.env.PODIO_CASOS_APP_ID;

    if (!PODIO_APP_ID) {
      throw new Error("PODIO_CASOS_APP_ID is not defined in your environment variables.");
    }

    const API_URL = `https://api.podio.com/app/${PODIO_APP_ID}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `OAuth2 ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Podio API request failed: ${errorData.error_description}`);
    }

    const appTemplate = await response.json();

    return NextResponse.json(appTemplate);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}