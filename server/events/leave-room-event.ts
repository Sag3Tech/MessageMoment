import { Socket } from "socket.io";

import logger from "../utils/logger";

const LeaveRoomEvent = (socket: Socket) => {
  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
    logger.info(`${socket.id} left room: ${roomId}`);
  });
};

export { LeaveRoomEvent };
