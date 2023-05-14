const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../clients/redis.client");
const {
  STATUS_ERROR,
  ERR_REQUEST_LIMIT_EXCEEDED,
} = require("../constants/app.constants");
const logger = require("../utils/logger.util");

const options = {
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 50, // 50 tokens
  duration: 5 * 60, // 5 min
};

const rateLimiterConfig = new RateLimiterRedis(options);

const rateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  rateLimiterConfig
    .consume(ip)
    .then((rateLimiterRes) => {
      const headers = {
        "Retry-After": Math.round(rateLimiterRes.msBeforeNext / 1000) || 1,
        "X-RateLimit-Limit": options.points,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
      };
      res.set(headers);
      next();
    })
    .catch((rejRes) => {
      logger.error(ERR_REQUEST_LIMIT_EXCEEDED);
      secondsRemaining = Math.round(rejRes.msBeforeNext / 1000) || 1;
      const headers = {
        "Retry-After": secondsRemaining,
        "X-RateLimit-Limit": options.points,
        "X-RateLimit-Remaining": rejRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rejRes.msBeforeNext),
      };
      res.set(headers);
      res
        .status(429)
        .json({
          status: STATUS_ERROR,
          message: `${ERR_REQUEST_LIMIT_EXCEEDED} Retry after ${secondsRemaining} seconds.`,
        });
    });
};

module.exports = rateLimiter;
