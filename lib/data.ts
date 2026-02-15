export type ItemStatus = 'available' | 'reserved' | 'gifted';

export interface GiftItem {
  id: string;
  room: string;
  name: string;
  status: ItemStatus;
  guestName?: string;
  guestMessage?: string;
  reservedAt?: number;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
}

export const ROOMS: Room[] = [
  { id: 'cozinha', name: 'Cozinha', icon: 'restaurant-outline', iconFamily: 'Ionicons' },
  { id: 'sala', name: 'Sala', icon: 'sofa-outline', iconFamily: 'MaterialCommunityIcons' },
  { id: 'quarto', name: 'Quarto', icon: 'bed-outline', iconFamily: 'Ionicons' },
  { id: 'banheiro', name: 'Banheiro', icon: 'water-outline', iconFamily: 'Ionicons' },
  { id: 'lavanderia', name: 'Lavanderia', icon: 'washing-machine', iconFamily: 'MaterialCommunityIcons' },
  { id: 'escritorio', name: 'Escritório', icon: 'desktop-outline', iconFamily: 'Ionicons' },
  { id: 'area-externa', name: 'Área Externa', icon: 'leaf-outline', iconFamily: 'Ionicons' },
];

export const DEFAULT_ITEMS: Omit<GiftItem, 'id'>[] = [
  { room: 'cozinha', name: 'Geladeira', status: 'available' },
  { room: 'cozinha', name: 'Fogão', status: 'available' },
  { room: 'cozinha', name: 'Micro-ondas', status: 'available' },
  { room: 'cozinha', name: 'Air Fryer', status: 'available' },
  { room: 'cozinha', name: 'Liquidificador', status: 'available' },
  { room: 'cozinha', name: 'Jogo de Panelas', status: 'available' },
  { room: 'cozinha', name: 'Pratos', status: 'available' },
  { room: 'cozinha', name: 'Copos', status: 'available' },
  { room: 'cozinha', name: 'Talheres', status: 'available' },
  { room: 'sala', name: 'Sofá', status: 'available' },
  { room: 'sala', name: 'Televisão', status: 'available' },
  { room: 'sala', name: 'Rack', status: 'available' },
  { room: 'sala', name: 'Tapete', status: 'available' },
  { room: 'sala', name: 'Cortinas', status: 'available' },
  { room: 'quarto', name: 'Cama', status: 'available' },
  { room: 'quarto', name: 'Colchão', status: 'available' },
  { room: 'quarto', name: 'Guarda-roupa', status: 'available' },
  { room: 'quarto', name: 'Lençóis', status: 'available' },
  { room: 'quarto', name: 'Travesseiros', status: 'available' },
  { room: 'banheiro', name: 'Toalhas', status: 'available' },
  { room: 'banheiro', name: 'Tapete', status: 'available' },
  { room: 'banheiro', name: 'Porta-sabonete', status: 'available' },
  { room: 'banheiro', name: 'Lixeira', status: 'available' },
  { room: 'lavanderia', name: 'Máquina de Lavar', status: 'available' },
  { room: 'lavanderia', name: 'Varal', status: 'available' },
  { room: 'lavanderia', name: 'Ferro de Passar', status: 'available' },
  { room: 'lavanderia', name: 'Tábua de Passar', status: 'available' },
  { room: 'escritorio', name: 'Escrivaninha', status: 'available' },
  { room: 'escritorio', name: 'Cadeira de Escritório', status: 'available' },
  { room: 'escritorio', name: 'Luminária', status: 'available' },
  { room: 'escritorio', name: 'Estante', status: 'available' },
  { room: 'area-externa', name: 'Churrasqueira', status: 'available' },
  { room: 'area-externa', name: 'Mesa de Jardim', status: 'available' },
  { room: 'area-externa', name: 'Cadeiras de Jardim', status: 'available' },
  { room: 'area-externa', name: 'Rede', status: 'available' },
];

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
