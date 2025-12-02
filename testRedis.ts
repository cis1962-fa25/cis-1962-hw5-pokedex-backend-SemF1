import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => console.log("Redis Error:", err));
  await client.connect();

  await client.set("hello", "world");
  console.log(await client.get("hello"));

  await client.quit();
})();
