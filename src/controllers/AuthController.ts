import BaseController from "./BaseController.js";
import type { Request, Response } from "express";
import { prisma } from "../../prisma/index.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateAuthenticationTokens } from "../utils/tokens.js";
import { config } from "../../config.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

interface Token {
    token: string;
    type: string;
    expiresInMS: number;
}

export default class AuthController extends BaseController<any> {
    constructor() {
        super(prisma.user);
    }

    async login(req: Request, res: Response) {
        const { email, password } = await loginSchema.parseAsync(req.body);

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            throw new Error("Email and password do not match");
        }

        const isMatching = await argon2.verify(user.password, password);
        if (!isMatching) {
            throw new Error("Email and password do not match");
        }

        // Token (A voir si on met en place les refresh token)

        const accessToken = generateAuthenticationTokens(user);
        setAccessTokenCookie(res, accessToken);

        return res.json({
            message: "Connecté",
            accessToken,
        });
    }

    async register(req: Request, res: Response) {
        const { pseudo, email, password, avatar, confirm } =
            await registerSchema.parseAsync(req.body);

        if (password !== confirm) {
            throw new Error("Les mots de passes ne sont pas identiques !");
        }

        // Verify user doesn't already exists (see if necessary to add findFirst in BaseController)
        const alreadyExistingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (alreadyExistingUser) {
            throw new Error("Email already taken"); // TODO : Make specific errors
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.create({
            pseudo,
            email,
            password: hashedPassword,
            avatar,
        });

        // Connect user here and create JWT

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            id: user.id,
            pseudo: user.pseudo,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        });
    }
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
    res.cookie("accessToken", accessToken.token, {
        httpOnly: true,
        maxAge: accessToken.expiresInMS,
        secure: config.server.secure,
    });
}
