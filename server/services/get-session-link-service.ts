import { RedisDatabase } from "../databases/redis-database";

import logger from "../utils/logger";

export const GetSessionLinkService = async (sessionId: string): Promise<any> => {
  try {
    const sessionData = await RedisDatabase?.get(sessionId);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    logger.error("Error retrieving session from Redis:", error);
    return null;
  }
};
