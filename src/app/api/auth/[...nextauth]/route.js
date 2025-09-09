// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// This function contains the logic to refresh an expired token
async function refreshAccessToken(token) {
  try {
    const url = "https://api.podio.com/oauth/token";
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.PODIO_CLIENT_ID,
      client_secret: process.env.PODIO_CLIENT_SECRET,
      refresh_token: token.podioRefreshToken,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      podioAccessToken: refreshedTokens.access_token,
      podioAccessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      podioRefreshToken: refreshedTokens.refresh_token ?? token.podioRefreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const clientId = process.env.PODIO_CLIENT_ID;
          const clientSecret = process.env.PODIO_CLIENT_SECRET;
          const masterUsername = process.env.PODIO_USERNAME;
          const masterPassword = process.env.PODIO_PASSWORD;
          const staffAppId = process.env.PODIO_STAFF_APP_ID;
          const usernameFieldId = process.env.PODIO_STAFF_USERNAME_FIELD_ID;
          const passwordFieldId = process.env.PODIO_STAFF_PASSWORD_FIELD_ID;
          const roleFieldId = process.env.PODIO_STAFF_ROLE_FIELD_ID;
          const statusFieldId = process.env.PODIO_STAFF_STATUS_FIELD_ID;

          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const masterAuthResponse = await fetch('https://api.podio.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'password', client_id: clientId, client_secret: clientSecret,
              username: masterUsername, password: masterPassword,
            }),
          });
          if (!masterAuthResponse.ok) throw new Error('Podio master authentication failed');
          const masterAuthData = await masterAuthResponse.json();
          const masterAccessToken = masterAuthData.access_token;

          const filterBody = { filters: { [usernameFieldId]: credentials.username }, limit: 1 };
          const searchResponse = await fetch(`https://api.podio.com/item/app/${staffAppId}/filter/`, {
            method: 'POST',
            headers: { 'Authorization': `OAuth2 ${masterAccessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(filterBody)
          });
          if (!searchResponse.ok) throw new Error('Podio user search failed');
          const searchData = await searchResponse.json();
          
          if (searchData.items.length === 0) return null;

          const staffItem = searchData.items[0];
          const findField = (externalId) => staffItem.fields.find(f => f.external_id === externalId);
          
          const storedPasswordHash = findField(passwordFieldId)?.values[0]?.value;
          const role = findField(roleFieldId)?.values[0]?.value?.text;
          const status = findField(statusFieldId)?.values[0]?.value?.text;
          
          if (!storedPasswordHash || !role || !status) return null;
          
          const passwordsMatch = await bcrypt.compare(credentials.password, storedPasswordHash);

          if (passwordsMatch && status === 'Activo') {
            const userAuthResponse = await fetch('https://api.podio.com/oauth/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: credentials.username,
                password: credentials.password,
              }),
            });

            if (!userAuthResponse.ok) throw new Error('Failed to get user-specific Podio token');
            const userAuthData = await userAuthResponse.json();
            
            const emailField = staffItem.fields.find(f => f.type === 'email');
            return {
              id: staffItem.item_id,
              name: staffItem.title,
              email: emailField ? emailField.values[0].value : null,
              role: role.toLowerCase(),
              podioAccessToken: userAuthData.access_token,
              podioRefreshToken: userAuthData.refresh_token,
              podioAccessTokenExpiresAt: Date.now() + userAuthData.expires_in * 1000,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.podioAccessToken = user.podioAccessToken;
        token.podioRefreshToken = user.podioRefreshToken;
        token.podioAccessTokenExpiresAt = user.podioAccessTokenExpiresAt;
        return token;
      }
      
      // --- THE FIX IS HERE ---
      // Add a 60-second buffer (60000 milliseconds) to the expiry check
      const buffer = 60 * 1000;
      if (Date.now() < token.podioAccessTokenExpiresAt - buffer) {
        return token;
      }

      console.log("Access token is expired or close to expiring. Refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      session.podioAccessToken = token.podioAccessToken;
      session.error = token.error;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };