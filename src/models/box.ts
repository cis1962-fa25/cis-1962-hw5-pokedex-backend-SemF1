import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

export const BoxEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  level: z.number().min(1).max(100),
  location: z.string().nonempty(),
  notes: z.string().optional(),
  pokemonId: z.number(),
});

export const InsertBoxEntrySchema = BoxEntrySchema.omit({ id: true });
export const UpdateBoxEntrySchema = BoxEntrySchema.partial();

export type BoxEntry = z.infer<typeof BoxEntrySchema>;
export type InsertBoxEntry = z.infer<typeof InsertBoxEntrySchema>;
export type UpdateBoxEntry = z.infer<typeof UpdateBoxEntrySchema>;

export const createBoxEntry = (data: InsertBoxEntry): BoxEntry => ({
  id: createId(),
  ...data,
});
