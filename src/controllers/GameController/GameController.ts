import { Game } from "@prisma/client"
import { Request, Response } from "express"
import { prisma } from "../../../prisma/index.js"
import BaseController from "../BaseController.js"

export default class GameController extends BaseController<Game, "game_id"> {
  constructor() {
    super(prisma.game, "game_id")
  }

  async getAllGames(req: Request, res: Response) {
    try {
      const games = await prisma.game.findMany({
        where: {
          deleted_at: null, // Exclude soft-deleted games
        },
        select: {
          game_id: true,
          title: true,
          image_url: true,
        },
        orderBy: {
          title: "asc",
        },
      })

      return res.status(200).json({ data: games })
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error)
      return res.status(500).json({ message: "Erreur serveur" })
    }
  }
}
