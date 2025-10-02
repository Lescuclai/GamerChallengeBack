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
  verifyToken({ ownerRequired: false }),
  cw((req, res) => entryController.findAllEntries(req, res))
)
router.post(
  "/:challengeId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.postEntry(req, res))
)
router.post(
  "/:entryId/vote",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => entryController.toggleEntryVote(req, res))
)
export default router
