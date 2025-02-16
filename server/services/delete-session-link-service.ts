import { RedisDatabase } from "../databases/redis-database.js";

import Logger from "../utils/logger.js";

export const DeleteSessionLinkService = async (
  sessionId: string
): Promise<void> => {
  try {
    await RedisDatabase?.del(sessionId);
    Logger.info(`Session deleted from Redis with sessionId: ${sessionId}`);
  } catch (error) {
    Logger.error("Error deleting session in Redis:", error);
  }
};
