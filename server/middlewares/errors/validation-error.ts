import { Request, Response, NextFunction } from "express";

import { ErrorHandler } from "../../utils/error-handler";

export const ValidationError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ErrorHandler(`Validation Error: ${err.message}`, 401);

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
