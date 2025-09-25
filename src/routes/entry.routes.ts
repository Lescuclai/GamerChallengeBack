import { Router } from "express"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
import EntryController from "../controllers/EntryController/EntryController.js"
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
export default router
