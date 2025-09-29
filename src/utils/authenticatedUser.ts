import { decodeJwt } from "./tokens.js"
import { JwtRequest } from "../middlewares/authMiddleware.js"

export default function getAuthenticatedUser(req: JwtRequest) {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) return null

  try {
    const user = decodeJwt(accessToken)
    if (!user?.id) return null
    return user.id
  } catch (error) {
    return null
  }
}
