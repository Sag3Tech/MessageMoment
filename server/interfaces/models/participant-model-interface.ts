import { Document } from "mongoose";

export interface IParticipant extends Document {
  sessionId: string;
  userId: string;
  username: string;
  participantIp: string;
  participantLocation: {
    longitude: number;
    latitude: number;
    city: string;
    country: string;
  };
  assignedColor: string;
  hasLockedSession: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
