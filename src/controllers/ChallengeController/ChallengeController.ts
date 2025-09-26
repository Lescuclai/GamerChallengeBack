import { Challenge } from "@prisma/client"
import { Request, Response } from "express"
import z from "zod"
import { prisma } from "../../../prisma/index.js"
import { challengeSchema } from "../../schemas/challenge.schema.js"
import BaseController from "../BaseController.js"
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
    const { page, limit } = await z
      .object({
        limit: z.coerce.number().int().min(1).optional().default(5),
        page: z.coerce.number().int().min(1).optional().default(1),
      })
      .parseAsync(req.query)
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
  }
  //Challenge
  async createChallenge(req: Request, res: Response) {
    const result = challengeSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: "Validation échouée",
        details: result.error.issues,
      })
    }
    try {
      const { title, description, rules, game_title, userId } = result.data
      const game = await prisma.game.findUnique({
        where: { title: game_title },
      })

      if (!game) {
        return res.status(404).json({ error: "Jeu non trouvé" })
      }

      const newChallenge = await this.create({
        title,
        description,
        rules,
        game_id: game.game_id,
        user_id: userId,
      })
      return res.status(201).json({
        message: "Challenge créé",
        challenge: newChallenge,
      })
    } catch (err: unknown) {
      console.error(err)
      return res.status(500).json({
        error: "Erreur serveur",
        details: err instanceof Error ? err.message : "Erreur inconnue",
      })
    }
  }
}
