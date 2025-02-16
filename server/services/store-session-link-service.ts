import { RedisDatabase } from "../databases/redis-database.js";

import Logger from "../utils/logger.js";

export const StoreSessionLinkService = async (
  sessionId: string,
  sessionData: any,
  ttl: number = 300
): Promise<void> => {
  try {
    await RedisDatabase?.setex(sessionId, ttl, JSON.stringify(sessionData));
    Logger.info(`Session stored in Redis with sessionId: ${sessionId}`);
  } catch (error) {
    Logger.error("Error storing session in Redis:", error);
  }
};
