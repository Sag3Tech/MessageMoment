import { Document } from "mongoose";

export interface IAnalytics extends Document {
  sessionId: string;
  userId: string;
  username: string;
  leftAt: Date;
}
