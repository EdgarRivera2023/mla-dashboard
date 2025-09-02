import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
async authorize(credentials) {
  console.log("\n--- AUTHORIZE FUNCTION STARTED ---");
  
  // Step 1: Load credentials
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
  console.log("Step 1: Credentials provided by user are present.");

  try {
    // Step 2: Authenticate with Podio to get a master token
    console.log("Step 2: Attempting master authentication with Podio...");
    const authResponse = await fetch('https://api.podio.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password', client_id: clientId, client_secret: clientSecret,
        username: masterUsername, password: masterPassword,
      }),
    });
    if (!authResponse.ok) throw new Error('Podio master authentication failed');
    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log("Step 2 SUCCEEDED: Got master access token.");

    // Step 3: Search for the user in the Staff app
    console.log(`Step 3: Searching for user '${credentials.username}' in Staff App...`);
    const filterBody = { filters: { [usernameFieldId]: credentials.username }, limit: 1 };
    const searchResponse = await fetch(`https://api.podio.com/item/app/${staffAppId}/filter/`, {
      method: 'POST',
      headers: { 'Authorization': `OAuth2 ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(filterBody)
    });
    if (!searchResponse.ok) throw new Error('Podio user search failed');
    const searchData = await searchResponse.json();
    
    if (searchData.items.length === 0) {
      console.log("Step 3 FAILED: User not found in Staff App.");
      return null;
    }
    console.log("Step 3 SUCCEEDED: Found user item.");

    const staffItem = searchData.items[0];
    const findField = (externalId) => staffItem.fields.find(f => f.external_id === externalId);
    
    // Step 4: Extract fields from the user item
    console.log("Step 4: Extracting password, role, and status fields...");
    const storedPasswordHash = findField(passwordFieldId)?.values[0]?.value;
    const role = findField(roleFieldId)?.values[0]?.value?.text;
    const status = findField(statusFieldId)?.values[0]?.value?.text;
    
    if (!storedPasswordHash || !role || !status) {
      console.error("Step 4 FAILED: Password, role, or status field is missing from the Podio item.");
      return null;
    }
    console.log("Step 4 SUCCEEDED: All required fields found.");
    
    // Step 5: Compare password and check status
    console.log("Step 5: Comparing password and checking status...");
    const passwordsMatch = await bcrypt.compare(credentials.password, storedPasswordHash);

    if (passwordsMatch && status === 'Activo') {
      console.log("Step 5 SUCCEEDED: Login successful!");
      const emailField = staffItem.fields.find(f => f.type === 'email');
      return {
        id: staffItem.item_id, name: staffItem.title,
        email: emailField ? emailField.values[0].value : null, role: role.toLowerCase(),
      };
    }
    
    console.log("Step 5 FAILED: Password mismatch or inactive status.");
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
    // We can simplify this now!
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };