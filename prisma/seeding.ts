import { Role, VoteUserChallenge, VoteUserEntry } from "@prisma/client"
import { prisma } from "./index.js"
import argon2 from "argon2"
import { shuffleData } from "../src/utils/shuffleData.js"
import { logger } from "../src/lib/log.js"

interface GameResponse {
  title: string
  thumbnail: string
}

interface EntryInterface {
  title: string
  video_url: string
  user_id: number
  challenge_id: number
}

const { challenge, entry, game, user, voteUserChallenge, voteUserEntry } = prisma
const hashedPassword = await argon2.hash("test")

/* ---------------------- 🔄 Nettoyage ---------------------- */
const clearSeeding = async () => {
  await voteUserChallenge.deleteMany()
  await voteUserEntry.deleteMany()
  await entry.deleteMany()
  await challenge.deleteMany()
  await game.deleteMany()
  await user.deleteMany()
  logger.info("🧹 Base nettoyée")
}

/* ---------------------- 🎮 Jeux ---------------------- */
const SeedGames = async () => {
  try {
    // 🧪 Environnement de test ou CI : pas d'appel externe
    if (process.env.NODE_ENV === "TEST" || process.env.CI) {
      await game.createMany({
        data: [
          { title: "Test Game 1", image_url: "https://placehold.co/200x200" },
          { title: "Test Game 2", image_url: "https://placehold.co/200x200" },
          { title: "Test Game 3", image_url: "https://placehold.co/200x200" },
        ],
        skipDuplicates: true,
      })
      logger.info("✅ Jeux de test créés (mode CI)")
      return
    }

    // 🌍 Environnement normal
    const response = await fetch("https://www.freetogame.com/api/games")
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)
    const games: GameResponse[] = await response.json()

    await game.createMany({
      data: games.slice(0, 20).map(({ title, thumbnail }) => ({
        title,
        image_url: thumbnail,
      })),
      skipDuplicates: true,
    })
    logger.info("✅ 20 jeux créés avec succès")
  } catch (error) {
    logger.error("❌ Erreur dans SeedGames :", error)
    // fallback local minimal
    await game.createMany({
      data: [
        { title: "Fallback Game 1", image_url: "https://placehold.co/200x200" },
        { title: "Fallback Game 2", image_url: "https://placehold.co/200x200" },
      ],
      skipDuplicates: true,
    })
    logger.warn("⚠️ Jeux locaux créés en fallback")
  }
}

/* ---------------------- 👤 Utilisateurs ---------------------- */
const SeedUsers = async () => {
  const avatars = Array.from({ length: 10 }).map(
    (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`
  )

  const users = Array.from({ length: 10 }).map((_, i) => ({
    pseudo: `User${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: hashedPassword,
    avatar: avatars[i % avatars.length],
    role: i < 2 ? Role.admin : Role.member,
  }))

  await user.createMany({ data: users, skipDuplicates: true })
  logger.info(`✅ ${users.length} utilisateurs créés`)
}

/* ---------------------- 🏆 Challenges ---------------------- */
const SeedChallenge = async () => {
  const games = await game.findMany()
  const users = await user.findMany()

  if (!games.length || !users.length) {
    logger.warn("⚠️ Impossible de créer des challenges : jeux ou users manquants")
    return
  }

  const sampleTitles = [
    "Speedrun Madness",
    "No Damage Run",
    "Hardcore Survival",
    "Time Attack",
    "Boss Rush",
  ]
  const sampleDescriptions = [
    "Complète le jeu sans perdre une vie.",
    "Finis le niveau en moins de 5 minutes.",
    "Survis en mode hardcore.",
  ]
  const sampleRules = [
    "Pas de triche autorisée.",
    "Capture vidéo obligatoire.",
    "Difficulté minimum : Normal.",
  ]

  const challenges = Array.from({ length: 10 }).map((_, index) => {
    const randomGame = games[Math.floor(Math.random() * games.length)]
    const randomUser = users[Math.floor(Math.random() * users.length)]
    return {
      title: sampleTitles[index % sampleTitles.length],
      description: sampleDescriptions[index % sampleDescriptions.length],
      rules: sampleRules[index % sampleRules.length],
      user_id: randomUser.user_id,
      game_id: randomGame.game_id,
    }
  })

  await challenge.createMany({ data: challenges, skipDuplicates: true })
  logger.info(`✅ ${challenges.length} challenges créés`)
}

/* ---------------------- 🎥 Participations ---------------------- */
const SeedEntries = async () => {
  const challenges = await challenge.findMany()
  const users = await user.findMany()
  if (!challenges.length || !users.length) {
    logger.warn("⚠️ Pas de challenges ou d’utilisateurs pour les participations")
    return
  }

  const sampleTitles = ["First Try", "Speedrun", "No Hit", "Pro Attempt"]
  const sampleVideos = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  ]

  const entries: EntryInterface[] = []

  for (const ch of challenges) {
    const nbEntries = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < nbEntries; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      entries.push({
        title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
        video_url: sampleVideos[Math.floor(Math.random() * sampleVideos.length)],
        user_id: randomUser.user_id,
        challenge_id: ch.challenge_id,
      })
    }
  }

  await entry.createMany({ data: entries, skipDuplicates: true })
  logger.info(`✅ ${entries.length} participations créées`)
}

/* ---------------------- 🗳️ Votes ---------------------- */
const seedVoteChallenge = async () => {
  const allChallenges = await challenge.findMany()
  const allUsers = await user.findMany()
  const voteChallengeData: VoteUserChallenge[] = []

  for (const u of allUsers) {
    const nbVotes = Math.floor(Math.random() * 3)
    const shuffled = shuffleData(allChallenges, nbVotes)
    for (const ch of shuffled) {
      voteChallengeData.push({
        user_id: u.user_id,
        challenge_id: ch.challenge_id,
      })
    }
  }

  await voteUserChallenge.createMany({ data: voteChallengeData, skipDuplicates: true })
  logger.info(`✅ ${voteChallengeData.length} votes sur challenges créés`)
}

const seedVoteUserEntry = async () => {
  const allUsers = await user.findMany()
  const allEntries = await entry.findMany()
  const voteEntryData: VoteUserEntry[] = []

  for (const u of allUsers) {
    const nbVotes = Math.floor(Math.random() * 3)
    const shuffled = shuffleData(allEntries, nbVotes)
    for (const e of shuffled) {
      voteEntryData.push({
        user_id: u.user_id,
        entry_id: e.entry_id,
      })
    }
  }

  await voteUserEntry.createMany({ data: voteEntryData, skipDuplicates: true })
  logger.info(`✅ ${voteEntryData.length} votes sur participations créés`)
}

/* ---------------------- 🚀 Lancement ---------------------- */
try {
  await clearSeeding()
  await SeedUsers()
  await SeedGames()
  await SeedChallenge()
  await SeedEntries()
  await seedVoteChallenge()
  await seedVoteUserEntry()
  logger.info("📊 Seeding terminé avec succès ✅")
} catch (err) {
  logger.error("❌ Erreur globale dans le seeding :", err)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
