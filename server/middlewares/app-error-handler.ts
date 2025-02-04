import { Request, Response, NextFunction } from "express";

import { CustomError } from "../interfaces/middlewares-interfaces";

import { CastError } from "./errors/cast-error";
import { DuplicateKeyError } from "./errors/duplicate-key-error";
import { ValidationError } from "./errors/validation-error";
import { NotFoundError } from "./errors/not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { InternalServerError } from "./errors/internal-server-error";
import { BadRequestError } from "./errors/bad-request-error";
import { DefaultError } from "./errors/default-error";

import { ErrorHandler } from "../utils/error-handler";

export const AppErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "An internal server error has occurred.";

  console.error(err);

  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else if (err.name === "CastError") {
    CastError(err, req, res, next);
  } else if (err.code === 11000) {
    DuplicateKeyError(err, req, res, next);
  } else if (err.name === "ValidationError") {
    ValidationError(err, req, res, next);
  } else if (err.name === "NotFoundError") {
    NotFoundError(err, req, res, next);
  } else if (err.name === "UnauthorizedError") {
    UnauthorizedError(err, req, res, next);
  } else if (err.name === "InternalServerError") {
    InternalServerError(err, req, res, next);
  } else if (err.name === "BadRequestError") {
    BadRequestError(err, req, res, next);
  } else {
    DefaultError(err, req, res, next);
  }
};
