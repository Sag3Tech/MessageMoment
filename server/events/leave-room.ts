import ParticipantModel from "../models/participant-model";
import SessionModel from "../models/session-model";
import { io } from "../socket";
import { ErrorHandler } from "../utils/error-handler";
import { IPopulatedSession } from "../interfaces/models/session-model-interface";
import { RedisDatabase } from "../databases/redis-database"; // Add this import

const LeaveRoom = (socket: any) => {
  socket.on("leaveRoom", async (roomId: string, participantId: string) => {
    try {
      // Leave the socket room first
      socket.leave(roomId);

      // Soft delete participant
      const participant = await ParticipantModel.findOneAndUpdate(
        { participantId, sessionId: roomId },
        { $set: { isActive: false } },
        { new: true }
      );

      if (!participant) {
        throw new ErrorHandler("Participant not found", 404);
      }

      const color = participant.assignedColor;
      await RedisDatabase?.sadd(`${roomId}:availableColors`, color);

      // Update session and get fresh data
      const session = await SessionModel.findOneAndUpdate(
        { sessionId: roomId },
        { $pull: { activeUsers: participant._id } },
        { new: true }
      )
        .populate<IPopulatedSession>({
          path: "participants",
          match: { isActive: true },
          select: "username participantId connectionLocation",
        })
        .lean();

      if (!session) {
        throw new ErrorHandler("Session not found", 404);
      }

      // Check if all participants have left
      if (session.activeUsers.length === 0) {
        // Mark session as expired in MongoDB
        await SessionModel.findOneAndUpdate(
          { sessionId: roomId },
          { $set: { isExpired: true } }
        );

        // Remove from Redis if using session storage
        await RedisDatabase?.del(roomId);

        // Notify all clients about session expiration
        io.to(roomId).emit("sessionExpired", {
          message: "Session has expired as all participants left",
          roomId,
        });
      }

      // Prepare updated participant data with location
      const participants = session.participants.map((p) => ({
        username: p.username,
        participantId: p.participantId,
        location: {
          city: p.connectionLocation?.city,
          region: p.connectionLocation?.region,
          country: p.connectionLocation?.country,
        },
      }));

      // Emit updates to all clients
      io.to(roomId).emit("participantUpdate", {
        participants,
        total: participants.length,
      });

      // Notify about user leaving
      socket.to(roomId).emit("userLeft", {
        username: participant.username,
        participantId: participant.participantId,
        totalParticipants: participants.length,
      });
    } catch (error: any) {
      console.error("Leave room error:", error);
      socket.emit("roomError", {
        message: error.message || "Failed to leave room",
        code: error.statusCode || 500,
      });
    }
  });
};

export { LeaveRoom };
