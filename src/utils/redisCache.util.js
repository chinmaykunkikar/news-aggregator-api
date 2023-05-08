const dotenv = require("dotenv");
const redis = require("redis");
const client = redis.createClient();
(async () => {
  client.on("error", (err) => console.log("Redis Server Error", err));
  await client.connect();
})();

dotenv.config();

const ttl = process.env.REDIS_TTL || 3600;

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
