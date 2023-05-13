require("dotenv").config();

const { PORT, JWT_SECRET, NEWSAPI_KEY, REDIS_TTL, NODE_ENV } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  NEWSAPI_KEY,
  REDIS_TTL,
  NODE_ENV,
};
