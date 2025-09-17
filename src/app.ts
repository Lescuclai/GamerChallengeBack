import express from "express";
import cors from "cors";
import { config } from "../config.js";
import { router } from "./router.js";

export const app = express();

app.use(cors({ origin: config.server.allowedOrigins }));
app.disable("x-powered-by");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);
