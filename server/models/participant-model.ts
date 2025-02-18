import mongoose, { Schema } from "mongoose";

import { IParticipant } from "../interfaces/models/participant-model-interface.js";

import { ParticipantIdGenerator } from "../utils/participant-id-generator.js";

const ParticipantSchema: Schema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
    },
    userId: {
      type: String,
      default: () => ParticipantIdGenerator(),
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    participantIp: {
      type: String,
    },
    participantLocation: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    assignedColor: {
      type: String,
    },
    hasLockedSession: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ParticipantModel = mongoose.model<IParticipant>(
  "Participant",
  ParticipantSchema
);
export default ParticipantModel;
