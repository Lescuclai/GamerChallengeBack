import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/index.js";
import { config } from "../../config.js";

type UserType = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;

export function generateAuthenticationTokens(user: UserType) {
    const payload = {
        userId: user.user_id,
        role: user.role,
    };

    const JWT_SECRET = config.server.jwtSecret;
    if (!JWT_SECRET) {
        throw new Error("JWT SECRET KEY is not defined in .env");
    }

    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
    });

    return {
        token: accessToken,
        type: "Bearer",
        expiresInMS: 1 * 60 * 60 * 1000, // 1h
    };
}
