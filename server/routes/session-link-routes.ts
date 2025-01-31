import express from "express";

import { GenerateSessionLinkFunction } from "../controllers/session-controllers";

const SessionRouter = express.Router();

// API PATHS
SessionRouter.post("/generate-session-link", GenerateSessionLinkFunction);

export default SessionRouter;
