import dotenv from "dotenv"
import { Role } from "@prisma/client"
import type { Request, Response, NextFunction } from "express"
import { decodeJwt } from "../utils/tokens.js"

dotenv.config()

export interface JwtPayload {
  id: number
  role: Role
}

export interface JwtRequest extends Request {
  user?: JwtPayload
}

export const verifyToken = (
  req: JwtRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken || accessToken.trim() === "") {
    return res.status(401).json({ message: "Utilisateur non authentifié" })
  }

  try {
    const user = decodeJwt(accessToken)
    req.user = user as JwtPayload

    next()
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré" })
  }
}

export function verifyRoles(roles: Role[]) {
  return (req: JwtRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" })
    }

    next()
  }
}
