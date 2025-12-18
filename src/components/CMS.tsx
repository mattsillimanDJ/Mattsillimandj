import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CMSLogin } from './CMSLogin';
import { CMSAdmin } from './CMSAdmin';
import { Toaster } from './ui/sonner';

export function CMS() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAccessToken(session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {accessToken ? (
        <CMSAdmin accessToken={accessToken} onLogout={() => setAccessToken(null)} />
      ) : (
        <CMSLogin onLogin={setAccessToken} />
      )}
      <Toaster />
    </>
  );
}
