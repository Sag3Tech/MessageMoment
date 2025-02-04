import mongoose, { Schema } from "mongoose";
import { IParticipant } from "../interfaces/models/participant-model-interface";

const ParticipantSchema: Schema<IParticipant> = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    assignedColor: { type: String, required: true },
    participantId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    connectionLocation: {
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
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

const ParticipantModel = mongoose.model<IParticipant>(
  "Participant",
  ParticipantSchema
);

export default ParticipantModel;
