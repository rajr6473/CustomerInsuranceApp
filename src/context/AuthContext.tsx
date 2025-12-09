// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'agent' | string;
  // add other fields returned by your profile API
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

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

const signInold = async (credentials: { email: string; password: string }) => {
  // enable fake <logic 
  // setUser({ role: 'user', name: credentials.email});
  // setUser({ role: 'agent', name: credentials.email});
  setLoading(false)
  const res = await api.login(credentials); // { token: '...' }
  if (!res?.token) throw new Error('Login failed');
  await AsyncStorage.setItem('token', res.data.token);
  const profile = await api.getProfile(res.data.token);
  setUser(profile);
};


const signIn = async (credentials: { email: string; password: string }): Promise<void> => {
  console.log('Signing in with credentials:', credentials);
  setLoading(true);
  try {
  const res = await api.login(credentials);
  console.log('[DEBUG] API response:', res);

  const token = res.data?.token;
  if (!token) throw new Error(res.message || 'Login failed: token not received');
  await AsyncStorage.setItem('token', token);

  const userDetails = {
    ...res.data,
    role: res.data.role,
    // role: 'user', // temporarily hardcode role to 'user'
    name: res.data.username,
    email: res.data.email,
  };
  setUser(userDetails);

  // Console log user details
  console.log('[DEBUG] User details after login:', userDetails);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[DEBUG] Login failed:', message);
    setUser(null);
    Alert.alert('Login failed', message || 'Unknown error');
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
