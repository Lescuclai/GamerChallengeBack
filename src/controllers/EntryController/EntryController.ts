import BaseController from "../BaseController.js"
import { prisma } from "../../../prisma/index.js"
import { Request, Response } from "express"
import { Entry } from "@prisma/client"

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

  async findAllEntries(req: Request, res: Response) {
    const { challengeId } = req.params
    const data = await prisma.challenge.findUnique({
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
    if (!data) {
      return res.status(404).json({ message: "Challenge not found" })
    }
    return res.status(200).json({ data })
  }
}
