import mongoose, { Schema } from "mongoose";

import { ISession } from "../interfaces/models/session-model-interface.js";
import { SessionTypeEnum } from "../enums/session-type-enum.js";

const SessionSchema: Schema<ISession> = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    sessionType: {
      type: String,
      enum: SessionTypeEnum,
      required: true,
    },
    secureSecurityCode: {
      type: String,
      required: function (this: ISession) {
        return this.sessionType === "secure";
      },
    },
    sessionIp: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "Unknown",
    },
    region: {
      type: String,
      default: "Unknown",
    },
    country: {
      type: String,
      default: "Unknown",
    },
    coordinates: {
      type: [Number],
    },
    participants: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        joinedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
      },
    ],

    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SessionSchema.index({ coordinates: "2dsphere" });
const SessionModel = mongoose.model<ISession>("Session", SessionSchema);
export default SessionModel;
