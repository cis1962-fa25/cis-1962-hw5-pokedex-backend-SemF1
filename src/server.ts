import express from "express";
import dotenv from "dotenv";
import { connectRedis } from "./utils/redis";

import tokenRoute from "./routes/token";
import pokemonRoute from "./routes/pokemon";
import boxRoute from "./routes/box";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/token", tokenRoute);
app.use("/pokemon", pokemonRoute);
app.use("/box", boxRoute);

app.get("/", (_, res) => res.send("Pokedex backend is running"));

const PORT = process.env.PORT || 3000;

connectRedis()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
    process.exit(1);
  });
