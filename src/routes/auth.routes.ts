import { Router } from "express";
import { controllerWrapper as cw } from "../utils/controllerWrapper.js";
import AuthController from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

// Register (Pas clair les noms de route, à revoir)
router.post(
    "/users",
    cw((req, res) => authController.register(req, res))
);

// Login
router.post(
    "/auth",
    cw((req, res) => authController.login(req, res))
);

export default router;
