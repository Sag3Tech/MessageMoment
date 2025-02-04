import SessionModel from "../models/session-model";

const GetParticipantCount = (socket: any) => {
  socket.on("getParticipantCount", async (roomId: string) => {
    try {
      const session = await SessionModel.findOne({ sessionId: roomId })
        .populate({
          path: "activeUsers",
          match: { isActive: true },
        })
        .lean();

      socket.emit("participantCount", session?.activeUsers?.length || 0);
    } catch (error) {
      console.error("Participant count error:", error);
    }
  });
};

export { GetParticipantCount };
