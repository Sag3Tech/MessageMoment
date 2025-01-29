import mongoose from "mongoose";

declare global {
  var mongooseConnection: mongoose.Connection | undefined;
}
