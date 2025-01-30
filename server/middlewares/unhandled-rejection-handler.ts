import { Server } from "http";

import logger from "../utils/logger";

export const HandleUnhandledRejection = (server: Server): void => {
  process.on("unhandledRejection", (reason: any) => {
    logger.error(`Unhandled Rejection: ${(reason as Error).message}`);
    logger.error(
      "The server will shut down due to an unhandled promise rejection."
    );

    server.close(() => {
      process.exit(1);
    });
  });
};
