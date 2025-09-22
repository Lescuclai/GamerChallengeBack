import { Router } from "express"
import UserController from "../controllers/EntryController/EntryController.js"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
const router = Router()
const userController = new UserController()

router.get(
  "/favorites",
  cw((req, res) => userController.mostLikedEntries(req, res))
)
export default router
