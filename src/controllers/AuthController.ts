import BaseController from "./BaseController.js";
import type { Request, Response } from "express";
import { prisma } from "../../prisma/index.js";
import { User } from "@prisma/client";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateAuthenticationTokens } from "../utils/tokens.js";
import { JwtRequest } from "../middlewares/authMiddleware.js";
import { config } from "../../config.js";
import argon2 from "argon2";

interface Token {
    token: string;
    type: string;
    expiresInMS: number;
}

export default class AuthController extends BaseController<User, "user_id"> {
    constructor() {
        super(prisma.user, "user_id");
    }

    async login(req: Request, res: Response) {
        const { email, password } = await loginSchema.parseAsync(req.body);

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: "Email et mot de passe ne correspondent pas",
            });
        }

        const isMatching = await argon2.verify(user.password, password);
        if (!isMatching) {
            return res.status(401).json({
                message: "Email et mot de passe ne correspondent pas",
            });
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
            return res
                .status(400)
                .json({ message: "Les mots de passe ne correspondent pas" });
        }

        // Verify user doesn't already exists (see if necessary to add findFirst in BaseController)
        const alreadyExistingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (alreadyExistingUser) {
            return res.status(409).json({ message: "Email déjà utilisé" });
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

    async me(req: JwtRequest, res: Response) {
        const user = await this.findById(Number(req.user!.id));

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.status(200).json({
            user: {
                id: user.user_id,
                pseudo: user.pseudo,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
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
