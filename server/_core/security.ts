import { Express } from 'express';

export function setupSecurityHeaders(app: Express) {
  // Security headers
  app.use((req, res, next) => {
    // Prevent XSS
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // CSP
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    
    // HSTS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    next();
  });
}

export function setupRateLimiting(app: Express) {
  const requestCounts = new Map<string, number[]>();
  const WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_REQUESTS = 100;

  app.use((req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }
    
    const timestamps = requestCounts.get(ip)!;
    const recentRequests = timestamps.filter(t => now - t < WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    
    next();
  });
}

export function validateInput(data: any, schema: Record<string, string>): boolean {
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in data)) return false;
    if (typeof data[key] !== type) return false;
  }
  return true;
}
