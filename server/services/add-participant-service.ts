import { IParticipant } from "../interfaces/models/participant-model-interface";

import ParticipantModel from "../models/participant-model";
import SessionModel from "../models/session-model";

import { ErrorHandler } from "../middlewares/error-handler";

export const AddParticipantService = async (
  sessionId: string,
  username: string,
  socketId: string
) => {
  try {
    const session = await SessionModel.findOne({ sessionId });
    if (!session) {
      throw new ErrorHandler("Session not found", 404);
    }

    const existingActiveParticipant = await ParticipantModel.findOne({
      sessionId: session._id,
      username,
      isActive: true,
    });

    if (existingActiveParticipant) {
      throw new ErrorHandler("Username already taken", 400);
    }

    const existingInactiveParticipant = (await ParticipantModel.findOne({
      sessionId: session._id,
      username,
      isActive: false,
    })) as IParticipant;
    if (existingInactiveParticipant) {
      existingInactiveParticipant.isActive = true;
      await existingInactiveParticipant.save();
      session.activeUsers.push(existingInactiveParticipant);
      await session.save();
      return existingInactiveParticipant;
    }

    const newParticipant = new ParticipantModel({
      sessionId: session._id,
      participantId: socketId,
      username,
      isActive: true,
    });

    await newParticipant.save();

    session.participants.push(newParticipant);
    session.activeUsers.push(newParticipant);
    
    await session.save();

    return newParticipant;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
