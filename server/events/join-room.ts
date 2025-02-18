import { Server, Socket } from "socket.io";

import { JoinRoomPayload } from "interfaces/events/join-room-event-interface.js";

import { RedisDatabase } from "../databases/redis-database.js";

import SessionModel from "../models/session-model.js";
import ParticipantModel from "../models/participant-model.js";

import { AssignUserColor } from "../utils/assign-participant-color.js";

const JoinRoom = (io: Server, socket: Socket): void => {
  socket.on("joinRoom", async (data: JoinRoomPayload) => {
    try {
      const { sessionId, sessionSecurityCode, username } = data;
      console.info(`User attempting to join session: ${sessionId}`);

      // Validate input
      if (!sessionId || !username) {
        socket.emit("error", "Session ID and Username are required.");
        return;
      }

      // Fetch session data from Redis
      if (!RedisDatabase) {
        console.error("RedisDatabase is not initialized.");
        return;
      }
      const sessionData = await RedisDatabase.get(sessionId);
      let session = await SessionModel.findOne({ sessionId });

      // 1️⃣ If session exists in Redis but not in MongoDB -> Create new session in MongoDB
      if (sessionData && !session) {
        console.log(`Creating new session in MongoDB from Redis data`);

        const parsedSession = JSON.parse(sessionData);

        // (parsedSession.sessionIp) => participantLocation

        session = new SessionModel({
          sessionId: parsedSession.sessionId,
          sessionType: parsedSession.sessionType,
          sessionSecurityCode: parsedSession.sessionSecurityCode,
          sessionIp: parsedSession.sessionIp,
          participantCount: 0,
          sessionTimer: 30,
          isExpirationTimeSet: false,
          isProjectModeOn: false,
          sessionLocked: false,
          sessionExpired: false,
          participants: [],
        });

        await session.save();
      }

      // 2️⃣ If session does not exist in MongoDB at all
      if (!session) {
        socket.emit("redirect", "/invalid-session");
        return;
      }

      // 3️⃣ Check if session is expired
      if (session.sessionExpired) {
        socket.emit("redirect", "/session-expired");
        return;
      }

      // 4️⃣ Check if session is locked
      if (session.sessionLocked) {
        socket.emit("redirect", "/session-locked");
        return;
      }

      // 5️⃣ Validate session security code for secure sessions
      if (
        session.sessionType === "secure" &&
        session.sessionSecurityCode !== sessionSecurityCode
      ) {
        socket.emit("error", "Invalid security code.");
        return;
      }

      // 6️⃣ Check if participant limit (10) is reached
      if (session.participantCount >= 10) {
        socket.emit("redirect", "/session-full");
        return;
      }

      // 7️⃣ Get participant IP address
      const participantIp: string =
        socket.handshake.headers["x-forwarded-for"]
          ?.toString()
          .split(",")[0]
          .trim() ||
        socket.handshake.address ||
        "Unknown";
        // geo data function for user
        // (user ip)

      // 8️⃣ Assign a unique color to the user
      const assignedColor = await AssignUserColor(sessionId);

      // 9️⃣ Create participant entry
      const participant = await ParticipantModel.create({
        sessionId: session._id,
        userId: socket.id,
        username,
        participantIp,
        assignedColor,
        hasLockedSession: false,
      });

      // 1️⃣0️⃣ Update session participant list
      session.participants.push({
        userId: participant._id.toString(),
        username,
        assignedColor,
        joinedAt: new Date(),
      });

      session.participantCount += 1;
      await session.save();

      // 1️⃣1️⃣ Join the user to the socket room
      socket.join(sessionId);
      console.info(`Socket ${socket.id} joined room ${sessionId}`);

      // 1️⃣2️⃣ Notify other users in the session
      io.to(sessionId).emit("userJoined", {
        username,
        assignedColor,
        message: `${username} joined the session.`,
      });

      // 1️⃣3️⃣ Confirm successful join to the user
      socket.emit("joinedRoom", {
        sessionId,
        assignedColor,
        message: "Successfully joined room",
      });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Server error while joining room.");
    }
  });
};

export { JoinRoom };
