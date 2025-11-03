import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function initSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!anonKey) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const globalForSupabase = globalThis as unknown as {
    supabase: SupabaseClient | undefined;
  };

  const client = globalForSupabase.supabase ?? createClient(url, anonKey);

  if (process.env.NODE_ENV !== 'production') {
    globalForSupabase.supabase = client;
  }

  return client;
}

export const supabase = initSupabaseClient();
export { initSupabaseClient };


