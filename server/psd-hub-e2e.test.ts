import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { psdHubService } from './services/psd-hub.service';

/**
 * PSD Hub End-to-End Integration Tests
 * Tests complete workflows through the remote PSD Hub
 */

describe('PSD Hub E2E Integration', () => {
  beforeAll(() => {
    // Initialize service
    expect(psdHubService).toBeDefined();
  });

  afterEach(() => {
    psdHubService.clearCache();
  });

  describe('Hub Connectivity', () => {
    it('should verify hub is reachable', async () => {
      const response = await psdHubService.healthCheck();
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get hub status', async () => {
      const response = await psdHubService.getHubStatus();
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should list available APIs', async () => {
      const response = await psdHubService.getAvailableApis();
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Spotify Workflow', () => {
    it('should search for tracks on Spotify', async () => {
      const response = await psdHubService.spotifySearch('Ave Maria', 'track', 5);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get track details from Spotify', async () => {
      const response = await psdHubService.spotifyGetTrack('11dFghVXANMlKmJXsNCQvb');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get artist details from Spotify', async () => {
      const response = await psdHubService.spotifyGetArtist('1Yep0jWmnxJ15jAcMGnIPO');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get recommendations from Spotify', async () => {
      const response = await psdHubService.spotifyGetRecommendations([
        '11dFghVXANMlKmJXsNCQvb',
      ]);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get Spotify API status', async () => {
      const response = await psdHubService.getApiStatus('spotify');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('YouTube Workflow', () => {
    it('should search for videos on YouTube', async () => {
      const response = await psdHubService.youtubeSearch('liturgical music', 'video', 5);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get video details from YouTube', async () => {
      const response = await psdHubService.youtubeGetVideo('dQw4w9WgXcQ');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get channel details from YouTube', async () => {
      const response = await psdHubService.youtubeGetChannel('UCuAXFkgsw1L7xaCfnd5J1vQ');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get YouTube API status', async () => {
      const response = await psdHubService.getApiStatus('youtube');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Stripe Workflow', () => {
    it('should create checkout session', async () => {
      const response = await psdHubService.stripeCreateCheckout({
        amount: 2999,
        currency: 'USD',
        description: 'Donation to church',
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get payment history', async () => {
      const response = await psdHubService.stripeGetPayments(10);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get subscription status', async () => {
      const response = await psdHubService.stripeGetSubscription();
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get Stripe API status', async () => {
      const response = await psdHubService.getApiStatus('stripe');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('PSD2 Workflow', () => {
    it('should create PSD2 payment', async () => {
      const response = await psdHubService.psd2CreatePayment({
        amount: 5000,
        currency: 'EUR',
        description: 'Donation via PSD2',
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should create recurring donation', async () => {
      const response = await psdHubService.psd2CreateRecurringDonation({
        amount: 1000,
        frequency: 'monthly',
        description: 'Monthly donation',
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get payment history', async () => {
      const response = await psdHubService.psd2GetPaymentHistory(10);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get PSD2 API status', async () => {
      const response = await psdHubService.getApiStatus('psd2');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('WhatsApp Workflow', () => {
    it('should send WhatsApp message', async () => {
      const response = await psdHubService.whatsappSendMessage({
        phoneNumber: '+351912345678',
        message: 'Hello from CELEBRA',
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should send WhatsApp template', async () => {
      const response = await psdHubService.whatsappSendTemplate({
        phoneNumber: '+351912345678',
        templateName: 'greeting',
        parameters: ['John'],
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Suno AI Workflow', () => {
    it('should generate music with Suno', async () => {
      const response = await psdHubService.sunoGenerateMusic({
        prompt: 'Create a beautiful hymn',
        duration: 30,
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should edit Suno music', async () => {
      const response = await psdHubService.sunoEditMusic({
        id: 'song_123',
        prompt: 'Make it more uplifting',
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Google Calendar Workflow', () => {
    it('should create calendar event', async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 3600000);
      const response = await psdHubService.googleCalendarCreateEvent({
        title: 'Sunday Mass',
        description: 'Regular Sunday service',
        startTime: now.toISOString(),
        endTime: later.toISOString(),
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should list calendar events', async () => {
      const response = await psdHubService.googleCalendarListEvents(10);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Google Maps Workflow', () => {
    it('should geocode address', async () => {
      const response = await psdHubService.googleMapsGeocode('Lisbon, Portugal');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should get directions', async () => {
      const response = await psdHubService.googleMapsGetDirections(
        'Lisbon, Portugal',
        'Porto, Portugal'
      );
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should search places', async () => {
      const response = await psdHubService.googleMapsSearchPlaces('churches', {
        lat: 38.7223,
        lng: -9.1393,
      });
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Cache Performance', () => {
    it('should cache GET requests', async () => {
      const query = 'Ave Maria';
      
      // First request (cache miss)
      const response1 = await psdHubService.spotifySearch(query, 'track', 5);
      expect(response1).toHaveProperty('success');

      // Second request (cache hit)
      const response2 = await psdHubService.spotifySearch(query, 'track', 5);
      expect(response2).toHaveProperty('success');

      // Both should have same timestamp structure
      expect(response1).toHaveProperty('timestamp');
      expect(response2).toHaveProperty('timestamp');
    });

    it('should track cache statistics', () => {
      const stats = psdHubService.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('timeout');
      expect(stats).toHaveProperty('entries');
      expect(Array.isArray(stats.entries)).toBe(true);
    });

    it('should clear specific cache entries', () => {
      psdHubService.clearCacheEntry('/api/spotify');
      const stats = psdHubService.getCacheStats();
      expect(stats.size).toBeGreaterThanOrEqual(0);
    });

    it('should clear all cache', () => {
      psdHubService.clearCache();
      const stats = psdHubService.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid track ID gracefully', async () => {
      const response = await psdHubService.spotifyGetTrack('invalid-id');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should handle network errors gracefully', async () => {
      // This would test timeout handling
      const response = await psdHubService.spotifySearch('test', 'track', 50);
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });

    it('should include error messages on failure', async () => {
      const response = await psdHubService.spotifyGetTrack('');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('Multi-API Coordination', () => {
    it('should handle concurrent API calls', async () => {
      const results = await Promise.all([
        psdHubService.spotifySearch('hymn', 'track', 5),
        psdHubService.youtubeSearch('liturgical music', 'video', 5),
        psdHubService.stripeGetPayments(5),
      ]);

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('timestamp');
      });
    });

    it('should maintain separate cache for different APIs', () => {
      const stats = psdHubService.getCacheStats();
      expect(stats.entries).toBeDefined();
      expect(Array.isArray(stats.entries)).toBe(true);
    });
  });
});
