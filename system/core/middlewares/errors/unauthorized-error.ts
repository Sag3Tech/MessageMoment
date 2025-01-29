import { Request, Response, NextFunction } from "express";

import { ErrorHandler } from "../error-handler";

export const UnauthorizedError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ErrorHandler(`Unauthorized Access: ${err.message}`, 401);

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
