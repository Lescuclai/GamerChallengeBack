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
  verifyToken({ validityRequired: false }),
  cw((req, res) => entryController.findAllEntries(req, res))
)
router.post(
  "/:challengeId",
  verifyToken({ validityRequired: true }),
  cw((req, res) => entryController.postEntry(req, res))
)

router.post(
  "/:entryId/vote",
  verifyToken({ validityRequired: true }),
  cw((req, res) => entryController.toggleEntryVote(req, res))
)

router.patch(
  "/:entryId",
  verifyToken({ validityRequired: true }),
  cw((req, res) => entryController.updateEntry(req, res))
)

router.delete(
  "/:entryId",
  verifyToken({ validityRequired: true }),
  cw((req, res) => entryController.deleteEntry(req, res))
)


export default router
