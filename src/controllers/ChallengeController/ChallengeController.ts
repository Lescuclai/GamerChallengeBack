import { Challenge } from "@prisma/client"
import BaseController from "../BaseController.js"
import { prisma } from "../../../prisma/index.js"
import { Request, Response } from "express"
import z from "zod"
import { JwtRequest } from "../../middlewares/authMiddleware.js"
import { decodeJwt } from "../../utils/tokens.js"
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
  async findAllWithPagination(req: JwtRequest, res: Response) {
    const accessToken = req.cookies?.accessToken
    let userId: number | undefined = undefined
    if (accessToken) {
      const user = decodeJwt(accessToken)
      userId = user?.id
    }
    const { page, limit } = await z
      .object({
        limit: z.coerce.number().int().min(1).optional().default(5),
        page: z.coerce.number().int().min(1).optional().default(1),
      })
      .parseAsync(req.query)

    if (!accessToken || !userId) {
      const [challenges, totalPages] = await Promise.all([
        prisma.challenge.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            game: true,
          },
        }),
        prisma.challenge.count(),
      ])
      const nbPages = Math.ceil(totalPages / limit)
      return res.status(200).json({ challenges, nbPages })
    } else {
      const [memberChallenges, challenges, totalFilteredPages] =
        await Promise.all([
          prisma.challenge.findMany({
            where: { user_id: userId },
            include: {
              game: true,
            },
          }),
          prisma.challenge.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: {
              user_id: {
                not: userId,
              },
            },
            include: {
              game: true,
            },
          }),
          prisma.challenge.count({
            where: {
              user_id: {
                not: userId,
              },
            },
          }),
        ])

      const nbPages = Math.ceil(totalFilteredPages / limit)
      return res.status(200).json({ memberChallenges, challenges, nbPages })
    }
  }
}
