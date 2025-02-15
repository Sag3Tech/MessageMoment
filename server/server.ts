import "dotenv/config";

import { createServer } from "http";

import { app } from "./app.js";

import { HandleException } from "./middlewares/exception-handler.js";
import { HandleRejection } from "./middlewares/rejection-handler.js";

import Logger from "./utils/logger.js";

HandleException();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

const StartServer = async (): Promise<void> => {
  try {
    server.listen(PORT, () => {
      console.info(`Server is running on port: ${PORT}`);
    });

    HandleRejection(server);
  } catch (error) {
    Logger.error(`Failed to start the server: ${(error as Error).message}`);
    process.exit(1);
  }
};

StartServer();
