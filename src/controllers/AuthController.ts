import BaseController from "./BaseController.js";
import { prisma } from "../../prisma/index.js";
import argon2 from "argon2";

export class AuthController extends BaseController<any> {
    constructor() {
        super(prisma.user);
    }

    async login(email: string, password: string) {
        const hashedPassword = await argon2.hash(password);
    }
}
