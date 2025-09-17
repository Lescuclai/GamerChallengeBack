import BaseController from "./BaseController.js";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/index.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import argon2 from "argon2";

export default class AuthController extends BaseController<any> {
    constructor() {
        super(prisma.user);
    }

    async register(req: Request, res: Response) {
        try {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
}
