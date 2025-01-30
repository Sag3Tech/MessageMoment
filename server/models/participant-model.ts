import mongoose, { Schema } from "mongoose";

import { IParticipant } from "../interfaces/models/participant-model-interface";

const ParticipantSchema: Schema<IParticipant> = new Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    participantId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ParticipantModel = mongoose.model<IParticipant>(
  "Participant",
  ParticipantSchema
);

export default ParticipantModel;
