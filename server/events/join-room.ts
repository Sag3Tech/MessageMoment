import { io } from "../socket";

import { SessionTypeEnum } from "../enums/session-type-enum";
import { IPopulatedSession } from "../interfaces/models/session-model-interface";

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
        // Validation
        if (!roomId?.trim() || !username?.trim()) {
          throw new ErrorHandler("Room ID and username are required", 400);
        }

        // Redis session validation
        const sessionData = await RedisDatabase?.get(roomId);
        if (!sessionData)
          throw new ErrorHandler("Session expired or invalid", 404);
        const parsedSession = JSON.parse(sessionData);

        // Check if session is expired in MongoDB
        const existingSession = await SessionModel.findOne({
          sessionId: roomId,
        });
        if (existingSession?.isExpired) {
          throw new ErrorHandler(
            "This session has expired and cannot be joined",
            403
          );
        }

        // Get participant's IP address
        const forwardedFor = socket.request.headers["x-forwarded-for"];
        const ip = forwardedFor
          ? forwardedFor.split(",")[0].trim()
          : socket.request.connection.remoteAddress;

        // Get geolocation data from IP
        const ipDetails = await getIPDetails(ip);

        // Process coordinates from IP details
        const [latitude, longitude] = ipDetails.loc?.split(",").map(Number) || [
          null,
          null,
        ];

        // Construct location data for participant
        const locationData = {
          city: ipDetails.city || "Unknown",
          region: ipDetails.region || "Unknown",
          country: ipDetails.country || "Unknown",
          coordinates:
            latitude !== null && longitude !== null
              ? [latitude, longitude]
              : null,
        };

        // Security code validation
        if (parsedSession.sessionType === SessionTypeEnum.SECURE) {
          if (
            !securityCode ||
            securityCode !== parsedSession.secureSecurityCode
          ) {
            throw new ErrorHandler("Invalid security code", 401);
          }
        }

        // Find or create session with geolocation data
        let session = await SessionModel.findOne({ sessionId: roomId });
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
            activeUsers: [],
            isExpired: false, // Ensure new sessions are not expired
          });
        }

        // Check participant limit
        if (session.activeUsers.length >= MAX_PARTICIPANTS) {
          throw new ErrorHandler("Room is full (max 10 participants)", 403);
        }

        // Validate unique username
        await validateUniqueUsername(roomId, username);

        const assignedColor = await AssignColorToParticipant(roomId);

        // Create participant with their own location info
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

        // Update session
        session.participants.push(participant._id);
        session.activeUsers.push(participant._id);
        await session.save();

        // Get populated session data
        const populatedSession = await SessionModel.findById(session._id)
          .populate<IPopulatedSession>({
            path: "participants",
            select: "username participantId isActive connectionLocation",
          })
          .lean();

        if (!populatedSession) {
          throw new ErrorHandler("Failed to load session data", 500);
        }

        // Join socket room
        socket.join(roomId);

        // Prepare response data with location information
        const participants = populatedSession.participants.map((p) => ({
          username: p.username,
          participantId: p.participantId,
          location: {
            city: p.connectionLocation?.city,
            region: p.connectionLocation?.region,
            country: p.connectionLocation?.country,
          },
        }));

        // Emit events with location data
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

        io.to(roomId).emit("participantUpdate", participants);
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
