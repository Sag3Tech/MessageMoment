import { ErrorHandler } from "./error-handler";
import { GetAvailableColors } from "./get-available-colors";

export const AssignColorToParticipant = async (roomId: string) => {
  const availableColors = await GetAvailableColors(roomId);
  if (availableColors.length === 0) {
    throw new ErrorHandler("No available colors left for participants", 403);
  }
  return availableColors[0];
};
