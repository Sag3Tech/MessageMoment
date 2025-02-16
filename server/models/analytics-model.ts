import mongoose, { Schema } from "mongoose";

import { IAnalytics } from "../interfaces/models/analytics-model-interface.js";

const AnalyticsSchema: Schema<IAnalytics> = new Schema(
  {
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    leftAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AnalyticsModel = mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
export default AnalyticsModel;
