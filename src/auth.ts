import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(
            `${process.env.BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          const data = response.data;

          if (data.token) {
            return {
              id: data.email,
              name: data.name,
              email: data.email,
              role: data.role,
              expiresOn: data.expiresOn,
              accessToken: data.token,
            };
          }

          return null;
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) return false;

      if (nextUrl.pathname.startsWith('/login'))
        return Response.redirect(new URL('/home', nextUrl));

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.expiresOn = user.expiresOn;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        name: token.name,
        email: token.email,
        role: token.role,
      };

      return session;
    },
  },
});
