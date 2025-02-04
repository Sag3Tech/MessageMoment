import "dotenv-flow/config";

import { createServer } from "http";

import { app } from "./app";
import { InitializeSocket } from "./socket";

import { ConnectMongooseDatabase } from "./databases/mongoose-database";
import { ConnectRedis } from "./databases/redis-database";

import { HandleException } from "./middlewares/exception-handler";
import { HandleRejection } from "./middlewares/rejection-handler";
import { GracefullyShutdown } from "./middlewares/gracefully-shutdown";

import Logger from "./utils/logger";

HandleException();

const server = createServer(app);
InitializeSocket(server);

const StartServer = async (): Promise<void> => {
  try {
    server.listen(process.env.PORT, () => {
      console.info(`Server is running on port: ${process.env.PORT}`);
    });

    await ConnectMongooseDatabase();
    await ConnectRedis();

    HandleRejection(server);
    GracefullyShutdown(server);
  } catch (error) {
    Logger.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

StartServer();
