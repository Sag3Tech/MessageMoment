import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  sessionId: String;
  senderId: string;
  message: string;
  timestamp: Date;
}
