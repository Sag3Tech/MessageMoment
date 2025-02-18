import SessionModel from "../models/session-model.js";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#A833FF",
  "#33FFF5",
  "#F5FF33",
  "#FF8C33",
  "#8C33FF",
  "#33FF8C",
];

export const AssignUserColor = async (sessionId: string): Promise<string> => {
  try {
    const session = await SessionModel.findOne({ sessionId });
    if (!session) {
      throw new Error("Session not found.");
    }

    const usedColors = session.participants.map((p) => p.assignedColor);
    const availableColor = COLORS.find((color) => !usedColors.includes(color));

    return availableColor || COLORS[Math.floor(Math.random() * COLORS.length)];
  } catch (error) {
    console.error("Error assigning user color:", error);
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
};
