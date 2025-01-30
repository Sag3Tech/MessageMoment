import "dotenv-flow/config";

import mongoose from "mongoose";

import { RetryHandler } from "../middlewares/retry-handler";

import logger from "../utils/logger";

// MONGOOSE DATABASE CONNECTION
const MongooseDatabaseOperation = async (): Promise<void> => {
  const connection = await mongoose.connect(
    process.env.MONGOOSE_DATABASE_URL || ""
  );

  logger.info(
    `Mongoose database is running on url: ${connection.connection.host}`
  );
  global.mongooseConnection = connection.connection;
};

// CONNECT TO MONGOOSE DATABASE WITH RETRY MECHANISM
const ConnectMongooseDatabase = async (): Promise<void> => {
  try {
    await RetryHandler(MongooseDatabaseOperation, {
      maxRetries: parseInt(process.env.MAX_RETRIES || "5", 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || "5000", 10),
    });
  } catch (error) {
    logger.error(
      `Failed to connect to mongoose database: ${(error as Error).message}`
    );
  }
};

// DISCONNECT MONGOOSE DATABASE
const DisconnectMongooseDatabase = async (): Promise<void> => {
  if (global.mongooseConnection) {
    try {
      await global.mongooseConnection.close();
      logger.info("Mongoose database connection closed successfully.");
    } catch (error) {
      logger.error(
        `Error closing mongoose database connection: ${
          (error as Error).message
        }`
      );
    }
  } else {
    logger.warn("No mongoose database connection found to close.");
  }
};

export { ConnectMongooseDatabase, DisconnectMongooseDatabase };
