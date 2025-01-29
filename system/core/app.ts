import express, { NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import "dotenv-flow/config";

import { AppErrorHandler } from "./middlewares/app-error-handler";

import BasicRouter from "./routes/basic-routes";
import SessionLinkRouter from "./routes/session-link-routes";

export const app = express();

// Server Configurations
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_SIDE_URL,
    credentials: true,
  })
);

// API Routes
app.use("/api/v1", SessionLinkRouter);

// Basic Routes
app.use("", BasicRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  AppErrorHandler(err, req, res, next);
});
