import { io } from "../socket.js";

import { IPopulatedSession } from "../interfaces/models/session-model-interface.js";

import { RedisDatabase } from "../databases/redis-database.js";

import ParticipantModel from "../models/participant-model.js";
import SessionModel from "../models/session-model.js";
import AnalyticsModel from "../models/analytics-model.js";

import { ErrorHandler } from "../utils/error-handler.js";

const LeaveRoom = (socket: any) => {
  const removeParticipant = async (roomId: string, participantId: string) => {
    try {
      // Remove participant from the session
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

      // Remove participant from session
      const session = await SessionModel.findOneAndUpdate(
        { sessionId: roomId },
        { $pull: { participants: { userId: participant.participantId } } },
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

      const analyticsEntry = new AnalyticsModel({
        sessionId: roomId,
        userId: participant.participantId,
        username: participant.username,
        leftAt: new Date(),
      });

      await analyticsEntry.save();

      // Check if all participants have left
      if (!session.participants || session.participants.length === 0) {
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
    }
  };

  socket.on("leaveRoom", async (roomId: string, participantId: string) => {
    await removeParticipant(roomId, participantId);
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
    const participant = await ParticipantModel.findOne({ socketId: socket.id });

    if (participant) {
      await removeParticipant(participant.sessionId, participant.participantId);
    }
  });
};

export { LeaveRoom };
