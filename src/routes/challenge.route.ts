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
router.get(
  "/",
  verifyToken({ ownerRequired: false }),
  cw((req, res) => challengeController.findAllWithPagination(req, res))
)
router.get(
  "/:challengeId",
  cw((req, res) => challengeController.findUniqueChallenge(req, res))
)
router.post(
  "/",
  verifyToken({ ownerRequired: true }),
  cw((req, res) => challengeController.createChallenge(req, res))
)
export default router
