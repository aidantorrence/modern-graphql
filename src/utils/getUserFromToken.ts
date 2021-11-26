import JWT from "jsonwebtoken";
import { KEYS } from "../keys";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, KEYS.JWT_SIGNATURE) as { userId: number };
  } catch (err) {
    return null;
  }
};
