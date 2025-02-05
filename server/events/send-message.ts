import { io } from "../socket";
import MessageModel from "../models/message-model";
import { PublishToRedisChannel } from "../databases/redis-database";

const SendMessage = (socket: any) => {
  socket.on("sendMessage", async (data: { roomId: string; senderId: string; message: string }) => {
    try {
      if (typeof data.roomId !== "string") {
        throw new Error("Invalid session ID format. Expected a string.");
      }

      // Save message to MongoDB
      const newMessage = new MessageModel({
        sessionId: data.roomId,
        senderId: data.senderId,
        message: data.message,
      });

      await newMessage.save();

      // Broadcast the message to all users in the room
      io.to(data.roomId).emit("receiveMessage", {
        senderId: data.senderId,
        message: data.message,
        timestamp: newMessage.timestamp,
      });

      // Publish to Redis (optional for scalability)
      PublishToRedisChannel("message", JSON.stringify(data));

      console.info(`Message stored & sent to room ${data.roomId}: ${data.message}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};

export { SendMessage };
