import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  supabase: SupabaseClient<Database> | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create supabase client only if URL is available
const getSupabaseClient = (): SupabaseClient<Database> | null => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  if (!url || !key) {
    console.warn('Supabase URL or key not available yet');
    return null;
  }
  
  return createClient<Database>(url, key, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    const client = getSupabaseClient();
    
    if (!client) {
      // Retry after a short delay if client not available
      const timeout = setTimeout(() => {
        const retryClient = getSupabaseClient();
        if (retryClient) {
          setSupabaseClient(retryClient);
        } else {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
    
    setSupabaseClient(client);
  }, []);

  useEffect(() => {
    if (!supabaseClient) return;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!supabaseClient) {
      return { error: new Error('Supabase client not initialized') };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName || email,
        },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) {
      return { error: new Error('Supabase client not initialized') };
    }
    
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, supabase: supabaseClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
