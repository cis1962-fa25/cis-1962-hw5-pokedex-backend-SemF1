import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redis = createClient({ url: process.env.REDIS_URL });

redis.on("error", (err) => console.error("Redis Error:", err));

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("✅ Connected to Redis");
  }
};
