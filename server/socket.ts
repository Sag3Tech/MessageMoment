import { Server as SocketServer } from "socket.io";

import { JoinRoom } from "./events/join-room";
import { SendMessage } from "./events/send-message";
import { Disconnect } from "./events/disconnect";
import { MessageReceived } from "./events/message-received";
import { LeaveRoom } from "./events/leave-room";
import { ErrorHandler } from "./events/error-handler";
import { GetParticipantCount } from "./events/get-participant-count";

let io: SocketServer;

const InitializeSocket = (server: any) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.info(`New socket connection: ${socket.id}`);

    JoinRoom(socket);
    SendMessage(socket);
    Disconnect(socket);
    LeaveRoom(socket);
    ErrorHandler(socket);
    GetParticipantCount(socket);
  });

  MessageReceived();
};

export { io, InitializeSocket };
