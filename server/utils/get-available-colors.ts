import { PredefinedColors } from "../constants/pre-defined-colors";

import ParticipantModel from "../models/participant-model";

export const GetAvailableColors = async (roomId: string) => {
  const participants = await ParticipantModel.find({ sessionId: roomId });
  const usedColors = participants.map((p) => p.assignedColor);
  return PredefinedColors.filter((color) => !usedColors.includes(color));
};
