import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import * as storage from "./storage";

const COUPLE_CODE = "casaladm123";
const GUEST_CODE = "enxoval123";

export async function registerRoutes(app: Express): Promise<Server> {
  await storage.seedIfEmpty();

  app.post("/api/auth/verify", (req: Request, res: Response) => {
    const { code, role } = req.body;
    if (role === "couple" && code === COUPLE_CODE) {
      return res.json({ success: true, role: "couple" });
    }
    if (role === "guest" && code?.toLowerCase() === GUEST_CODE.toLowerCase()) {
      return res.json({ success: true, role: "guest" });
    }
    return res.status(401).json({ success: false, message: "Código inválido" });
  });

  app.get("/api/items", async (_req: Request, res: Response) => {
    const items = await storage.getAllItems();
    res.json(items);
  });

  app.post("/api/items", async (req: Request, res: Response) => {
    const { room, name } = req.body;
    if (!room || !name) {
      return res.status(400).json({ message: "room and name are required" });
    }
    const item = await storage.createItem({ room, name });
    res.status(201).json(item);
  });

  app.patch("/api/items/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await storage.updateItem(id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  });

  app.delete("/api/items/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await storage.deleteItem(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ success: true });
  });

  app.post("/api/items/:id/reserve", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { guestName, guestMessage } = req.body;
    if (!guestName) {
      return res.status(400).json({ message: "guestName is required" });
    }
    const item = await storage.reserveItem(id, guestName, guestMessage);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  });

  app.post("/api/items/:id/gift", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await storage.markAsGifted(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  });

  app.post("/api/items/:id/unreserve", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await storage.unreserveItem(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  });

  const httpServer = createServer(app);
  return httpServer;
}
