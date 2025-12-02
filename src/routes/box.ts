import { Router } from "express";
import { redis } from "../utils/redis";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { BoxEntrySchema, InsertBoxEntrySchema, UpdateBoxEntrySchema, createBoxEntry } from "../models/box";

const router = Router();
router.use(authMiddleware);

//List
router.get("/", async (req: AuthRequest, res) => {
  const keys = await redis.keys(`${req.user!.pennkey}:pokedex:*`);
  const ids = keys.map((k) => k.split(":").pop());
  return res.json(ids);
});

//Create
router.post("/", async (req: AuthRequest, res) => {
  const parsed = InsertBoxEntrySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ code: "BAD_REQUEST", message: "Invalid body" });

  const entry = createBoxEntry(parsed.data);
  await redis.set(`${req.user!.pennkey}:pokedex:${entry.id}`, JSON.stringify(entry));
  res.status(201).json(entry);
});

//Get
router.get("/:id", async (req: AuthRequest, res) => {
  const key = `${req.user!.pennkey}:pokedex:${req.params.id}`;
  const data = await redis.get(key);
  if (!data) return res.status(404).json({ code: "NOT_FOUND", message: "Entry not found" });
  res.json(JSON.parse(data));
});

//Update
router.put("/:id", async (req: AuthRequest, res) => {
  const key = `${req.user!.pennkey}:pokedex:${req.params.id}`;
  const existing = await redis.get(key);
  if (!existing) return res.status(404).json({ code: "NOT_FOUND", message: "Entry not found" });

  const updates = UpdateBoxEntrySchema.safeParse(req.body);
  if (!updates.success) return res.status(400).json({ code: "BAD_REQUEST", message: "Invalid data" });

  const merged = { ...JSON.parse(existing), ...updates.data };
  const validated = BoxEntrySchema.parse(merged);
  await redis.set(key, JSON.stringify(validated));
  res.json(validated);
});

//Delete
router.delete("/:id", async (req: AuthRequest, res) => {
  await redis.del(`${req.user!.pennkey}:pokedex:${req.params.id}`);
  res.status(204).send();
});

//Clear
router.delete("/", async (req: AuthRequest, res) => {
  const keys = await redis.keys(`${req.user!.pennkey}:pokedex:*`);
  for (const k of keys) await redis.del(k);
  res.status(204).send();
});

export default router;
