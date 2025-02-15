import { IPGeoData } from "../interfaces/ip-interface";

import axios from "axios";
import rateLimit from "axios-rate-limit";

import Logger from "./logger.js";

// Configure rate-limited axios instance (50 requests/minute)
const ipinfoHttp = rateLimit(axios.create(), {
  maxRequests: 50,
  perMilliseconds: 60 * 1000,
});

export async function getIPDetails(ip: string): Promise<IPGeoData> {
  try {
    // Validate environment configuration
    if (!process.env.IP_INFO_ACCESS_KEY) {
      throw new Error("IPInfo access key missing in environment variables");
    }

    // Sanitize IP address
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

    // Make API call with proper headers and parameters
    const response = await ipinfoHttp.get<IPGeoData>(
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
    Logger.error("IP Info API Error:");

    return { ip };
  }
}
