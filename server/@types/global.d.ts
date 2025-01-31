import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";

declare global {
  var mongooseConnection: mongoose.Connection | undefined;
}

declare module "http" {
  interface IncomingMessage {
    io: SocketIOServer;
  }
}

declare module "express" {
  export interface Request {
    socketId?: string;
  }
}
