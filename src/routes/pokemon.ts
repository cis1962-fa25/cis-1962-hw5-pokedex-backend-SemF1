import { Router } from "express";
import Pokedex from "pokedex-promise-v2";
import { z } from "zod";

const router = Router();
const P = new Pokedex();


router.get("/", async (req, res) => {
  const querySchema = z.object({
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((n) => n > 0 && n <= 50, "Limit must be between 1–50"),
    offset: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((n) => n >= 0, "Offset must be greater 0"),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: parsed.error.issues[0].message,
    });
  }

  const { limit, offset } = parsed.data;

  try {
    const list = await P.getPokemonsList({ limit, offset });

    const results = await Promise.all(
      list.results.map(async (p: any) => {
        try {
          const data = await P.getPokemonByName(p.name);
          return {
            id: data.id,
            name: data.name,
            types: data.types.map((t: any) => t.type.name),
            sprite: data.sprites.front_default,
          };
        } catch {
          return null;
        }
      })
    );

    const filtered = results.filter(Boolean);

    res.json({
      limit,
      offset,
      count: list.count,
      results: filtered,
    });
  } catch (err) {
    console.error("Error fetching Pokémon list:", err);
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Failed to load Pokémon list" });
  }
});


router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const [pokemon, species] = await Promise.all([
      P.getPokemonByName(name.toLowerCase()),
      P.getPokemonSpeciesByName(name.toLowerCase()),
    ]);

    const flavor =
      species.flavor_text_entries.find((f: any) => f.language.name === "en")
        ?.flavor_text?.replace(/\f|\n/g, " ") ?? "";

    const baseData = {
      id: pokemon.id,
      name:
        species.names.find((n: any) => n.language.name === "en")?.name ??
        pokemon.name,
      types: pokemon.types.map((t: any) => t.type.name),
      sprite: pokemon.sprites.front_default,
      flavor,
    };

    const selectedMoves = pokemon.moves.slice(0, 3).map((m: any) => m.move.name);

    const movesData = await Promise.all(
      selectedMoves.map(async (moveName: string) => {
        try {
          const move = await P.getMoveByName(moveName);
          const power = move.power ?? "N/A";
          const type = move.type.name;
          const engName =
            move.names?.find((n: any) => n.language.name === "en")?.name ??
            move.name;
          return { name: engName, power, type };
        } catch {
          return { name: moveName, power: "N/A", type: "unknown" };
        }
      })
    );

    res.json({ ...baseData, moves: movesData });
  } catch {
    res.status(404).json({ code: "NOT_FOUND", message: "Pokemon not found" });
  }
});

export default router;
