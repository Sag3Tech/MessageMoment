import mongoose, { Document } from "mongoose";

export interface IParticipant extends Document {
  sessionId: mongoose.Schema.Types.ObjectId;
  participantId: string;
  username: string;
  joinedAt: Date;
}
