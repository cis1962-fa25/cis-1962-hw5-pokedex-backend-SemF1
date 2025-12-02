import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const bodySchema = z.object({ pennkey: z.string().nonempty() });

router.post("/", (req, res) => {
  const result = bodySchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ code: "BAD_REQUEST", message: "Missing or invalid pennkey" });

  const token = jwt.sign(result.data, process.env.JWT_TOKEN_SECRET!, { expiresIn: "1h" });
  return res.status(200).json({ token });
});

export default router;
