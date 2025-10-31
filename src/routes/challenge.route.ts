import { Router } from "express"
import ChallengeController from "../controllers/ChallengeController/ChallengeController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { controllerWrapper as cw } from "../utils/controllerWrapper.js"
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
  verifyToken({ validityRequired: true }),
  cw((req, res) => challengeController.toggleChallengeVote(req, res))
)
router.get(
  "/",
  verifyToken({ validityRequired: false }),
  cw((req, res) => challengeController.findAllWithPagination(req, res))
)

router.post(
  "/",
  verifyToken({ validityRequired: true }),
  cw((req, res) => challengeController.createChallenge(req, res))
)

router.get(
  "/:challengeId",
  verifyToken({ validityRequired: false }),
  cw((req, res) => challengeController.findUniqueChallenge(req, res))
)

router.patch(
  "/:challengeId",
  verifyToken({ validityRequired: true }),
  cw((req, res) => challengeController.updateChallenge(req, res))
)
router.delete(
  "/:challengeId",
  verifyToken({ validityRequired: true }),
  cw((req, res) => challengeController.deleteChallenge(req, res))
)

export default router
