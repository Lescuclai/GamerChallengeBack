import { Router } from "express"
import EntryController from "../controllers/EntryController/EntryController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"

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
  "/:challengeId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.postEntry(req, res))
)

router.patch(
  "/:entryId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.updateEntry(req, res))
)

router.delete(
  "/:entryId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.deleteEntry(req, res))
)

export default router
