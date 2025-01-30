import { SessionTypeEnum } from "../../enums/session-type-enum";
import { IMessage } from "./message-model-interface";
import { IParticipant } from "./participant-model-interface";

export interface ISession extends Document {
  sessionId: string;
  sessionType: SessionTypeEnum;
  sessionDuration: number;
  sessionIp: string;
  sessionLocation?: string;
  participants: IParticipant[];
  messages: IMessage[];
  secureSecurityCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
