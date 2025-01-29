import "dotenv-flow/config";

import { app } from "./app";

import {
  ConnectMongooseDatabase,
  DisconnectMongooseDatabase,
} from "./databases/mongoose-database";
import { ConnectRedis, DisconnectRedis } from "./databases/redis-database";

import { HandleUncaughtException } from "./middlewares/uncaught-exception-handler";
import { HandleUnhandledRejection } from "./middlewares/unhandled-rejection-handler";

import logger from "./utils/logger";

HandleUncaughtException();

const StartServer = async (): Promise<void> => {
  try {
    const server = app.listen(process.env.PORT, async () => {
      logger.info(`Server is running on port: ${process.env.PORT}`);

      await ConnectMongooseDatabase();
      await ConnectRedis();
    });

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
