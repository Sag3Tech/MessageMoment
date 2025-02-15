import "dotenv-flow/config";

import Redis from "ioredis";

import { RetryHandler } from "../middlewares/retry-handler";

import Logger from "../utils/logger.js";

let RedisDatabase: Redis | null = null;

// REDIS CONNETION HANDLER
const RedisOperation = async (): Promise<void> => {
  if (!RedisDatabase) {
    RedisDatabase = new Redis(process.env.REDIS_URL || "");
  }

  await RedisDatabase.ping();
};

// CONNECT TO REDIS WITH RETRY MECHANISM
const ConnectRedis = async (): Promise<void> => {
  try {
    await RetryHandler(RedisOperation, {
      maxRetries: parseInt(process.env.MAX_RETRIES || "5", 10),
      retryDelay: parseInt(process.env.RETRY_DELAY || "5000", 10),
    });

    RedisDatabase?.on("connect", () => {
      console.info("Redis connection established successfully.");
    });

    RedisDatabase?.on("error", (err) => {
      Logger.error(`Redis connection error: ${err.message}`);
    });
  } catch (error) {
    Logger.error(`Failed to connect to Redis: ${(error as Error).message}`);
  }
};

// DISCONNECT REDIS DATABASE
const DisconnectRedis = async (): Promise<void> => {
  if (RedisDatabase) {
    try {
      await RedisDatabase.quit();
      console.info("Redis connection closed successfully.");
    } catch (error) {
      Logger.error(
        `Error during Redis disconnection: ${(error as Error).message}`
      );
    }
  } else {
    Logger.warn("No Redis connection found to close.");
  }
};

// SUBSCRIBE TO REDIS CHANNELS
const SubscribeToRedisChannel = (channel: string, callback: Function) => {
  if (RedisDatabase) {
    RedisDatabase.subscribe(channel, (err, count) => {
      if (err) {
        Logger.error(`Failed to subscribe to channel: ${channel}`);
      } else {
        console.info(
          `Subscribed to ${channel} channel. Currently subscribed to ${count} channels.`
        );
      }
    });

    // Handle message on the subscribed channel
    RedisDatabase.on("message", (channel, message) => {
      console.info(`Message received from ${channel}: ${message}`);
      callback(message);
    });
  }
};

// PUBLISH A MESSAGE TO REDIS CHANNEL
const PublishToRedisChannel = (channel: string, message: string): void => {
  if (RedisDatabase) {
    RedisDatabase.publish(channel, message);
    console.info(`Message sent to ${channel}: ${message}`);
  } else {
    Logger.error("Redis connection is not established!");
  }
};

export {
  ConnectRedis,
  DisconnectRedis,
  RedisDatabase,
  SubscribeToRedisChannel,
  PublishToRedisChannel,
};
