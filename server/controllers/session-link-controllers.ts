import { NextFunction, Request, Response } from "express";

import { SessionTypeEnum } from "../enums/session-type-enum";

import { StoreSessionLinkData } from "../services/session-services";

import { CatchAsyncErrors } from "../middlewares/catch-async-errors";
import { ErrorHandler } from "../middlewares/error-handler";

import { SessionIdGenerator } from "../utils/session-id-generator";
import { SecurityCodeGenerator } from "../utils/security-code-generator";

// GENERATE SESSION LINK FUNCTION
export const GenerateSessionLinkFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionType } = req.body;

      if (!Object.values(SessionTypeEnum).includes(sessionType)) {
        return next(new ErrorHandler("Invalid session type", 400));
      }

      const sessionId = SessionIdGenerator();
      let secureSecurityCode: string | undefined;
      if (sessionType === SessionTypeEnum.SECURE) {
        secureSecurityCode = SecurityCodeGenerator();
      }

      const sessionIp = req.ip;

      const sessionData = {
        sessionId,
        sessionType,
        secureSecurityCode,
        sessionIp,
      };

      await StoreSessionLinkData(sessionId, sessionData);

      return res.status(201).json({
        success: true,
        message: "Session link generated successfully",
        data: {
          sessionId,
          sessionType,
          secureSecurityCode,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
