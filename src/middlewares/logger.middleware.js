const logger = require("../utils/logger.util");

function incomingLogs(req, _, next) {
  logger.info(`Request: ${req.method} ${req.originalUrl}`);
  next();
}

function outgoingLogs(req, res, next) {
  const oldSend = res.send;
  res.send = function () {
    logger.info(`Response: ${res.statusCode} ${req.originalUrl}`);
    oldSend.apply(res, arguments);
  };
  next();
}

module.exports = { incomingLogs, outgoingLogs };
