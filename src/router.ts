import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";

export const router = Router();

//Routes
router.use("/", authRoutes);

//Default 404
router.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});
