import { io } from "../socket";

import { PublishToRedisChannel } from "../databases/redis-database";

const SendMessage = (socket: any) => {
  socket.on("sendMessage", (data: { roomId: string; message: string }) => {
    io.to(data.roomId).emit("receiveMessage", data.message);
    console.info(`Message sent to room ${data.roomId}: ${data.message}`);

    PublishToRedisChannel("message", JSON.stringify(data));
  });
};

export { SendMessage };
