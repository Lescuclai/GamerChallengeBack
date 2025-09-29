import BaseController from "../BaseController.js"
import { prisma } from "../../../prisma/index.js"
import { Request, Response } from "express"
import { Entry } from "@prisma/client"
import { JwtRequest } from "../../middlewares/authMiddleware.js"
import getAuthenticatedUser from "../../utils/authenticatedUser.js"

export default class EntryController extends BaseController<Entry, "entry_id"> {
  constructor() {
    super(prisma.entry, "entry_id")
  }
  async mostLikedEntries(req: Request, res: Response) {
    const data = await prisma.entry.findMany({
      select: {
        entry_id: true,
        title: true,
        user: {
          select: {
            avatar: true,
            pseudo: true,
          },
        },
        _count: {
          select: {
            entryVoters: true,
          },
        },
      },
      orderBy: {
        entryVoters: {
          _count: "desc",
        },
      },
      take: 3,
    })
    return res.status(200).json({ data })
  }

  async findAllEntries(req: JwtRequest, res: Response) {
    const userId = getAuthenticatedUser(req) || null
    const { challengeId } = req.params
    if (!userId) {
      const entries = await prisma.challenge.findUnique({
        where: { challenge_id: Number(challengeId) },
        select: {
          entries: {
            select: {
              entry_id: true,
              title: true,
              video_url: true,
              user: {
                select: {
                  pseudo: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
      })
      if (!entries) {
        return res.status(404).json({ message: "Challenge not found" })
      }
      return res.status(200).json({ entries: entries.entries })
    } else {
      const [memberEntries, entries] = await Promise.all([
        prisma.entry.findMany({
          where: {
            AND: [{ challenge_id: Number(challengeId) }, { user_id: userId }],
          },
          include: { user: true },
          orderBy: {
            created_at: "desc",
          },
        }),
        prisma.entry.findMany({
          where: {
            AND: [
              { challenge_id: Number(challengeId) },
              { user_id: { not: userId } },
            ],
          },
          include: { user: true },
          orderBy: {
            created_at: "desc",
          },
        }),
      ])
      return res.status(200).json({ memberEntries, entries })
    }
  }
}
