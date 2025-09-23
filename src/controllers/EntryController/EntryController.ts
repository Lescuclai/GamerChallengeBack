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
}
