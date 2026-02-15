import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest, getApiUrl } from './query-client';
import { GiftItem } from './data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@nosso_enxoval_auth';

interface AppContextValue {
  items: GiftItem[];
  loading: boolean;
  role: 'couple' | 'guest' | null;
  setRole: (role: 'couple' | 'guest' | null) => void;
  refreshItems: () => Promise<void>;
  addItem: (item: Omit<GiftItem, 'id'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<GiftItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  reserveItem: (id: string, guestName: string, guestMessage?: string) => Promise<void>;
  markAsGifted: (id: string) => Promise<void>;
  unreserveItem: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyCode: (code: string, role: 'couple' | 'guest') => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

function mapServerItem(item: any): GiftItem {
  return {
    id: item.id,
    room: item.room,
    name: item.name,
    status: item.status || 'available',
    guestName: item.guestName || item.guest_name || undefined,
    guestMessage: item.guestMessage || item.guest_message || undefined,
    reservedAt: item.reservedAt || item.reserved_at || undefined,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<'couple' | 'guest' | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((stored) => {
      if (stored === 'couple' || stored === 'guest') {
        setRoleState(stored);
      }
      setAuthLoaded(true);
    });
  }, []);

  const itemsQuery = useQuery<GiftItem[]>({
    queryKey: ['/api/items'],
    refetchInterval: 5000,
    staleTime: 3000,
    enabled: authLoaded,
    select: (data: any[]) => data.map(mapServerItem),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });

  const items = itemsQuery.data || [];
  const loading = !authLoaded || (itemsQuery.isLoading && !itemsQuery.data);

  const setRole = useCallback(async (r: 'couple' | 'guest' | null) => {
    if (r) {
      await AsyncStorage.setItem(AUTH_KEY, r);
    } else {
      await AsyncStorage.removeItem(AUTH_KEY);
    }
    setRoleState(r);
  }, []);

  const verifyCode = useCallback(async (code: string, r: 'couple' | 'guest'): Promise<boolean> => {
    try {
      const res = await apiRequest('POST', '/api/auth/verify', { code, role: r });
      const data = await res.json();
      return data.success === true;
    } catch {
      return false;
    }
  }, []);

  const refreshItems = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
  }, []);

  const addItem = useCallback(async (item: Omit<GiftItem, 'id'>) => {
    try {
      await apiRequest('POST', '/api/items', { room: item.room, name: item.name });
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<GiftItem>) => {
    try {
      await apiRequest('PATCH', `/api/items/${id}`, updates);
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await apiRequest('DELETE', `/api/items/${id}`);
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const reserveItem = useCallback(async (id: string, guestName: string, guestMessage?: string) => {
    try {
      await apiRequest('POST', `/api/items/${id}/reserve`, { guestName, guestMessage });
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const markAsGifted = useCallback(async (id: string) => {
    try {
      await apiRequest('POST', `/api/items/${id}/gift`);
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const unreserveItem = useCallback(async (id: string) => {
    try {
      await apiRequest('POST', `/api/items/${id}/unreserve`);
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    } catch (error) {
      await queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setRoleState(null);
  }, []);

  const value = useMemo(() => ({
    items,
    loading,
    role,
    setRole,
    refreshItems,
    addItem,
    updateItem,
    deleteItem,
    reserveItem,
    markAsGifted,
    unreserveItem,
    logout,
    verifyCode,
  }), [items, loading, role, setRole, refreshItems, addItem, updateItem, deleteItem, reserveItem, markAsGifted, unreserveItem, logout, verifyCode]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
