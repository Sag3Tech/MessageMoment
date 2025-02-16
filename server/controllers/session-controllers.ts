import { NextFunction, Request, Response } from "express";

import { SessionTypeEnum } from "../enums/session-type-enum.js";

import { StoreSessionLinkService } from "../services/store-session-link-service.js";

import { CatchAsyncErrors } from "../utils/catch-async-errors.js";
import { ErrorHandler } from "../utils/error-handler.js";
import { SessionIdGenerator } from "../utils/session-id-generator.js";
import { SecurityCodeGenerator } from "../utils/security-code-generator.js";
import { GetGeoInformation } from "../utils/geo-information.js";

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

      const rawIp = req.ip;
      if (!rawIp) {
        return next(new ErrorHandler("Client IP address not found", 400));
      }
      const ipDetails = await GetGeoInformation(rawIp);
      const [latitude, longitude] = ipDetails.loc?.split(",") || [null, null];

      const sessionData = {
        sessionId,
        sessionType,
        secureSecurityCode,
        sessionIp: rawIp,
        city: ipDetails.city || null,
        region: ipDetails.region || null,
        country: ipDetails.country || null,
        latitude,
        longitude,
      };

      await StoreSessionLinkService(sessionId, sessionData);
      return res.status(201).json({
        success: true,
        message: "Session link generated successfully",
        data: {
          sessionIp: rawIp,
          sessionId,
          sessionType,
          secureSecurityCode,
        },
      });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      return next(new ErrorHandler(message, error.response?.status || 500));
    }
  }
);
