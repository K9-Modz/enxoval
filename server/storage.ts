import { db } from "./db";
import { items, type Item } from "@shared/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ITEMS: { room: string; name: string }[] = [
  { room: 'cozinha', name: 'Geladeira' },
  { room: 'cozinha', name: 'Fogão' },
  { room: 'cozinha', name: 'Micro-ondas' },
  { room: 'cozinha', name: 'Air Fryer' },
  { room: 'cozinha', name: 'Liquidificador' },
  { room: 'cozinha', name: 'Jogo de Panelas' },
  { room: 'cozinha', name: 'Pratos' },
  { room: 'cozinha', name: 'Copos' },
  { room: 'cozinha', name: 'Talheres' },
  { room: 'sala', name: 'Sofá' },
  { room: 'sala', name: 'Televisão' },
  { room: 'sala', name: 'Rack' },
  { room: 'sala', name: 'Tapete' },
  { room: 'sala', name: 'Cortinas' },
  { room: 'quarto', name: 'Cama' },
  { room: 'quarto', name: 'Colchão' },
  { room: 'quarto', name: 'Guarda-roupa' },
  { room: 'quarto', name: 'Lençóis' },
  { room: 'quarto', name: 'Travesseiros' },
  { room: 'banheiro', name: 'Toalhas' },
  { room: 'banheiro', name: 'Tapete' },
  { room: 'banheiro', name: 'Porta-sabonete' },
  { room: 'banheiro', name: 'Lixeira' },
  { room: 'lavanderia', name: 'Máquina de Lavar' },
  { room: 'lavanderia', name: 'Varal' },
  { room: 'lavanderia', name: 'Ferro de Passar' },
  { room: 'lavanderia', name: 'Tábua de Passar' },
  { room: 'escritorio', name: 'Escrivaninha' },
  { room: 'escritorio', name: 'Cadeira de Escritório' },
  { room: 'escritorio', name: 'Luminária' },
  { room: 'escritorio', name: 'Estante' },
  { room: 'area-externa', name: 'Churrasqueira' },
  { room: 'area-externa', name: 'Mesa de Jardim' },
  { room: 'area-externa', name: 'Cadeiras de Jardim' },
  { room: 'area-externa', name: 'Rede' },
];

export async function seedIfEmpty() {
  const existing = await db.select().from(items).limit(1);
  if (existing.length > 0) return;

  for (const item of DEFAULT_ITEMS) {
    await db.insert(items).values({
      room: item.room,
      name: item.name,
      status: "available",
    });
  }
  console.log(`Seeded ${DEFAULT_ITEMS.length} default items`);
}

export async function getAllItems(): Promise<Item[]> {
  return db.select().from(items);
}

export async function getItem(id: string): Promise<Item | undefined> {
  const result = await db.select().from(items).where(eq(items.id, id));
  return result[0];
}

export async function createItem(data: { room: string; name: string; status?: string }): Promise<Item> {
  const result = await db.insert(items).values({
    room: data.room,
    name: data.name,
    status: data.status || "available",
  }).returning();
  return result[0];
}

export async function updateItem(id: string, data: Partial<{
  status: string;
  guestName: string | null;
  guestMessage: string | null;
  reservedAt: number | null;
}>): Promise<Item | undefined> {
  const result = await db.update(items).set(data).where(eq(items.id, id)).returning();
  return result[0];
}

export async function deleteItem(id: string): Promise<boolean> {
  const result = await db.delete(items).where(eq(items.id, id)).returning();
  return result.length > 0;
}

export async function reserveItem(id: string, guestName: string, guestMessage?: string): Promise<Item | undefined> {
  return updateItem(id, {
    status: "reserved",
    guestName,
    guestMessage: guestMessage || null,
    reservedAt: Date.now(),
  });
}

export async function markAsGifted(id: string): Promise<Item | undefined> {
  return updateItem(id, { status: "gifted" });
}

export async function unreserveItem(id: string): Promise<Item | undefined> {
  return updateItem(id, {
    status: "available",
    guestName: null,
    guestMessage: null,
    reservedAt: null,
  });
}
