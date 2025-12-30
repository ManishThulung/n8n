import { JWT_SECRET } from "@/config";
import jwt from "jsonwebtoken";

export const generateToken = (payload: Object) => {
  return jwt.sign(payload, JWT_SECRET);
};
