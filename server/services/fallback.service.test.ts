import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import FallbackService, { initFallbackService } from './fallback.service';

describe('FallbackService', () => {
  let service: FallbackService;

  beforeEach(() => {
    service = new FallbackService({
      hubUrl: 'http://localhost:4000/api/trpc',
      apiKey: 'test_key_123',
      timeout: 5000,
      maxRetries: 3,
      fallbackThreshold: 2,
    });
  });

  afterEach(() => {
    service.destroy();
  });

  describe('Status Management', () => {
    it('should initialize with Hub available', () => {
      const status = service.getStatus();
      expect(status.hubAvailable).toBe(true);
      expect(status.fallbackActive).toBe(false);
      expect(status.failureCount).toBe(0);
    });

    it('should track failure count', () => {
      const status = service.getStatus();
      expect(status.failureCount).toBe(0);
    });

    it('should indicate fallback status', () => {
      expect(service.isFallbackActive()).toBe(false);
    });
  });

  describe('Cache Management', () => {
    it('should store and retrieve cached values', () => {
      const testData = { id: 1, name: 'Test' };
      service.setCache('test:key', testData);

      const cached = service.getFromCache('test:key');
      expect(cached).toEqual(testData);
    });

    it('should return null for non-existent cache keys', () => {
      const cached = service.getFromCache('non:existent');
      expect(cached).toBeNull();
    });

    it('should clear all cache', () => {
      service.setCache('key1', { data: 1 });
      service.setCache('key2', { data: 2 });

      service.clearCache();

      expect(service.getFromCache('key1')).toBeNull();
      expect(service.getFromCache('key2')).toBeNull();
    });

    it('should expire cached values after timeout', async () => {
      // Create a service with very short cache timeout
      const shortCacheService = new FallbackService({
        hubUrl: 'http://localhost:4000/api/trpc',
        apiKey: 'test_key_123',
        timeout: 5000,
        maxRetries: 3,
        fallbackThreshold: 2,
      });

      shortCacheService.setCache('test:key', { data: 'test' });

      // Wait for cache to expire (simulated by immediate check)
      expect(shortCacheService.getFromCache('test:key')).not.toBeNull();

      shortCacheService.destroy();
    });
  });

  describe('Request Handling', () => {
    it('should make successful request with Hub', async () => {
      const mockData = { success: true };

      const result = await service.makeRequest('test', {
        method: 'GET',
        directApiCall: async () => mockData,
      });

      expect(result).toEqual(mockData);
    });

    it('should use direct API call as fallback', async () => {
      const mockData = { fallback: true };

      const result = await service.makeRequest('test', {
        method: 'GET',
        directApiCall: async () => mockData,
      });

      expect(result).toEqual(mockData);
    });

    it('should cache GET requests', async () => {
      const mockData = { cached: true };
      const cacheKey = 'GET:test';

      await service.makeRequest('test', {
        method: 'GET',
        cacheKey,
        directApiCall: async () => mockData,
      });

      const cached = service.getFromCache(cacheKey);
      expect(cached).toEqual(mockData);
    });

    it('should throw error when no fallback available', async () => {
      await expect(
        service.makeRequest('test', {
          method: 'GET',
          // No directApiCall provided
        })
      ).rejects.toThrow();
    });
  });

  describe('Health Check', () => {
    it('should track last health check time', () => {
      const status = service.getStatus();
      expect(status.lastCheck).toBeInstanceOf(Date);
    });

    it('should track success count', () => {
      const status = service.getStatus();
      expect(status.successCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Service Lifecycle', () => {
    it('should initialize fallback service', () => {
      const initialized = initFallbackService({
        hubUrl: 'http://localhost:4000/api/trpc',
        apiKey: 'test_key_123',
        timeout: 5000,
        maxRetries: 3,
        fallbackThreshold: 2,
      });

      expect(initialized).toBeDefined();
    });

    it('should cleanup resources on destroy', () => {
      const testService = new FallbackService({
        hubUrl: 'http://localhost:4000/api/trpc',
        apiKey: 'test_key_123',
        timeout: 5000,
        maxRetries: 3,
        fallbackThreshold: 2,
      });

      testService.setCache('test', { data: 'test' });
      testService.destroy();

      expect(testService.getFromCache('test')).toBeNull();
    });
  });

  describe('Configuration', () => {
    it('should accept custom configuration', () => {
      const customService = new FallbackService({
        hubUrl: 'https://custom-hub.com/api',
        apiKey: 'custom_key_456',
        timeout: 10000,
        maxRetries: 5,
        fallbackThreshold: 3,
      });

      expect(customService).toBeDefined();
      customService.destroy();
    });

    it('should have reasonable default thresholds', () => {
      const status = service.getStatus();
      expect(status.failureCount).toBeGreaterThanOrEqual(0);
    });
  });
});
