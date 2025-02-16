import { NextFunction, Request, Response } from "express";

import { SessionTypeEnum } from "../enums/session-type-enum.js";

import { StoreSessionLinkService } from "../services/store-session-link-service.js";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { SessionIdGenerator } from "../utils/session-id-generator.js";
import { SecurityCodeGenerator } from "../utils/security-code-generator.js";

// GENERATE SESSION LINK FUNCTION
export const GenerateSessionLinkFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionType } = req.body;
      if (!Object.values(SessionTypeEnum).includes(sessionType)) {
        return next(new ErrorHandler("Invalid session type", 400));
      }

      const sessionId = SessionIdGenerator();
      
      const secureSecurityCode =
        sessionType === SessionTypeEnum.SECURE
          ? SecurityCodeGenerator()
          : undefined;

      const sessionIp =
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "Unknown";

      const sessionData = {
        sessionId,
        sessionType,
        secureSecurityCode,
        sessionIp,
      };

      await StoreSessionLinkService(sessionId, sessionData);
      return res.status(201).json({
        success: true,
        message: "Session link generated successfully",
        data: {
          sessionId,
          sessionType,
          secureSecurityCode,
          sessionIp,
        },
      });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);
