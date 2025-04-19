const { redisClient } = require('../../config/redis');

// Middleware to check and set cache dynamically based on route map
const redisCache = (cacheRoutes = {}) => {
  return async (req, res, next) => {
    const key = `${req.method}:${req.path}`;

    // Skip if not a cacheable route
    if (!cacheRoutes[key]) return next();

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        console.log('✅ Cache HIT');
        const parsed = JSON.parse(cached);
        parsed.cached = true; // Add flag to show response was cached
        return res.status(parsed.status || 200).json(parsed);
      }

      // Patch res.json to cache full response body
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Store full response (status, message, data)
        redisClient.set(key, JSON.stringify(body), {
          EX: cacheRoutes[key].ttl || 300, // Default TTL: 5 mins
        });
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('❌ Redis cache middleware error:', err);
      next(); // graceful fallback
    }
  };
};

module.exports = redisCache;
