import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const session = data.session ?? null;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    })();

    // Listen for auth state changes (signIn, signOut, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // session will be null on signOut
        setSession(session);
        setUser(session?.user ?? null);

        // Redirect to /app/home after successful OAuth sign in
        if (event === 'SIGNED_IN' && session) {
          // Only redirect if we're on an auth page
          if (location.pathname.startsWith('/auth')) {
            navigate('/app/home', { replace: true });
          }
        }
      },
    );

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading, navigate, location.pathname]);
  return <>{children}</>;
};
