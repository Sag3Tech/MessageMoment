import SessionModel from "../models/session-model";

import ParticipantModel from "../models/participant-model";

import { ErrorHandler } from "./error-handler";

export const validateUniqueUsername = async (
  roomId: string,
  username: string
) => {
  try {
    if (!roomId || !username) {
      throw new ErrorHandler("Room ID and username are required", 400);
    }

    // Find the session and populate participants
    const session = await SessionModel.findOne({ sessionId: roomId }).populate({
      path: "participants",
      select: "username",
      model: ParticipantModel,
    });

    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }

    // Check for existing username in participants
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
