// Simple logging utility
const logger = {
  info: (msg: string, data?: unknown) => console.log(`[INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[ERROR] ${msg}`, data),
  debug: (msg: string, data?: unknown) => console.debug(`[DEBUG] ${msg}`, data),
};

/**
 * Fallback Service
 * 
 * Implements automatic failover mechanism:
 * - Detects when PSD Hub is unavailable
 * - Switches to direct API calls
 * - Maintains cache for offline support
 * - Tracks fallback status
 */

export interface FallbackStatus {
  hubAvailable: boolean;
  lastCheck: Date;
  fallbackActive: boolean;
  failureCount: number;
  successCount: number;
}

export interface FallbackConfig {
  hubUrl: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
  fallbackThreshold: number; // Number of failures before switching to fallback
}

class FallbackService {
  private status: FallbackStatus = {
    hubAvailable: true,
    lastCheck: new Date(),
    fallbackActive: false,
    failureCount: 0,
    successCount: 0,
  };

  private config: FallbackConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(config: FallbackConfig) {
    this.config = config;
    this.startHealthCheck();
  }

  /**
   * Start periodic health check of PSD Hub
   */
  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      await this.checkHubHealth();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check if PSD Hub is healthy
   */
  private async checkHubHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.hubUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.config.timeout),
      });

      const isHealthy = response.ok || response.status < 500;

      if (isHealthy) {
        this.status.successCount++;
        this.status.failureCount = 0;

        if (this.status.fallbackActive) {
          logger.info('[Fallback] PSD Hub recovered, switching back to Hub');
          this.status.fallbackActive = false;
        }
      } else {
        this.status.failureCount++;

        if (this.status.failureCount >= this.config.fallbackThreshold) {
          logger.warn('[Fallback] PSD Hub unhealthy, activating fallback mode');
          this.status.fallbackActive = true;
        }
      }

      this.status.hubAvailable = isHealthy;
      this.status.lastCheck = new Date();

      return isHealthy;
    } catch (error) {
      this.status.failureCount++;
      this.status.hubAvailable = false;
      this.status.lastCheck = new Date();

      if (this.status.failureCount >= this.config.fallbackThreshold) {
        logger.warn('[Fallback] PSD Hub unreachable, activating fallback mode', {
          error: error instanceof Error ? error.message : String(error),
        });
        this.status.fallbackActive = true;
      }

      return false;
    }
  }

  /**
   * Get current fallback status
   */
  getStatus(): FallbackStatus {
    return { ...this.status };
  }

  /**
   * Check if fallback is active
   */
  isFallbackActive(): boolean {
    return this.status.fallbackActive;
  }

  /**
   * Get cached value if available
   */
  getFromCache(key: string): unknown | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Store value in cache
   */
  setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Make request with fallback support
   */
  async makeRequest<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: unknown;
      cacheKey?: string;
      directApiCall?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    const method = options.method || 'GET';
    const cacheKey = options.cacheKey || `${method}:${endpoint}`;

    // Try to get from cache if GET request
    if (method === 'GET') {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        logger.debug('[Fallback] Returning cached response', { endpoint });
        return cached as T;
      }
    }

    // If Hub is available, try Hub first
    if (!this.status.fallbackActive) {
      try {
        const response = await fetch(`${this.config.hubUrl}${endpoint}`, {
          method,
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (response.ok) {
          const data = await response.json() as T;

          // Cache GET responses
          if (method === 'GET') {
            this.setCache(cacheKey, data);
          }

          this.status.successCount++;
          this.status.failureCount = 0;

          return data;
        } else if (response.status >= 500) {
          // Server error, try fallback
          logger.warn('[Fallback] Hub returned server error, trying fallback', {
            status: response.status,
            endpoint,
          });
          this.status.failureCount++;
        } else {
          // Client error, don't retry
          throw new Error(`Hub error: ${response.status}`);
        }
      } catch (error) {
        logger.warn('[Fallback] Hub request failed, trying fallback', {
          error: error instanceof Error ? error.message : String(error),
          endpoint,
        });
        this.status.failureCount++;
      }
    }

    // Use direct API call as fallback
    if (options.directApiCall) {
      try {
        logger.info('[Fallback] Using direct API call', { endpoint });
        const data = await options.directApiCall();

        // Cache GET responses
        if (method === 'GET') {
          this.setCache(cacheKey, data);
        }

        return data;
      } catch (error) {
        logger.error('[Fallback] Direct API call failed', {
          error: error instanceof Error ? error.message : String(error),
          endpoint,
        });
        throw error;
      }
    }

    // Try to return cached response as last resort
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      logger.warn('[Fallback] Returning stale cached response', { endpoint });
      return cached as T;
    }

    throw new Error(`[Fallback] No fallback available for ${endpoint}`);
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.cache.clear();
  }
}

// Export singleton instance
let fallbackService: FallbackService | null = null;

export function initFallbackService(config: FallbackConfig): FallbackService {
  if (!fallbackService) {
    fallbackService = new FallbackService(config);
  }
  return fallbackService;
}

export function getFallbackService(): FallbackService {
  if (!fallbackService) {
    throw new Error('Fallback service not initialized');
  }
  return fallbackService;
}

export default FallbackService;
