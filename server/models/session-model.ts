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

    secureSecurityCode: {
      type: String,
      required: function () {
        return this.sessionType === SessionTypeEnum.SECURE;
      },
    },

    sessionIp: {
      type: String,
      required: true,
    },

    sessionLocation: {
      type: {
        lat: Number,
        lon: Number,
        country: String,
        city: String,
      },
    },

    sessionDuration: {
      type: Number,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],

    activeUsers: [
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

    isActive: {
      type: Boolean,
      default: true,
    },

    expiredAt: {
      type: Date,
      default: null,
    },

    realTimeDuration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<ISession>("Session", SessionSchema);
export default SessionModel;
