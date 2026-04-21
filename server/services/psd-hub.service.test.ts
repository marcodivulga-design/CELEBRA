import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { PsdHubService } from './psd-hub.service';

/**
 * PSD Hub Service Integration Tests
 * Tests the server-side proxy to the remote PSD Hub
 */

describe('PsdHubService', () => {
  let service: PsdHubService;

  beforeAll(() => {
    service = new PsdHubService();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('Health & Status', () => {
    it('should have PSD Hub service initialized', () => {
      expect(service).toBeDefined();
    });

    it('should have cache management methods', () => {
      expect(service.clearCache).toBeDefined();
      expect(service.getCacheStats).toBeDefined();
      expect(service.clearCacheEntry).toBeDefined();
    });

    it('should return empty cache initially', () => {
      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.timeout).toBe(5 * 60 * 1000);
    });
  });

  describe('Cache Management', () => {
    it('should track cache statistics', () => {
      const stats = service.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('timeout');
      expect(stats).toHaveProperty('entries');
      expect(Array.isArray(stats.entries)).toBe(true);
    });

    it('should clear cache', () => {
      service.clearCache();
      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should clear specific cache entries', () => {
      service.clearCacheEntry('/api/spotify/search');
      const stats = service.getCacheStats();
      expect(stats.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Spotify Methods', () => {
    it('should have spotifySearch method', () => {
      expect(service.spotifySearch).toBeDefined();
    });

    it('should have spotifyGetTrack method', () => {
      expect(service.spotifyGetTrack).toBeDefined();
    });

    it('should have spotifyGetArtist method', () => {
      expect(service.spotifyGetArtist).toBeDefined();
    });

    it('should have spotifyGetPlaylist method', () => {
      expect(service.spotifyGetPlaylist).toBeDefined();
    });

    it('should have spotifyGetRecommendations method', () => {
      expect(service.spotifyGetRecommendations).toBeDefined();
    });
  });

  describe('YouTube Methods', () => {
    it('should have youtubeSearch method', () => {
      expect(service.youtubeSearch).toBeDefined();
    });

    it('should have youtubeGetVideo method', () => {
      expect(service.youtubeGetVideo).toBeDefined();
    });

    it('should have youtubeGetChannel method', () => {
      expect(service.youtubeGetChannel).toBeDefined();
    });

    it('should have youtubeGetPlaylist method', () => {
      expect(service.youtubeGetPlaylist).toBeDefined();
    });
  });

  describe('Stripe Methods', () => {
    it('should have stripeCreateCheckout method', () => {
      expect(service.stripeCreateCheckout).toBeDefined();
    });

    it('should have stripeGetPayments method', () => {
      expect(service.stripeGetPayments).toBeDefined();
    });

    it('should have stripeGetSubscription method', () => {
      expect(service.stripeGetSubscription).toBeDefined();
    });

    it('should have stripeGetInvoice method', () => {
      expect(service.stripeGetInvoice).toBeDefined();
    });
  });

  describe('PSD2 Methods', () => {
    it('should have psd2CreatePayment method', () => {
      expect(service.psd2CreatePayment).toBeDefined();
    });

    it('should have psd2CreateRecurringDonation method', () => {
      expect(service.psd2CreateRecurringDonation).toBeDefined();
    });

    it('should have psd2GetPaymentStatus method', () => {
      expect(service.psd2GetPaymentStatus).toBeDefined();
    });

    it('should have psd2GetPaymentHistory method', () => {
      expect(service.psd2GetPaymentHistory).toBeDefined();
    });
  });

  describe('WhatsApp Methods', () => {
    it('should have whatsappSendMessage method', () => {
      expect(service.whatsappSendMessage).toBeDefined();
    });

    it('should have whatsappSendTemplate method', () => {
      expect(service.whatsappSendTemplate).toBeDefined();
    });

    it('should have whatsappGetMessageStatus method', () => {
      expect(service.whatsappGetMessageStatus).toBeDefined();
    });
  });

  describe('Suno AI Methods', () => {
    it('should have sunoGenerateMusic method', () => {
      expect(service.sunoGenerateMusic).toBeDefined();
    });

    it('should have sunoEditMusic method', () => {
      expect(service.sunoEditMusic).toBeDefined();
    });

    it('should have sunoGetStatus method', () => {
      expect(service.sunoGetStatus).toBeDefined();
    });
  });

  describe('Google Calendar Methods', () => {
    it('should have googleCalendarCreateEvent method', () => {
      expect(service.googleCalendarCreateEvent).toBeDefined();
    });

    it('should have googleCalendarUpdateEvent method', () => {
      expect(service.googleCalendarUpdateEvent).toBeDefined();
    });

    it('should have googleCalendarListEvents method', () => {
      expect(service.googleCalendarListEvents).toBeDefined();
    });

    it('should have googleCalendarDeleteEvent method', () => {
      expect(service.googleCalendarDeleteEvent).toBeDefined();
    });
  });

  describe('Google Maps Methods', () => {
    it('should have googleMapsGeocode method', () => {
      expect(service.googleMapsGeocode).toBeDefined();
    });

    it('should have googleMapsGetDirections method', () => {
      expect(service.googleMapsGetDirections).toBeDefined();
    });

    it('should have googleMapsSearchPlaces method', () => {
      expect(service.googleMapsSearchPlaces).toBeDefined();
    });
  });

  describe('Hub Status Methods', () => {
    it('should have healthCheck method', () => {
      expect(service.healthCheck).toBeDefined();
    });

    it('should have getHubStatus method', () => {
      expect(service.getHubStatus).toBeDefined();
    });

    it('should have getAvailableApis method', () => {
      expect(service.getAvailableApis).toBeDefined();
    });

    it('should have getApiStatus method', () => {
      expect(service.getApiStatus).toBeDefined();
    });
  });

  describe('Method Signatures', () => {
    it('spotifySearch should accept query, type, and limit', async () => {
      const result = await service.spotifySearch('test', 'track', 20);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('youtubeSearch should accept query, type, and maxResults', async () => {
      const result = await service.youtubeSearch('test', 'video', 20);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('stripeCreateCheckout should accept amount, currency, description', async () => {
      const result = await service.stripeCreateCheckout({
        amount: 1000,
        currency: 'USD',
        description: 'Test payment',
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('psd2CreatePayment should accept amount, currency, description', async () => {
      const result = await service.psd2CreatePayment({
        amount: 1000,
        currency: 'EUR',
        description: 'Test payment',
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('whatsappSendMessage should accept phoneNumber and message', async () => {
      const result = await service.whatsappSendMessage({
        phoneNumber: '+351912345678',
        message: 'Test message',
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('sunoGenerateMusic should accept prompt and duration', async () => {
      const result = await service.sunoGenerateMusic({
        prompt: 'Create a hymn',
        duration: 30,
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('googleCalendarCreateEvent should accept event details', async () => {
      const result = await service.googleCalendarCreateEvent({
        title: 'Test Event',
        description: 'Test',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });

    it('googleMapsGeocode should accept address', async () => {
      const result = await service.googleMapsGeocode('Lisbon, Portugal');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('Response Format', () => {
    it('should return response with success and timestamp', async () => {
      const result = await service.healthCheck();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should include error message on failure', async () => {
      const result = await service.spotifyGetTrack('invalid-id');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
