import express from "express";

import {
  UnknownRouteFunction,
  WelcomeRouteFunction,
} from "../controllers/basic-controllers";

const BasicRouter = express.Router();

// API PATHS
BasicRouter.get("/", WelcomeRouteFunction);
BasicRouter.all("*", UnknownRouteFunction);

export default BasicRouter;
