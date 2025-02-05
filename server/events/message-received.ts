import { io } from "../socket";
import { SubscribeToRedisChannel } from "../databases/redis-database";

const MessageReceived = () => {
  SubscribeToRedisChannel("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      io.to(data.roomId).emit("receiveMessage", {
        senderId: data.senderId,
        message: data.message,
      });
    } catch (error) {
      console.error("Error processing received message:", error);
    }
  });
};

export { MessageReceived };
