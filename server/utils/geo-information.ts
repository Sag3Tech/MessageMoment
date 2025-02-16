import axios from "axios";

import { IPGeoData } from "../interfaces/utils-interfaces.js";

import Logger from "./logger.js";

const IpInfoHttp = axios.create();

// MANUAL RATE LIMITING
const MAX_REQUESTS = 50;
const PER_MILLISECONDS = 60 * 1000;
let requestQueue: (() => void)[] = [];
let requestCount = 0;

function processQueue() {
  if (requestQueue.length > 0 && requestCount < MAX_REQUESTS) {
    const nextRequest = requestQueue.shift();
    if (nextRequest) {
      requestCount++;
      nextRequest();
    }
  }
}

setInterval(() => {
  requestCount = 0;
  processQueue();
}, PER_MILLISECONDS);

IpInfoHttp.interceptors.request.use((config) => {
  return new Promise((resolve) => {
    requestQueue.push(() => resolve(config));
    processQueue();
  });
});

export async function GetGeoInformation(ip: string): Promise<IPGeoData> {
  try {
    if (!process.env.IP_INFO_ACCESS_KEY) {
      throw new Error("IPInfo access key missing in environment variables");
    }

    const cleanIp = ip.replace(/[^0-9a-fA-F.:]/g, "");

    // Handle local development IPs
    if (["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(cleanIp)) {
      return {
        ip: cleanIp,
        city: "Localhost",
        region: "Development",
        country: "Local",
        loc: "0,0",
      };
    }

    // Make API Request
    const response = await IpInfoHttp.get<IPGeoData>(
      `https://ipinfo.io/${cleanIp}`,
      {
        params: {
          token: process.env.IP_INFO_ACCESS_KEY,
        },
        headers: {
          "User-Agent": "Your-App-Name (contact@yourdomain.com)",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    Logger.error("IP Info API Error:", error);
    return { ip };
  }
}
