import { prisma } from "./index.js";
import argon2 from "argon2";

const hashedPassword = await argon2.hash("test");

await prisma.user.createMany({
    data: [
        {
            pseudo: "Romain",
            email: "romain@oclock.io",
            password: hashedPassword,
            avatar: "https://sm.ign.com/t/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.600.jpg",
            role: "admin",
        },
        {
            pseudo: "Joe",
            email: "joe@oclock.io",
            password: hashedPassword,
            avatar: "https://sm.ign.com/t/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.600.jpg",
            role: "member",
        },
    ],
});

console.log(`📊 Seeding succeeded.`);
