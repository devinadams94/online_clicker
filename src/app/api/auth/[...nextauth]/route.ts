import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NEXTAUTH_SECRET } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          console.log(`Attempting to authorize user: ${credentials.email}`);
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log(`User not found: ${credentials.email}`);
            return null;
          }
          
          if (!user.password) {
            console.log(`User has no password: ${credentials.email}`);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(`Invalid password for user: ${credentials.email}`);
            return null;
          }

          console.log(`Successfully authorized user: ${credentials.email}`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };