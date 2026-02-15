import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftItem, DEFAULT_ITEMS, generateId } from './data';

const ITEMS_KEY = '@nosso_enxoval_items';
const COUPLE_CODE_KEY = '@nosso_enxoval_couple_code';
const GUEST_CODE_KEY = '@nosso_enxoval_guest_code';
const AUTH_KEY = '@nosso_enxoval_auth';
const INITIALIZED_KEY = '@nosso_enxoval_initialized';

export async function initializeItems(): Promise<GiftItem[]> {
  const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
  if (initialized) {
    return getItems();
  }
  const items: GiftItem[] = DEFAULT_ITEMS.map((item) => ({
    ...item,
    id: generateId(),
  }));
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
  await AsyncStorage.setItem(COUPLE_CODE_KEY, '1234');
  await AsyncStorage.setItem(GUEST_CODE_KEY, 'casamento2026');
  return items;
}

export async function getItems(): Promise<GiftItem[]> {
  const data = await AsyncStorage.getItem(ITEMS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export async function saveItems(items: GiftItem[]): Promise<void> {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function addItem(item: Omit<GiftItem, 'id'>): Promise<GiftItem> {
  const items = await getItems();
  const newItem: GiftItem = { ...item, id: generateId() };
  items.push(newItem);
  await saveItems(items);
  return newItem;
}

export async function updateItem(id: string, updates: Partial<GiftItem>): Promise<void> {
  const items = await getItems();
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    await saveItems(items);
  }
}

export async function deleteItem(id: string): Promise<void> {
  const items = await getItems();
  const filtered = items.filter((i) => i.id !== id);
  await saveItems(filtered);
}

export async function reserveItem(
  id: string,
  guestName: string,
  guestMessage?: string
): Promise<void> {
  await updateItem(id, {
    status: 'reserved',
    guestName,
    guestMessage,
    reservedAt: Date.now(),
  });
}

export async function markAsGifted(id: string): Promise<void> {
  await updateItem(id, { status: 'gifted' });
}

export async function unreserveItem(id: string): Promise<void> {
  await updateItem(id, {
    status: 'available',
    guestName: undefined,
    guestMessage: undefined,
    reservedAt: undefined,
  });
}

export async function getCoupleCode(): Promise<string> {
  return (await AsyncStorage.getItem(COUPLE_CODE_KEY)) || '1234';
}

export async function getGuestCode(): Promise<string> {
  return (await AsyncStorage.getItem(GUEST_CODE_KEY)) || 'casamento2026';
}

export async function verifyCoupleCode(code: string): Promise<boolean> {
  const stored = await getCoupleCode();
  return code === stored;
}

export async function verifyGuestCode(code: string): Promise<boolean> {
  const stored = await getGuestCode();
  return code.toLowerCase() === stored.toLowerCase();
}

export async function setAuth(role: 'couple' | 'guest'): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, role);
}

export async function getAuth(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_KEY);
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}
