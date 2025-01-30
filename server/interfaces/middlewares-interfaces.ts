export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
}

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
}
