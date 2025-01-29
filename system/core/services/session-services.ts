import { RedisDatabase } from "../databases/redis-database";

import logger from "../utils/logger";

// STORE SESSION LINK DATA IN REDIS
export const StoreSessionLinkData = async (
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

// RETRIEVE SESSION LINK DATA FROM REDIS
export const GetSessionLinkData = async (sessionId: string): Promise<any> => {
  try {
    const sessionData = await RedisDatabase?.get(sessionId);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    logger.error("Error retrieving session from Redis:", error);
    return null;
  }
};

// DELETE SESSION LINK DATA FROM REDIS
export const DeleteSessionLinkData = async (
  sessionId: string
): Promise<void> => {
  try {
    await RedisDatabase?.del(sessionId);
    logger.info(`Session deleted from Redis with sessionId: ${sessionId}`);
  } catch (error) {
    logger.error("Error deleting session from Redis:", error);
  }
};
