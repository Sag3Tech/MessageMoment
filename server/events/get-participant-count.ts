import SessionModel from "../models/session-model";

const GetParticipantCount = (socket: any) => {
  socket.on("getParticipantCount", async (roomId: string) => {
    try {
      const session = await SessionModel.findOne({ sessionId: roomId }).lean();

      if (!session) {
        return socket.emit("participantCount", 0);
      }

      // Count only active participants
      const activeParticipants = session.participants.filter((p) => p.isActive).length;

      socket.emit("participantCount", activeParticipants);
    } catch (error) {
      console.error("Participant count error:", error);
    }
  });
};

export { GetParticipantCount };
