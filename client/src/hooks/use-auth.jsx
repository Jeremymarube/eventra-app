"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (e) {
      console.error("Error parsing stored user data", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
