import { Challenge } from "@prisma/client"
import BaseController from "../BaseController.js"
import { prisma } from "../../../prisma/index.js"
import { Request, Response } from "express"
import { Pagination } from "../../utils/pagination.js"
export default class ChallengeController extends BaseController<
  Challenge,
  "challenge_id"
> {
  constructor() {
    super(prisma.challenge, "challenge_id")
  }
  async newestChallenges(req: Request, res: Response) {
    const data = await prisma.challenge.findMany({
      select: {
        challenge_id: true,
        created_at: true,
        title: true,
        user: {
          select: {
            pseudo: true,
          },
        },
        game: {
          select: {
            title: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 4,
    })
    return res.status(200).json({ data })
  }
  async mostLikedChallenges(req: Request, res: Response) {
    const data = await prisma.challenge.findMany({
      select: {
        challenge_id: true,
        title: true,
        game_id: true,
        game: {
          select: {
            image_url: true,
          },
        },
        _count: {
          select: {
            challengeVoters: true,
          },
        },
      },
      orderBy: {
        challengeVoters: {
          _count: "desc",
        },
      },
      take: 3,
    })
    return res.status(200).json({ data })
  }
  async findAllWithPagination(req: Request, res: Response) {
    Pagination(req, res, "challenge")
  }
}
