// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { /* ... your credentials object ... */ },
      async authorize(credentials) {
        console.log("\n--- AUTHORIZE FUNCTION STARTED ---");
        
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
          console.error("Authorize failed: No credentials provided by user.");
          return null;
        }

        try {
          // Step 1: Get master token to search users
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

          // Step 2: Search for the user in the Staff app
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
            console.log("Password verified. Now getting USER-SPECIFIC access token...");

            // --- NEW STEP ---
            // Now that we know who they are, get an access token FOR THEM.
            const userAuthResponse = await fetch('https://api.podio.com/oauth/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: credentials.username, // Use the USER'S credentials
                password: credentials.password,
              }),
            });

            if (!userAuthResponse.ok) throw new Error('Failed to get user-specific Podio token');
            const userAuthData = await userAuthResponse.json();
            const userAccessToken = userAuthData.access_token;
            console.log("SUCCESS: Got user-specific access token.");
            // --- END NEW STEP ---

            const emailField = staffItem.fields.find(f => f.type === 'email');
            return {
              id: staffItem.item_id,
              name: staffItem.title,
              email: emailField ? emailField.values[0].value : null,
              role: role.toLowerCase(),
              podioAccessToken: userAccessToken, // <<< ADDED TOKEN TO USER OBJECT
            };
          }
          
          return null;

        } catch (error) {
          console.error("--- CATCH BLOCK --- An unexpected error occurred:", error);
          return null;
        }
      }
    })
  ],
  pages: { signIn: '/login' },
  callbacks: {
    // --- UPDATED CALLBACKS ---
    async jwt({ token, user }) {
      // This is called when the JWT is created (on sign-in).
      // The `user` object is what we returned from `authorize`.
      if (user) {
        token.role = user.role;
        token.podioAccessToken = user.podioAccessToken; // Save the token to the JWT
      }
      return token;
    },
    async session({ session, token }) {
      // This is called when the session is accessed.
      // We pass the data from the JWT (`token`) to the client-side session.
      if (session?.user) {
        session.user.role = token.role;
      }
      session.podioAccessToken = token.podioAccessToken; // Make the token available to the API routes
      return session;
    },
    // --- END UPDATED CALLBACKS ---
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };