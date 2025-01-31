import { Socket } from "socket.io";
import logger from "../utils/logger";

import { SessionTypeEnum } from "../enums/session-type-enum";

import {
  ValidateSecurityCodeService,
  ValidateSessionService,
} from "../services/validate-session-service";
import { AddParticipantService } from "../services/add-participant-service";
import { GetParticipantsService } from "../services/get-participants-service";

const JoinRoomEvent = (socket: Socket) => {
  socket.on(
    "join-room",
    async ({
      sessionId,
      username,
      securityCode,
    }: {
      sessionId: string;
      username: string;
      securityCode?: string;
    }) => {
      try {
        // Start by validating the session and security code in parallel
        const sessionPromise = ValidateSessionService(sessionId);
        const participantsPromise = GetParticipantsService(sessionId);

        // Await session validation and participants fetching simultaneously
        const [session, participants] = await Promise.all([
          sessionPromise,
          participantsPromise,
        ]);

        // Check for session existence and security code validation
        if (!session) {
          throw new Error("Session not found");
        }

        // Check and validate security code if the session type is secure
        if (session.sessionType === SessionTypeEnum.SECURE && securityCode) {
          if (!session.secureSecurityCode) {
            throw new Error(
              "Secure security code is not defined for this session."
            );
          }
          ValidateSecurityCodeService(
            session.sessionType,
            securityCode,
            session.secureSecurityCode
          );
        }

        // Now add the participant to the session
        const newParticipant = await AddParticipantService(
          sessionId,
          username,
          socket.id
        );

        // After adding the participant, join the room
        socket.join(sessionId);

        // Emit successful join response with the updated participant list
        socket.emit("join-success", {
          username,
          sessionId,
          participants: participants,
        });

        // Notify other participants that a new user has joined
        socket
          .to(sessionId)
          .emit("user-joined", { username, participantId: socket.id });

        // Log the join action
        logger.info(`${username} (ID: ${socket.id}) joined room: ${sessionId}`);
      } catch (error) {
        // Log the error if any step fails
        logger.error(
          `Error when user ${socket.id} tried to join room ${sessionId}: `,
          error
        );
        socket.emit("error", "Error while joining room.");
      }
    }
  );
};

export { JoinRoomEvent };
