import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const testUser = { 
          id: "1", 
          name: "Admin", 
          email: "edgar.asistente.medina@gmail.com"
        };

        if (credentials?.username === "admin" && credentials?.password === "password") {
          return testUser;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.email === 'edgar.asistente.medina@gmail.com') {
          token.role = 'admin';
        } else {
          token.role = 'user';
        }
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