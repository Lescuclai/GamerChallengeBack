import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

// Register (Pas clair les noms de route, à revoir)
router.post("/users", (req, res) => authController.register(req, res));

export default router;
