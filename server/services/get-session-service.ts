import SessionModel from "../models/session-model";

import { ErrorHandler } from "../middlewares/error-handler";

export const GetSessionSerivce = async (sessionId: string) => {
  try {
    const session = await SessionModel.findOne({ sessionId });
    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }
    return session;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
