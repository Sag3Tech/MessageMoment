import "dotenv/config";

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm" }),
    winston.format.printf(({ timestamp, level, message }) => {
      const coloredTimestamp = chalk.magenta(timestamp);
      return `[${level}] ${coloredTimestamp} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "info",
    }),
  ],
});

export default Logger;
