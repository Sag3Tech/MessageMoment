import { Document } from "mongoose";

export interface IParticipant extends Document {
  sessionId: string;
  participantId: string;
  username: string;
  isActive: boolean;
  assignedColor: string;
  connectionLocation: {
    city: string;
    region: string;
    country: string;
    coordinates: [number, number];
  };
  joinedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
