import { GetSessionSerivce } from "./get-session-service";

import { ErrorHandler } from "../middlewares/error-handler";

export const ValidateSessionService = async (sessionId: string) => {
  try {
    const session = await GetSessionSerivce(sessionId);
    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }
    return session;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};

export const ValidateSecurityCodeService = (
  sessionType: string,
  providedCode: string,
  storedCode: string
) => {
  if (sessionType === "SECURE" && providedCode !== storedCode) {
    throw new ErrorHandler("Invalid security code", 400);
  }
};
