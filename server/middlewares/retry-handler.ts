import { RetryOptions } from "../interfaces/middlewares-interfaces.js";

import Logger from "../utils/logger.js";

export const RetryHandler = async (
  operation: () => Promise<void>,
  options: RetryOptions
): Promise<void> => {
  const { maxRetries, retryDelay } = options;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      await operation();
      return;
    } catch (error) {
      attempt++;
      if (attempt > maxRetries) {
        throw new Error(
          `Operation failed after ${maxRetries} retries: ${
            (error as Error).message
          }`
        );
      }
      Logger.warn(
        `Retrying operation in ${
          retryDelay / 1000
        }s (${attempt}/${maxRetries})...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};
