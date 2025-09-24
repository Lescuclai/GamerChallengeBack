import { Router } from "express"
import ChallengeController from "../controllers/ChallengeController/ChallengeController.js"
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
  cw((req, res) => challengeController.findAllWithPagination(req, res))
)
export default router
