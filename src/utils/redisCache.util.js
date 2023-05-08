const redis = require("redis");
const client = redis.createClient();
client.on("error", (err) => console.log("Redis Server Error", err));
client.connect();

const ttl = process.env.REDIS_TTL || 3600;

module.exports = async function getOrSetCache(key, callback, ...callbackArgs) {
  const data = await client.get(key);
  if (data) {
    await client.expire(key, ttl);
    return JSON.parse(data);
  }
  const dataToCache = await callback(...callbackArgs);
  await client.set(key, JSON.stringify(dataToCache), "EX", ttl);
  return dataToCache;
};
