const redisClient = require("../clients/redis.client");
const { REDIS_TTL } = require("../configs/env.config");

const ttl = REDIS_TTL || 3600;

module.exports = async function getOrSetCache(key, callback, ...callbackArgs) {
  try {
    const data = await redisClient.get(key);
    if (data) {
      await redisClient.expire(key, ttl);
      return JSON.parse(data);
    }
    const dataToCache = await callback(...callbackArgs);
    await redisClient.setex(key, ttl, JSON.stringify(dataToCache));
    return dataToCache;
  } catch (error) {
    throw error;
  }
};
