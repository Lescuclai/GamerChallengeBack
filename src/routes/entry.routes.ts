import { Router } from "express"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
import EntryController from "../controllers/EntryController/EntryController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
const router = Router()
const entryController = new EntryController()

router.get(
  "/most-liked",
  cw((req, res) => entryController.mostLikedEntries(req, res))
)
router.get(
  "/:challengeId",
  cw((req, res) => entryController.findAllEntries(req, res))
)
router.post(
  "/",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.postEntry(req, res))
)
export default router
