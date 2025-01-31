import { SessionTypeEnum } from "../../enums/session-type-enum";
import { IMessage } from "./message-model-interface";
import { IParticipant } from "./participant-model-interface";

export interface ISession extends Document {
  sessionId: string;
  sessionType: SessionTypeEnum;
  secureSecurityCode?: string;
  sessionIp: string;
  sessionLocation?: { lat: number; lon: number; country: string; city: string };
  sessionDuration: number;
  participants: IParticipant[];
  activeUsers: IParticipant[];
  messages: IMessage[];
  isActive?: boolean;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  realTimeDuration: number;
}
