import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../services/api';
import { saveToken, getToken, removeToken, saveUser, getUser } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // App startup auth check
  const [authLoading, setAuthLoading] = useState(false); // During login/register actions

  // Check persisted auth session on app launch
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          // Verify token validity with backend
          const response = await api.get('/auth/me');
          if (response.data && response.data.user) {
            setUser(response.data.user);
            await saveUser(response.data.user);
          }
        }
      } catch (error) {
        console.log('Session restore failed or expired:', error.message);
        // Token was invalid or expired, clear storage
        await removeToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      await saveToken(receivedToken);
      await saveUser(receivedUser);

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      await saveToken(receivedToken);
      await saveUser(receivedUser);

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        authLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
