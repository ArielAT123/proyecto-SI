import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Restaurant, Ad } from '../types';

interface AppContextType {
  API_URL: string;
  token: string | null;
  currentUser: User | null;
  restaurants: Restaurant[];
  activeAds: Ad[];
  loading: boolean;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
  rechargeWallet: (amount: number) => Promise<User | null>;
  refreshAds: () => Promise<void>;
  refreshRestaurants: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeAds, setActiveAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Authenticated fetch wrapper
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(API_URL);
    setSocket(socketInstance);

    // Listen for live updates to restaurant tables
    socketInstance.on('table_update', (data: { restaurantId: number; tables: any[]; availableCount: number }) => {
      console.log('Socket update received:', data);
      
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) => {
          if (r.id === data.restaurantId) {
            return {
              ...r,
              tables: data.tables,
              availableTablesCount: data.availableCount,
            };
          }
          return r;
        })
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch initial profile and general public data
  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Load public list of restaurants
      const restRes = await fetch(`${API_URL}/api/restaurants`);
      if (restRes.ok) {
        const restData = await restRes.json();
        setRestaurants(restData);
      }

      // Load active advertising ads
      const adsRes = await fetch(`${API_URL}/api/ads`);
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setActiveAds(adsData);
      }

      // If token exists, load user profile
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const userRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing application:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, [token]);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  // Register
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al registrarse' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Sync current user's profile details
  const refreshCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await authFetch(`${API_URL}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Error refreshing user details:', error);
    }
  };

  // Recharge user wallet
  const rechargeWallet = async (amount: number) => {
    if (!currentUser) return null;
    try {
      const res = await authFetch(`${API_URL}/api/users/${currentUser.id}/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(prev => prev ? { ...prev, balance: updatedUser.balance } : null);
        await refreshCurrentUser();
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error recharging wallet:', error);
      return null;
    }
  };

  // Refresh ads
  const refreshAds = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ads`);
      if (res.ok) {
        const data = await res.json();
        setActiveAds(data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  // Refresh restaurants list
  const refreshRestaurants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        API_URL,
        token,
        currentUser,
        restaurants,
        activeAds,
        loading,
        socket,
        login,
        register,
        logout,
        refreshCurrentUser,
        rechargeWallet,
        refreshAds,
        refreshRestaurants,
        authFetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
