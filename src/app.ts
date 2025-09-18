import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "../config.js";
import { router } from "./router.js";

export const app = express();

app.use(cors({ origin: config.server.allowedOrigins }));
app.use(cookieParser());
app.disable("x-powered-by");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);
