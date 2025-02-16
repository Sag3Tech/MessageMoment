import ParticipantModel from "models/participant-model.js";

import { ErrorHandler } from "./error-handler.js";
import { ParticipantColors } from "constants/participant-colors.js";

export const GetAvailableColors = async (roomId: string) => {
  const participants = await ParticipantModel.find({ sessionId: roomId });
  const usedColors = participants.map((p) => p.assignedColor);
  return ParticipantColors.filter((color) => !usedColors.includes(color));
};

export const AssignColorToParticipant = async (roomId: string) => {
  const availableColors = await GetAvailableColors(roomId);
  if (availableColors.length === 0) {
    throw new ErrorHandler("No available colors left for participants", 403);
  }
  return availableColors[0];
};
