import mongoose, { Model, Schema } from "mongoose";

import { SessionTypeEnum } from "../enums/session-type-enum";
import { ISessionLink } from "../interfaces/models/session-link-model-interface";

const SessionLinkSchema: Schema<ISessionLink> = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9]{14}$/,
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
      match: /^\d{4}$/,
    },

    sessionIp: {
      type: String,
      required: true,
      match:
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    },

    isUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const SessionLinkModel: Model<ISessionLink> = mongoose.model<ISessionLink>(
  "SessionLink",
  SessionLinkSchema
);
export default SessionLinkModel;
