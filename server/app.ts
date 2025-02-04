import "dotenv-flow/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";

import { AppErrorHandler } from "./middlewares/app-error-handler";

import BasicRouter from "./routes/basic-routes";
import SessionRouter from "./routes/session-link-routes";

export const app = express();

// SERVER CONFIGURATIONS
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// API ROUTES
app.use("/api/v1", SessionRouter);

// BASIC ROUTES
app.use("", BasicRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  AppErrorHandler(err, req, res, next);
});
