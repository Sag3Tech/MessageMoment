import { NextFunction, Request, Response } from "express";

import { SessionTypeEnum } from "../enums/session-type-enum";

import { CatchAsyncErrors } from "../utils/catch-async-errors";
import { ErrorHandler } from "../utils/error-handler";
import { SessionIdGenerator } from "../utils/session-id-generator";
import { SecurityCodeGenerator } from "../utils/security-code-generator";

import { StoreSessionLinkService } from "../services/store-session-link-service";
import { getIPDetails } from "../utils/get-ip-service";

export const GenerateSessionLinkFunction = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionType } = req.body;

      // Validate session type
      if (!Object.values(SessionTypeEnum).includes(sessionType)) {
        return next(new ErrorHandler("Invalid session type", 400));
      }

      // Generate session identifiers
      const sessionId = SessionIdGenerator();
      const secureSecurityCode =
        sessionType === SessionTypeEnum.SECURE
          ? SecurityCodeGenerator()
          : undefined;

      // Get and validate client IP
      const rawIp = req.ip;
      if (!rawIp) {
        return next(new ErrorHandler("Client IP address not found", 400));
      }

      // Get geolocation data
      const ipDetails = await getIPDetails(rawIp);
      const [latitude, longitude] = ipDetails.loc?.split(",") || [null, null];

      // Prepare session data
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

      // Store session data
      await StoreSessionLinkService(sessionId, sessionData);

      // Return response
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
