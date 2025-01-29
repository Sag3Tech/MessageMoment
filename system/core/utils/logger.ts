import "dotenv-flow/config";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      const coloredTimestamp = chalk.magenta(timestamp);
      return `[${level}] ${coloredTimestamp} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/core-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "info",
    }),
  ],
});

export default logger;
