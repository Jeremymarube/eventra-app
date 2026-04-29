"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for locally stored user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing stored user data", e);
          }
        }

        // If Supabase isn't configured, we're done
        if (!supabase) {
          console.warn("Supabase is not configured. Using localStorage authentication.");
          setError(new Error("Supabase configuration missing"));
          setUser(null);
          setLoading(false);
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError);
          setUser(null);
        } else {
          setUser(session?.user || null);
        }
      } catch (err) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes if Supabase is configured
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
