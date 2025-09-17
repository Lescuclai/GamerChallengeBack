import { prisma } from "./index.js";
import argon2 from "argon2";

const hashedPassword = await argon2.hash("test");

await prisma.user.createMany({
    data: [
        {
            pseudo: "Romain",
            email: "romain@oclock.io",
            password: hashedPassword,
            role: "admin",
        },
        {
            pseudo: "Joe",
            email: "joe@oclock.io",
            password: hashedPassword,
            role: "member",
        },
    ],
});

console.log(`📊 Seeding succeeded.`);
