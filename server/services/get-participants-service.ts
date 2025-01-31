import ParticipantModel from "../models/participant-model";

import { ErrorHandler } from "../middlewares/error-handler";

export const GetParticipantsService = async (sessionId: string) => {
  try {
    const participants = await ParticipantModel.find({ sessionId });
    return participants;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 500);
  }
};
