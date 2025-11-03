'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';

export default function ClickerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clickCount, setClickCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        setUserId(session.user.id);
      }
      setLoading(false);
    });
  }, [router]);

  const fetchClickCount = useCallback(async (currentUserId: string) => {
    const { data, error } = await supabase
      .from('user_clicks')
      .select('click_count')
      .eq('user_id', currentUserId)
      .single();
    if (error && error.code !== 'PGRST116') {
      setMessage(`Error fetching data: ${error.message}`);
      return 0;
    }
    return data ? (data as { click_count: number }).click_count : 0;
  }, []);

  useEffect(() => {
    if (userId) {
      fetchClickCount(userId).then(count => {
        setClickCount(count);
        setMessage('Welcome back! Your previous count was loaded.');
      });
    }
  }, [userId, fetchClickCount]);

  const handleIncrement = async () => {
    if (!userId) {
      setMessage('Please log in again. User not authenticated.');
      return;
    }
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setMessage(null);
    const updateData = { user_id: userId, click_count: newCount };
    const { error } = await supabase
      .from('user_clicks')
      .upsert(updateData, { onConflict: 'user_id' });
    if (error) {
      setClickCount(newCount - 1);
      setMessage(`Error updating database: ${error.message}. Count not saved.`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-xl text-zinc-600 dark:text-zinc-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <header className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="rounded-md border border-red-500 bg-transparent px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </header>

      <main className="w-full max-w-lg text-center">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6">
          The Click Counter
        </h1>
        
        <div className="mb-8 rounded-xl bg-white p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            Total Clicks
          </p>
          <p className="text-8xl font-black text-indigo-600 dark:text-indigo-400">
            {clickCount}
          </p>
        </div>

        <button
          onClick={handleIncrement}
          className="w-full max-w-xs transform rounded-full bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition-all duration-150 ease-in-out shadow-lg hover:bg-indigo-700 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          CLICK ME!
        </button>
        
        {message && (
          <p className={`mt-4 text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {message}
          </p>
        )}

        <footer className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-600">
            Data secured by Supabase RLS policies.
          </p>
        </footer>

      </main>
    </div>
  );
}