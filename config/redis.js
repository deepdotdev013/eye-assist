const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
  throw err;
});

// Async init function to safely connect
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');

    // Optional: quick test
    await redisClient.set('foo', 'bar');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

module.exports = { redisClient };
