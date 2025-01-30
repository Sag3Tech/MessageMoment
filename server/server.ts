import "dotenv-flow/config";

import http from "http";

import { app } from "./app";
import { SetupSocketServer } from "./socket";

import {
  ConnectMongooseDatabase,
  DisconnectMongooseDatabase,
} from "./databases/mongoose-database";
import { ConnectRedis, DisconnectRedis } from "./databases/redis-database";

import { HandleUncaughtException } from "./middlewares/uncaught-exception-handler";
import { HandleUnhandledRejection } from "./middlewares/unhandled-rejection-handler";

import logger from "./utils/logger";

HandleUncaughtException();

const server = http.createServer(app);

const StartServer = async (): Promise<void> => {
  try {
    server.listen(process.env.PORT, () => {
      logger.info(`Server is running on port: ${process.env.PORT}`);
    });

    await ConnectMongooseDatabase();
    await ConnectRedis();

    SetupSocketServer(server);
    logger.info("Socket.io server is running");

    HandleUnhandledRejection(server);

    process.on("SIGINT", async () => {
      logger.info("Shutting down gracefully...");
      await DisconnectMongooseDatabase();
      await DisconnectRedis();
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

StartServer();
