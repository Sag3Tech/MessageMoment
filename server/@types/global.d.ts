import { Connection } from "mongoose";

declare global {
  var mongooseConnection: Connection | undefined;
}

// typings/ipinfo.d.ts
declare module 'ipinfo' {
  interface IPInfo {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    // Add other properties you need
  }

  interface IPInfoClient {
    lookup(ip: string): Promise<IPInfo>;
  }

  export function createClient(config: { token: string }): IPInfoClient;
}