import mongoose, { Document } from "mongoose";

export interface IParticipant extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  sessionId: mongoose.Schema.Types.ObjectId;
  participantId: string;
  username: string;
  isActive: boolean;
  joinedAt: Date;
  leftAt: Date;
}
