import { Entry } from "@prisma/client"
import { Request, Response } from "express"
import { prisma } from "../../../prisma/index.js"
import { JwtRequest } from "../../middlewares/authMiddleware.js"
import { entrySchema } from "../../schemas/entry.schema.js"
import BaseController from "../BaseController.js"
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
    const userId = req.user?.id
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

  async updateEntry(req: JwtRequest, res: Response) {
    if (req.user) {
      const { entryId } = req.params
      const { id: userId } = req.user
      const entryToUpdate = await prisma.entry.findUnique({
        where: {
          entry_id: Number(entryId),
          user_id: userId,
        },
      })
      if (!entryToUpdate) {
        return res
          .status(403)
          .json({ message: "Non autorisé à modifier cette participation" })
      }
      const validateEntry = entrySchema.safeParse(req.body)
      if (!validateEntry.success) {
        return res.status(400).json({
          message: "Données invalides",
          errors: validateEntry.error,
        })
      }
      const { title, video_url, challenge_id, user_id } = validateEntry.data
      const response = await this.update(Number(entryId), {
        title,
        video_url,
        challenge_id,
        user_id,
      })
      return res.json({ response })
    }
  }
  async deleteEntry(req: JwtRequest, res: Response) {
    if (req.user) {
      const { entryId } = req.params
      const { id } = req.user
      const entryToDelete = await prisma.entry.findUnique({
        where: {
          entry_id: Number(entryId),
          user_id: id,
        },
      })
      if (!entryToDelete) {
        return res
          .status(403)
          .json({ message: "Non autorisé à supprimer cette participation" })
      }
      await this.delete(entryToDelete.entry_id)
      res.status(200).json({ message: entryToDelete })
    }
  }
}
