const { createLogger, format, transports } = require("winston");

const filename = "logs/audit.log";
const dateFormat = "YYYY-MM-DD HH:mm:ss";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: dateFormat,
    }),
    format.printf(
      (info) => `[${info.level}] ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports: [new transports.Console(), new transports.File({ filename })],
});

module.exports = logger;
