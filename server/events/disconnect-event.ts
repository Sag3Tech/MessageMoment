import { Socket } from "socket.io";

import logger from "../utils/logger";

const DisconnectEvent = (socket: Socket) => {
  socket.on("disconnect", () => {
    logger.info(`Socket ${socket.id} disconnected`);
  });
};

export { DisconnectEvent };
