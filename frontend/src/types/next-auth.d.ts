import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // This corresponds to the mapped id from your User model
      email: string;
      name: string;
    };
  }
}