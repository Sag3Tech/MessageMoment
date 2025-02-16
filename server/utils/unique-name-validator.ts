import SessionModel from "../models/session-model.js";
import ParticipantModel from "../models/participant-model.js";

import { ErrorHandler } from "./error-handler.js";

export const ValidateUniqueUsername = async (
  roomId: string,
  username: string
) => {
  try {
    if (!roomId || !username) {
      throw new ErrorHandler("Room ID and username are required", 400);
    }

    const session = await SessionModel.findOne({ sessionId: roomId }).populate({
      path: "participants",
      select: "username",
      model: ParticipantModel,
    });
    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }

    const usernameExists = session.participants.some(
      (participant: any) =>
        participant.username.toLowerCase() === username.toLowerCase()
    );
    if (usernameExists) {
      throw new ErrorHandler("Username already taken in this room", 409);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
