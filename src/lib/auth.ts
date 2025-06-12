import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NEXTAUTH_SECRET } from "@/lib/env";

// Fix BigInt serialization issue
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Authorize called with email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          return null;
        }

        try {
          console.log("[AUTH] Looking up user in database...");
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log("[AUTH] User not found");
            return null;
          }
          
          console.log("[AUTH] User found:", user.email, "Has password:", !!user.password);
          
          if (!user.password) {
            console.log("[AUTH] User has no password");
            return null;
          }

          console.log("[AUTH] Comparing passwords...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("[AUTH] Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          console.log("[AUTH] Authentication successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[AUTH] Error in authorize:", error);
          throw error; // Re-throw to see the actual error
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
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[AUTH] Session callback - token:", token);
      if (token && session.user) {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? '';
        session.user.name = token.name ?? '';
      }
      console.log("[AUTH] Session callback - session:", session);
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("[AUTH] JWT callback - user:", user, "account:", account);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      // Ensure token has all necessary fields
      if (!token.sub && token.id) {
        token.sub = token.id;
      }
      console.log("[AUTH] JWT callback - token:", token);
      return token;
    },
    async redirect({ url, baseUrl }) {
      // In development, use the baseUrl
      if (process.env.NODE_ENV === 'development') {
        // If url is relative, append to baseUrl
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        }
        // If url is absolute but on same host, allow it
        if (url.startsWith(baseUrl)) {
          return url;
        }
        // Default to baseUrl
        return baseUrl;
      }
      
      // In production, redirect to paper-clips.com
      if (url.startsWith('/')) {
        return `https://paper-clips.com${url}`;
      }
      if (url.startsWith('https://paper-clips.com')) {
        return url;
      }
      // Default to paper-clips.com home page
      return 'https://paper-clips.com/';
    }
  },
  debug: true,
};