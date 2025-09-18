import BaseController from "./BaseController.js";
import type { Request, Response } from "express";
import { prisma } from "../../prisma/index.js";
import { User } from "@prisma/client";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateAuthenticationTokens } from "../utils/tokens.js";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
} from "../utils/errors.js";
import { config } from "../../config.js";
import argon2 from "argon2";

interface Token {
    token: string;
    type: string;
    expiresInMS: number;
}

export default class AuthController extends BaseController<User> {
    constructor() {
        super(prisma.user);
    }

    async login(req: Request, res: Response) {
        const { email, password } = await loginSchema.parseAsync(req.body);

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            throw new UnauthorizedError("Email and password do not match");
        }

        const isMatching = await argon2.verify(user.password, password);
        if (!isMatching) {
            throw new UnauthorizedError("Email and password do not match");
        }

        // Token (A voir si on met en place les refresh token)

        const accessToken = generateAuthenticationTokens(user);
        setAccessTokenCookie(res, accessToken);

        return res.json({
            message: "Connecté avec succès",
            pseudo: user.pseudo,
            avatar: user.avatar,
        });
    }

    async register(req: Request, res: Response) {
        const { pseudo, email, password, avatar, confirm } =
            await registerSchema.parseAsync(req.body);

        if (password !== confirm) {
            throw new BadRequestError("Passwords do not match");
        }

        // Verify user doesn't already exists (see if necessary to add findFirst in BaseController)
        const alreadyExistingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (alreadyExistingUser) {
            throw new ConflictError("Email already taken");
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.create({
            pseudo,
            email,
            password: hashedPassword,
            avatar,
        });

        // Send access token to connect after register (delay ?)

        const accessToken = generateAuthenticationTokens(user);
        setAccessTokenCookie(res, accessToken);

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            id: user.user_id,
            pseudo: user.pseudo,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        });
    }

    async logout(_: Request, res: Response) {
        res.cookie("accessToken", "", {
            httpOnly: true,
            secure: config.server.secure,
            maxAge: 0,
        });
        res.sendStatus(204);
    }
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
    // Maybe add sameSite: "strict"
    res.cookie("accessToken", accessToken.token, {
        httpOnly: true,
        maxAge: accessToken.expiresInMS,
        secure: config.server.secure,
    });
}
