import { io } from "../socket";

import { SubscribeToRedisChannel } from "../databases/redis-database";

const MessageReceived = () => {
  SubscribeToRedisChannel("message", (message: string) => {
    const data = JSON.parse(message);
    io.to(data.roomId).emit("receiveMessage", data.message);
  });
};

export { MessageReceived };
