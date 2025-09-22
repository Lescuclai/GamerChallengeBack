import { Entry } from "@prisma/client"
import BaseController from "../BaseController.js"
import { prisma } from "../../../prisma/index.js"
import { Request, Response } from "express"

export default class EntryController extends BaseController<Entry, "entry_id"> {
  constructor() {
    super(prisma.entry, "entry_id")
  }
  async mostLikedEntries(req: Request, res: Response) {
    try {
      const data = await prisma.entry.findMany({
        select: {
          entry_id: true,
          user: {
            select: {
              avatar: true,
              pseudo: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          votes: {
            _count: "desc",
          },
        },
        take: 3,
      })
      return res.status(200).json({ data })
    } catch (e) {
      return res.status(500).json({
        message: "Erreur recuperation des challenges les plus liké",
        e,
      })
    }
  }
}
