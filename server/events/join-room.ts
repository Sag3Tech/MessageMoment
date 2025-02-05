import { io } from "../socket";
import { SessionTypeEnum } from "../enums/session-type-enum";
import { RedisDatabase } from "../databases/redis-database";
import SessionModel from "../models/session-model";
import ParticipantModel from "../models/participant-model";
import { getIPDetails } from "../utils/get-ip-service";
import { ErrorHandler } from "../utils/error-handler";
import { generateUniqueId } from "../utils/participant-id-generator";
import { validateUniqueUsername } from "../utils/unique-name-validator";
import { AssignColorToParticipant } from "../utils/assign-participants-color";

const MAX_PARTICIPANTS = 10;

const JoinRoom = (socket: any) => {
  socket.on(
    "joinRoom",
    async (roomId: string, username: string, securityCode?: string) => {
      try {
        if (!roomId?.trim() || !username?.trim()) {
          throw new ErrorHandler("Room ID and username are required", 400);
        }

        // Validate session from Redis
        const sessionData = await RedisDatabase?.get(roomId);
        if (!sessionData)
          throw new ErrorHandler("Session expired or invalid", 404);
        const parsedSession = JSON.parse(sessionData);

        // Get session from MongoDB
        let session = await SessionModel.findOne({ sessionId: roomId });
        if (session?.isExpired) {
          throw new ErrorHandler("This session has expired and cannot be joined", 403);
        }

        // Get participant's IP address
        const forwardedFor = socket.request.headers["x-forwarded-for"];
        const ip = forwardedFor
          ? forwardedFor.split(",")[0].trim()
          : socket.request.connection.remoteAddress;

        // Get geolocation data
        const ipDetails = await getIPDetails(ip);
        const [latitude, longitude] = ipDetails.loc?.split(",").map(Number) || [null, null];

        const locationData = {
          city: ipDetails.city || "Unknown",
          region: ipDetails.region || "Unknown",
          country: ipDetails.country || "Unknown",
          coordinates: latitude !== null && longitude !== null ? [latitude, longitude] : null,
        };

        // Validate security code for secure sessions
        if (parsedSession.sessionType === SessionTypeEnum.SECURE) {
          if (!securityCode || securityCode !== parsedSession.secureSecurityCode) {
            throw new ErrorHandler("Invalid security code", 401);
          }
        }

        // If session doesn't exist, create a new one
        if (!session) {
          session = await SessionModel.create({
            sessionId: roomId,
            sessionType: parsedSession.sessionType,
            secureSecurityCode: parsedSession.secureSecurityCode,
            sessionIp: parsedSession.sessionIp,
            city: locationData.city,
            region: locationData.region,
            country: locationData.country,
            coordinates: locationData.coordinates,
            participants: [],
            isExpired: false,
          });
        }

        // Ensure participant limit is not exceeded
        if (session.participants.length >= MAX_PARTICIPANTS) {
          throw new ErrorHandler("Room is full (max 10 participants)", 403);
        }

        // Validate unique username
        await validateUniqueUsername(roomId, username);

        const assignedColor = await AssignColorToParticipant(roomId);

        // ✅ Ensure the participant is saved before adding to session
        const participant = await ParticipantModel.create({
          sessionId: roomId,
          participantId: generateUniqueId(),
          username,
          isActive: true,
          assignedColor,
          connectionLocation: {
            city: locationData.city,
            region: locationData.region,
            country: locationData.country,
            coordinates: locationData.coordinates,
          },
        });

        // ✅ Ensure the participant gets added to the session correctly
        session.participants.push({
          userId: participant.participantId,
          username: participant.username,
          joinedAt: new Date(),
          isActive: true, // Ensure this field is included in SessionModel
        });

        await session.save();

        // ✅ Fetch the updated session WITHOUT `.populate("participants")`
        const updatedSession = await SessionModel.findById(session._id).lean();

        if (!updatedSession) {
          throw new ErrorHandler("Failed to load session data", 500);
        }

        // ✅ Format participant data
        const participants = updatedSession.participants.map((p: any) => ({
          username: p.username,
          participantId: p.userId, // Ensure we are using `userId` correctly
          location: {
            city: p.connectionLocation?.city || "Unknown",
            region: p.connectionLocation?.region || "Unknown",
            country: p.connectionLocation?.country || "Unknown",
          },
        }));

        // Join socket room
        socket.join(roomId);

        // ✅ Emit room joined event (NO PAST MESSAGES)
        socket.emit("roomJoined", {
          roomId,
          username,
          assignedColor,
          participants,
          participantId: participant.participantId,
          location: {
            city: locationData.city,
            region: locationData.region,
            country: locationData.country,
          },
          message: `${username} joined, roomId:${roomId}`,
        });

        // ✅ Notify others in the room
        io.to(roomId).emit("userJoined", {
          username,
          participantId: participant.participantId,
          assignedColor,
          location: {
            city: locationData.city,
            region: locationData.region,
            country: locationData.country,
          },
          totalParticipants: participants.length,
        });

        io.to(roomId).emit("participantUpdate", {
          participants,
          total: participants.length,
        });

        // ✅ Send a system message to the new user, but DO NOT show past messages
        socket.emit("receiveMessage", {
          senderId: "System",
          message: `Welcome ${username}! You have joined the chat.`,
          timestamp: new Date(),
        });

      } catch (error: any) {
        console.error("Join room error:", error);
        socket.emit("roomError", {
          message: error.message || "Failed to join room",
          code: error.statusCode || 500,
        });
      }
    }
  );
};

export { JoinRoom };
