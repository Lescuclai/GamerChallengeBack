import request from "supertest"
import app from "../../app"
import { PrismaClient } from "@prisma/client-test"
import argon2 from "argon2"

const prisma = new PrismaClient()

describe("AuthController Integration", () => {
  beforeAll(async () => {
    // Nettoie la base avant les tests
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const userData = {
    pseudo: "romain_test",
    email: "romain_test@example.com",
    password: "Password123!",
    confirm: "Password123!",
    avatar: "",
  }

  describe("POST /api/auth/register", () => {
    it("devrait créer un nouvel utilisateur et retourner un token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201)

      expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès")
      expect(res.body).toHaveProperty("accessToken")
      expect(res.body.user).toMatchObject({
        pseudo: userData.pseudo,
        email: userData.email,
      })

      const dbUser = await prisma.user.findFirst({ where: { email: userData.email } })
      expect(dbUser).not.toBeNull()
      expect(await argon2.verify(dbUser!.password, userData.password)).toBe(true)
    })

    it("devrait refuser un email déjà utilisé", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(409)

      expect(res.body.errors.email).toBe("Email déjà utilisé")
    })
  })

  describe("POST /api/auth/login", () => {
    it("devrait se connecter avec succès et retourner un accessToken", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)

      expect(res.body).toHaveProperty("message", "Connecté avec succès")
      expect(res.body).toHaveProperty("accessToken")
      expect(res.body.user.email).toBe(userData.email)
    })

    it("devrait refuser un mot de passe incorrect", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(401)

      expect(res.body.message).toBe("Email et mot de passe ne correspondent pas")
    })
  })

  describe("GET /api/auth/me", () => {
    it("devrait retourner les infos utilisateur avec un token valide", async () => {
      const login = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })

      const token = login.body.accessToken.token
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`accessToken=${token}`])
        .expect(200)

      expect(res.body.user.email).toBe(userData.email)
      expect(res.body.user.pseudo).toBe(userData.pseudo)
    })
  })
})
