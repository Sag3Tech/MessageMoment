import logger from "../utils/logger";

export const HandleUncaughtException = (): void => {
  process.on("uncaughtException", (err: Error) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    logger.error("The server will shut down due to an uncaught exception.");
    process.exit(1);
  });
};
