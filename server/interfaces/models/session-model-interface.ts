import mongoose, { Date, Document } from "mongoose";
import { IParticipant } from "./participant-model-interface";

export interface ISession extends Document {
  sessionId: string;
  sessionType: string;
  secureSecurityCode?: string;
  sessionIp: string;
  city: string;
  region: string;
  country: string;
  coordinates: [number, number];
  participants: Array<{ userId: string; username: string; joinedAt: Date; isActive: boolean }>;
  isExpired: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For populated sessions
export interface IPopulatedSession extends Omit<ISession, "participants"> {
  participants: IParticipant[];
}
