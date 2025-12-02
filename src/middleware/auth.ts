import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: { pennkey: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing token" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Malformed token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    req.user = payload as { pennkey: string };
    next();
  } catch {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
};
