import { JWT_SECRET } from "@/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    throw new Error("Forbidden");
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded) {
    throw new Error("Something went wrong");
  }
  (req as any).user = decoded;
  next();
}
