import { Router } from "express"
import authRoutes from "./routes/auth.routes.js"
import challengeRoutes from "./routes/challenge.route.js"
import userRoutes from "./routes/user.routes.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import path from "node:path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const router = Router()

//Routes
router.use("/auth", authRoutes)
router.use("/challenges", challengeRoutes)
router.use("/entries", userRoutes)

//Default 404

const spec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gamer-Challenges",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Challenge: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID unique du défi",
            },
            title: {
              type: "string",
              description: "Titre du défi",
            },
            rules: {
              type: "string",
              desciption: "Regles du défi",
            },
            description: {
              type: "string",
              description: "Description du défi",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création",
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "./routes/*.routes.js")],
})
console.log(__dirname)
router.use("/docs", swaggerUi.serve, swaggerUi.setup(spec))
router.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})
