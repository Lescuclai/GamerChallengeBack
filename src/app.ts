import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { helmetMiddlewre } from "./middlewares/helmetMiddleware.js";
import { xssSanitizer } from "./middlewares/xssSanitizerMiddleware.js";
import { config } from "../config.js";
import { router } from "./router.js";

export const app = express();

app.use(cors({ origin: config.server.allowedOrigins, credentials: true }));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(xssSanitizer);
app.use(helmetMiddlewre);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);
