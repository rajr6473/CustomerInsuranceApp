// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import Toast from 'react-native-toast-message';

type User = {
  id?: string;
  name1?: string;
  email?: string;
  role?: 'user' | 'agent' | string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);   // used for restore + API calls

  // restore token on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const profile = await api.getProfile(token).catch(() => null);
          setUser(profile ?? null);
        }
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const signIn = async (credentials: { email: string; password: string }): Promise<void> => {
  console.log('Signing in with credentials:', credentials);
  setLoading(true);
  try {
    const res = await api.login(credentials);

    const token = res.data?.token;
    if (!token) {
      throw new Error('Login failed: token not received');
    }

    await AsyncStorage.setItem('token', token);

    const userDetails: User = {
      ...res.data,
      role: res.data.role,
      name1: res.data.username,
      email: res.data.email,
    };

    setUser(userDetails);
    console.log('[DEBUG] User details after login:', userDetails);
  } catch (err: any) {
    setUser(null);

    // build nice message instead of raw 401
    const status = err?.response?.status;
    let niceMessage = 'Something went wrong. Please try again.';

    if (status === 401) {
      niceMessage =
        'Invalid user ID or password. Please check your credentials and try again.';
    }

    Toast.show({
      type: 'error',
      text1: 'Login failed',
      text2:
        'Invalid user ID or password. Please check your credentials and try again.',
      visibilityTime: 5000,
      autoHide: true,
      position: 'top',          // use top for stability
      topOffset: 180,            // add margin from status bar
    });


    throw err;
  } finally {
    setLoading(false);
  }
};


  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const getToken = async () => {
    const t = await AsyncStorage.getItem('token');
    console.log('[DEBUG] getToken', t);
    return t;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
