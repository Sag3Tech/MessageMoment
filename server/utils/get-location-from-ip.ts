import "dotenv-flow/config";

import axios from "axios";

import { ErrorHandler } from "../middlewares/error-handler";

export const GetLocationFromIp = async (ip: string) => {
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}/json?token=${process.env.IP_INFO_ACCESS_KEY}`
    );
    const { loc, country, city } = response.data;

    const [lat, lon] = loc.split(",");

    return { lat: parseFloat(lat), lon: parseFloat(lon), country, city };
  } catch (error) {
    throw new ErrorHandler("Error fetching location data", 500);
  }
};
