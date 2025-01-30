import { Socket, Server } from "socket.io";

import logger from "../utils/logger";

const SendMessageEvent = (socket: Socket, io: Server) => {
  socket.on("sendMessage", (data: any) => {
    logger.info(`Message received from ${socket.id}: ${data}`);
    io.emit("message", data);
  });
};

export { SendMessageEvent };
