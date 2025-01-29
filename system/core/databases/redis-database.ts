import Redis from "ioredis";
import "dotenv-flow/config";

import { RetryHandler } from "../middlewares/retry-handler";

import logger from "../utils/logger";

let RedisDatabase: Redis | null = null;

/**
 * Redis Connection Handler
 */
const RedisOperation = async (): Promise<void> => {
  if (!RedisDatabase) {
    RedisDatabase = new Redis(process.env.REDIS_URL || "");
  }

  await RedisDatabase.ping();
  logger.info("Redis connected!");
};

/**
 * Connect to Redis with Retry Mechanism
 */
const ConnectRedis = async (): Promise<void> => {
  try {
    await RetryHandler(RedisOperation, {
      maxRetries: parseInt(process.env.MAX_RETRIES || "5", 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || "5000", 10),
    });

    RedisDatabase?.on("connect", () => {
      logger.info("Redis connection established successfully.");
    });

    RedisDatabase?.on("error", (err) => {
      logger.error(`Redis connection error: ${err.message}`);
    });
  } catch (error) {
    logger.error(`Failed to connect to Redis: ${(error as Error).message}`);
  }
};

/**
 * Disconnect Redis Database
 */
const DisconnectRedis = async (): Promise<void> => {
  if (RedisDatabase) {
    try {
      await RedisDatabase.quit();
      logger.info("Redis connection closed successfully.");
    } catch (error) {
      logger.error(
        `Error during Redis disconnection: ${(error as Error).message}`
      );
    }
  } else {
    logger.warn("No Redis connection found to close.");
  }
};

export { ConnectRedis, DisconnectRedis, RedisDatabase };
