const Redis = require("ioredis");

const redisClient = new Redis();

(async () => {
  redisClient.on("error", (err) => {
    console.error("Failed to connect to Redis:", err);
    console.error("Please make sure Redis is running and try again.");
    process.exit(1);
  });
})();

module.exports = redisClient;
