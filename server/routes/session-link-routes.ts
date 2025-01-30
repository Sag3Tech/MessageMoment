import express from "express";

import { GenerateSessionLinkFunction } from "../controllers/session-link-controllers";

const SessionLinkRouter = express.Router();

// API PATHS
SessionLinkRouter.post("/generate-session-link", GenerateSessionLinkFunction);

export default SessionLinkRouter; 
