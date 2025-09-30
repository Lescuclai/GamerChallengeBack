import { Router } from "express"
import ChallengeController from "../controllers/ChallengeController/ChallengeController.js"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
const router = Router()
const challengeController = new ChallengeController()
router.get(
  "/newest",
  cw((req, res) => challengeController.newestChallenges(req, res))
)
router.get(
  "/most-liked",
  cw((req, res) => challengeController.mostLikedChallenges(req, res))
)
router.post(
  "/:id/vote",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => challengeController.toggleChallengeVote(req, res))
)
router.get(
  "/",
  verifyToken({ ownerRequired: false }),
  cw((req, res) => challengeController.findAllWithPagination(req, res))
)
router.get(
  "/:challengeId",
  verifyToken({ ownerRequired: false }),
  cw((req, res) => challengeController.findUniqueChallenge(req, res))
)
router.patch(
  "/:challengeId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => challengeController.updateChallenge(req, res))
)
router.delete(
  "/:challengeId",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => challengeController.deleteChallenge(req, res))
)

export default router
