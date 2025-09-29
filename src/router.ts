import { Router } from "express"
import authRoutes from "./routes/auth.routes.js"
import challengeRoutes from "./routes/challenge.route.js"
import entryRoutes from "./routes/entry.routes.js"

export const router = Router()
//Routes
router.use("/auth", authRoutes)
router.use("/challenges", challengeRoutes)
router.use("/entries", entryRoutes)
//Default 404
router.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})
