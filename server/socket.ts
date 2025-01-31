import { Server as SocketIOServer } from "socket.io";

import { JoinRoomEvent } from "./events/join-room-event";
import { LeaveRoomEvent } from "./events/leave-room-event";
import { SendMessageEvent } from "./events/send-message-event";
import { DisconnectEvent } from "./events/disconnect-event";

import logger from "./utils/logger";

const InitializeSocketEvents = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    (socket.request as any).socketId = socket.id;

    logger.info(`New socket connection: ${socket.id}`);

    JoinRoomEvent(socket);
    LeaveRoomEvent(socket);
    SendMessageEvent(socket, io);
    DisconnectEvent(socket);
  });
};

const SetupSocketServer = (server: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  InitializeSocketEvents(io);

  return io;
};

export { SetupSocketServer };
