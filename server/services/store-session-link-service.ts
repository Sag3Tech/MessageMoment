import { RedisDatabase } from "../databases/redis-database";

import logger from "../utils/logger";

export const StoreSessionLinkService = async (
  sessionId: string,
  sessionData: any,
  ttl: number = 1800
): Promise<void> => {
  try {
    await RedisDatabase?.setex(sessionId, ttl, JSON.stringify(sessionData));
    logger.info(`Session stored in Redis with sessionId: ${sessionId}`);
  } catch (error) {
    logger.error("Error storing session in Redis:", error);
  }
};
