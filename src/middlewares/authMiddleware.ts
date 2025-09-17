import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction, RequestHandler } from "express";

dotenv.config();

interface JwtPayload {
    id: number;
}

interface JwtRequest extends Request {
    user?: JwtPayload;
}

export const verifyToken = (
    req: JwtRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token missing or invalid" });
    }

    const token = authHeader.substring(7);

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT SECRET KEY is not defined in .env");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token invalid or expired" });
    }
};
