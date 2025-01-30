import { Document } from "mongoose";

import { SessionTypeEnum } from "../../enums/session-type-enum";

export interface ISessionLink extends Document {
  sessionId: string;
  sessionType: SessionTypeEnum;
  secureSecurityCode?: string;
  sessionIp: string;
  createdAt: Date;
  updatedAt: Date;
}
