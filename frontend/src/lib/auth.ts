import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }
  
          try {
            await dbConnect();
            const user = await User.findOne({ email: credentials.email });
  
            if (!user) {
              console.log('User not found:', credentials.email);
              return null;
            }
  
            const isValid = await bcrypt.compare(credentials.password, user.password);
  
            if (isValid) {
              console.log('User authenticated:', user.email);
              return {
                id: user._id.toString(), // Map _id to id
                email: user.email,
                name: user.name,
              };
            } else {
              console.log('Invalid password for:', credentials.email);
              return null;
            }
          } catch (error) {
            console.error('Error in authorize function:', error);
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        console.log('JWT callback - token:', token);
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
        }
        console.log('Session callback - session:', session);
        return session;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug messages in the console
  };