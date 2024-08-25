"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

function ErrorFallback({error}: {error: Error}) {
  console.error("Error in RootLayout:", error);
  return (
    <div>
      <h1>Something went wrong:</h1>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}