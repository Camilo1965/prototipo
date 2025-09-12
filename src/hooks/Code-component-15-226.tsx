import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { setAuthToken, authAPI } from '../utils/api';

// Cliente Supabase para el frontend
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Context para autenticación
export const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook principal de autenticación
export const useAuthState = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión existente al cargar
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error obteniendo sesión:', error);
        setError('Error verificando sesión');
        return;
      }

      if (session?.access_token) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.email!
        };
        
        setUser(userData);
        setAuthToken(session.access_token);
      }
    } catch (err) {
      console.error('Error en checkExistingSession:', err);
      setError('Error verificando sesión');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || data.user.email!
        };
        
        setUser(userData);
        setAuthToken(data.session.access_token);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      // Usar nuestro API backend para registro
      await authAPI.register(email, password, name);

      // Después del registro exitoso, hacer login automáticamente
      await signIn(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      setUser(null);
      setAuthToken(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError
  };
};

// Hook para verificar si el usuario está autenticado
export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirigir a login o mostrar modal de login
      console.warn('Usuario no autenticado');
    }
  }, [user, loading]);

  return { user, loading, isAuthenticated: !!user };
};

// Hook para datos protegidos (solo usuarios autenticados)
export const useProtectedData = <T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
) => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading, ...dependencies]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando datos';
      setError(errorMessage);
      console.error('Error en useProtectedData:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user) {
      loadData();
    }
  };

  return {
    data,
    loading: authLoading || loading,
    error,
    refetch,
    isAuthenticated: !!user
  };
};

export default useAuth;