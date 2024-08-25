import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import User from '../models/user';

interface UserType {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DataTest() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const fetchUserData = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">User Data</h2>

      <h3 className="text-xl font-bold mt-6 mb-2 text-gray-800 dark:text-white">User Object:</h3>
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-sm text-gray-800 dark:text-gray-300">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}