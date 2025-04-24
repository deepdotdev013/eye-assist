const { redisClient } = require('../../config/redis');

// Middleware to check and set cache dynamically based on route map
const redisCache = (cacheRoutes = {}) => {
  return async (req, res, next) => {
    const baseKey = `${req.method}:${req.path}`;

    // Skip if route is not configured for caching
    if (!cacheRoutes[baseKey]) return next();

    try {
      // Serialize and normalize query params (sorted for consistency)
      const queryString = Object.entries(req.query)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${Array.isArray(v) ? v.sort().join(',') : v}`)
        .join('&');

      const key = queryString ? `${baseKey}?${queryString}` : baseKey;

      const cached = await redisClient.get(key);
      if (cached) {
        console.log('✅ Cache HIT');
        const parsed = JSON.parse(cached);
        parsed.cached = true;
        return res.status(parsed.status || 200).json(parsed);
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redisClient.set(key, JSON.stringify(body), {
          EX: cacheRoutes[baseKey].ttl || 300,
        });
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('❌ Redis cache middleware error:', err);
      next(); // fallback gracefully
    }
  };
};

module.exports = redisCache;
