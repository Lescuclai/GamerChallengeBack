import { Router } from "express";
import { controllerWrapper as cw } from "../utils/controllerWrapper.js";
import AuthController from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

router.post(
    "/register",
    cw((req, res) => authController.register(req, res))
);

router.post(
    "/login",
    cw((req, res) => authController.login(req, res))
);

router.post(
    "/logout",
    cw((req, res) => authController.logout(req, res))
);

export default router;
