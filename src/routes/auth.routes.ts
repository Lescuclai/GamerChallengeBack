import { Router } from "express"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
import AuthController from "../controllers/AuthController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const router = Router()
const authController = new AuthController()

router.post(
  "/register",
  cw((req, res) => authController.register(req, res))
)

router.post(
  "/login",
  cw((req, res) => authController.login(req, res))
)

router.post(
  "/logout",
  cw((req, res) => authController.logout(req, res))
)

router.get(
  "/me",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => authController.me(req, res))
)

router.patch(
  "/delete/:userId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => authController.softDeleteUser(req, res))
)

export default router
