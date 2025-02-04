import { Server } from "http";

import Logger from "../utils/logger";

export const HandleRejection = (server: Server): void => {
  process.on("unhandledRejection", (reason: any) => {
    Logger.error(`Unhandled Rejection: ${(reason as Error).message}`);
    Logger.error(
      "The server will shut down due to an unhandled promise rejection."
    );

    server.close(() => {
      process.exit(1);
    });
  });
};
