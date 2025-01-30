import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  sessionId: mongoose.Schema.Types.ObjectId;
  senderId: string;
  message: string;
  timestamp: Date;
}
