import { useState, useEffect } from 'react';
import { AuthService } from '../services';
import { AuthState } from '../models';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => 
    AuthService.getCurrentAuthState()
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar se o usuário ainda está autenticado ao carregar a aplicação
    const currentState = AuthService.getCurrentAuthState();
    setAuthState(currentState);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await AuthService.login({ username, password });
      if (success) {
        const newState = AuthService.getCurrentAuthState();
        setAuthState(newState);
      }
      return success;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({ isAuthenticated: false, user: null });
  };

  const isAuthenticated = (): boolean => {
    return AuthService.isAuthenticated();
  };

  return {
    authState,
    loading,
    login,
    logout,
    isAuthenticated
  };
};