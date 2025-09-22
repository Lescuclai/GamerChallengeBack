import jwt from "jsonwebtoken"
import { User } from "@prisma/client"
import { config } from "../../config.js"

export function generateAuthenticationTokens(user: User) {
  const payload = {
    id: user.user_id,
    role: user.role,
  }

  const JWT_SECRET = config.server.jwtSecret
  if (!JWT_SECRET) {
    throw new Error("JWT SECRET KEY is not defined in .env")
  }

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  })

  return {
    token: accessToken,
    type: "Bearer",
    expiresInMS: 1 * 60 * 60 * 1000, // 1h
  }
}

export function getJwtSecret() {
  const JWT_SECRET = config.server.jwtSecret
  if (!JWT_SECRET) {
    throw new Error("JWT SECRET KEY is not defined in .env")
  }

  return JWT_SECRET
}
