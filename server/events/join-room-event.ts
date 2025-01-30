import { Socket } from "socket.io";

import logger from "../utils/logger";

const JoinRoomEvent = (socket: Socket) => {
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    logger.info(`${socket.id} joined room: ${roomId}`);
  });
};

export { JoinRoomEvent };
