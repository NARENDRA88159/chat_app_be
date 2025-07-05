// redisClient.js
const Redis = require('ioredis');

// If Redis is local:
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  retryStrategy(times) {
    return Math.min(times * 100, 2000); // retry delay
  }
});

// Optional error log
redis.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redis;
