"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTest from '@/components/data-test';
import Navbar from '@/components/Navbar';
//import QueryComponent from '@/components/QueryComponent';

export default function Dashboard({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    } else if (status === "authenticated" && session?.user?.id !== params.id) {
      router.push(`/dashboard/${session?.user?.id ?? ''}`);
    }
  }, [status, router, session, params.id]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        {session && (
          <div>
            <p className="mb-2">Welcome, {session?.user?.email}</p>
            <p className="mb-4">User ID: {params.id}</p>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mb-4">Logout</button>
            
            <DataTest />

          </div>
        )}
      </div>
    </div>
  );
}