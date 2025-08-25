import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign-in page.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials, req) {
        // This is a temporary, "hardcoded" user for testing purposes.
        // Later, we will replace this with a real database lookup.
        const testUser = { id: "1", name: "Admin", email: "admin@example.com" };

        if (credentials?.username === "admin" && credentials?.password === "password") {
          // If the login details are correct, return the user object.
          return testUser;
        } else {
          // If the login details are incorrect, return null.
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };