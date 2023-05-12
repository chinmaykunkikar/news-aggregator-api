const redis = require("redis");
const { REDIS_TTL } = require("../config");
const client = redis.createClient();
(async () => {
  client.connect();
  client.on("error", (err) => {
    console.error("Failed to connect to Redis:", err);
    console.error("Please make sure Redis is running and try again.");
    process.exit(1);
  });
})();

const ttl = REDIS_TTL || 3600;

module.exports = async function getOrSetCache(key, callback, ...callbackArgs) {
  const data = await client.get(key);
  if (data) {
    await client.expire(key, ttl);
    return JSON.parse(data);
  }
  const dataToCache = await callback(...callbackArgs);
  await client.setEx(key, ttl, JSON.stringify(dataToCache));
  return dataToCache;
};
