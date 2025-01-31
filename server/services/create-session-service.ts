import SessionModel from "../models/session-model";

import { ErrorHandler } from "../middlewares/error-handler";

import { GetLocationFromIp } from "../utils/get-location-from-ip";
import { UpdateSessionDuration } from "../utils/update-session-duration";

export const CreateSessionService = async (
  sessionId: string,
  sessionType: string,
  secureSecurityCode: string,
  sessionIp: string
) => {
  try {
    const session = await SessionModel.findOne({ sessionId });

    if (session) {
      throw new ErrorHandler("Session already exists", 400);
    }

    const location = await GetLocationFromIp(sessionIp);

    const newSession = new SessionModel({
      sessionId,
      sessionType,
      sessionIp,
      secureSecurityCode: sessionType === "SECURE" ? secureSecurityCode : undefined,
      sessionDuration: 0,
      isActive: true,
      sessionLocation: {
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        city: location.city,
      },
    });

    await newSession.save();

    UpdateSessionDuration(newSession.sessionId);

    return newSession;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
