import mongoose, { Schema } from "mongoose";

import { ISession } from "../interfaces/models/session-model-interface";
import { SessionTypeEnum } from "../enums/session-type-enum";

const SessionSchema: Schema<ISession> = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionType: {
      type: String,
      enum: Object.values(SessionTypeEnum),
      required: true,
    },
    sessionDuration: {
      type: Number,
      required: true,
    },
    sessionIp: {
      type: String,
      required: true,
    },
    sessionLocation: {
      type: String,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    secureSecurityCode: {
      type: String,
      required: function () {
        return this.sessionType === SessionTypeEnum.SECURE;
      },
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<ISession>("Session", SessionSchema);
export default SessionModel;
