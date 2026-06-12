const buckets = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100 } = {}) => (req, res, next) => {
  const key = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  res.set('X-RateLimit-Limit', String(max));
  res.set('X-RateLimit-Remaining', String(Math.max(max - bucket.count, 0)));

  if (bucket.count > max) {
    return res.status(429).json({ message: 'Too many requests. Please try again shortly.' });
  }

  return next();
};

module.exports = { rateLimit };
