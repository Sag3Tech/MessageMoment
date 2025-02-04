import Logger from "../utils/logger";

export const HandleException = (): void => {
  process.on("uncaughtException", (err: Error) => {
    Logger.error(`Uncaught Exception: ${err.message}`);
    Logger.error("The server will shut down due to an uncaught exception.");
    process.exit(1);
  });
};
