/**
 * PSD Hub Service
 * 
 * Provides secure server-side proxy to the remote PSD Hub
 * Handles authentication, validation, caching, and error handling
 * All external API calls go through this service
 */

import { getDb } from '../db';
import { z } from 'zod';

const PSD_HUB_URL = process.env.PSD_HUB_URL || 'https://psd-billing.manus.space';
const PSD_HUB_KEY = process.env.PSD_HUB_KEY || 'ChavePsd';
const PSD_LIVE_KEY = process.env.PSD_LIVE_KEY || '';

interface PsdHubResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

interface CacheEntry<T> {
  data: PsdHubResponse<T>;
  timestamp: number;
}

/**
 * PSD Hub Service
 * Manages all communication with the remote PSD Hub
 */
export class PsdHubService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private requestTimeout = 30000; // 30 seconds

  /**
   * Make authenticated request to PSD Hub
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PsdHubResponse<T>> {
    const url = `${PSD_HUB_URL}${endpoint}`;
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PSD_HUB_KEY}`,
      'X-Client': 'celebra',
      'X-Timestamp': new Date().toISOString(),
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.error || `HTTP ${response.status}`,
          code: `HTTP_${response.status}`,
          timestamp: new Date().toISOString(),
        };
      }

      const data: PsdHubResponse<T> = await response.json();

      // Cache successful GET responses
      if (data.success && (!options.method || options.method === 'GET')) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: message,
        code: 'REQUEST_FAILED',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Health check - verify Hub connectivity
   */
  async healthCheck(): Promise<PsdHubResponse> {
    return this.request('/api/health');
  }

  /**
   * Get Hub status
   */
  async getHubStatus(): Promise<PsdHubResponse> {
    return this.request('/api/status');
  }

  /**
   * Get all available APIs
   */
  async getAvailableApis(): Promise<PsdHubResponse> {
    return this.request('/api/apis/list');
  }

  /**
   * Get specific API status
   */
  async getApiStatus(apiName: string): Promise<PsdHubResponse> {
    return this.request(`/api/apis/${apiName}/status`);
  }

  // ============ SPOTIFY ============

  /**
   * Search Spotify for music
   */
  async spotifySearch(
    query: string,
    type: 'track' | 'artist' | 'album' = 'track',
    limit = 20
  ): Promise<PsdHubResponse> {
    const params = new URLSearchParams({
      q: query,
      type,
      limit: String(limit),
    });

    return this.request(`/api/spotify/search?${params.toString()}`);
  }

  /**
   * Get Spotify track details
   */
  async spotifyGetTrack(trackId: string): Promise<PsdHubResponse> {
    return this.request(`/api/spotify/tracks/${trackId}`);
  }

  /**
   * Get Spotify artist details
   */
  async spotifyGetArtist(artistId: string): Promise<PsdHubResponse> {
    return this.request(`/api/spotify/artists/${artistId}`);
  }

  /**
   * Get Spotify playlist details
   */
  async spotifyGetPlaylist(playlistId: string): Promise<PsdHubResponse> {
    return this.request(`/api/spotify/playlists/${playlistId}`);
  }

  /**
   * Get Spotify recommendations
   */
  async spotifyGetRecommendations(seedTracks: string[]): Promise<PsdHubResponse> {
    const params = new URLSearchParams({
      seed_tracks: seedTracks.join(','),
    });

    return this.request(`/api/spotify/recommendations?${params.toString()}`);
  }

  // ============ YOUTUBE ============

  /**
   * Search YouTube for videos
   */
  async youtubeSearch(
    query: string,
    type: 'video' | 'playlist' | 'channel' = 'video',
    maxResults = 20
  ): Promise<PsdHubResponse> {
    const params = new URLSearchParams({
      q: query,
      type,
      maxResults: String(maxResults),
    });

    return this.request(`/api/youtube/search?${params.toString()}`);
  }

  /**
   * Get YouTube video details
   */
  async youtubeGetVideo(videoId: string): Promise<PsdHubResponse> {
    return this.request(`/api/youtube/videos/${videoId}`);
  }

  /**
   * Get YouTube channel details
   */
  async youtubeGetChannel(channelId: string): Promise<PsdHubResponse> {
    return this.request(`/api/youtube/channels/${channelId}`);
  }

  /**
   * Get YouTube playlist details
   */
  async youtubeGetPlaylist(playlistId: string): Promise<PsdHubResponse> {
    return this.request(`/api/youtube/playlists/${playlistId}`);
  }

  // ============ STRIPE ============

  /**
   * Create Stripe checkout session
   */
  async stripeCreateCheckout(params: {
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, string>;
  }): Promise<PsdHubResponse> {
    return this.request('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get Stripe payment history
   */
  async stripeGetPayments(limit = 20): Promise<PsdHubResponse> {
    return this.request(`/api/stripe/payments?limit=${limit}`);
  }

  /**
   * Get Stripe subscription status
   */
  async stripeGetSubscription(): Promise<PsdHubResponse> {
    return this.request('/api/stripe/subscription');
  }

  /**
   * Get Stripe invoice
   */
  async stripeGetInvoice(invoiceId: string): Promise<PsdHubResponse> {
    return this.request(`/api/stripe/invoices/${invoiceId}`);
  }

  // ============ PSD2 (PORTUGAL) ============

  /**
   * Create PSD2 payment
   */
  async psd2CreatePayment(params: {
    amount: number;
    currency: string;
    description: string;
  }): Promise<PsdHubResponse> {
    return this.request('/api/psd2/payment', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Create PSD2 recurring donation
   */
  async psd2CreateRecurringDonation(params: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
    description: string;
  }): Promise<PsdHubResponse> {
    return this.request('/api/psd2/recurring', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get PSD2 payment status
   */
  async psd2GetPaymentStatus(paymentId: string): Promise<PsdHubResponse> {
    return this.request(`/api/psd2/status/${paymentId}`);
  }

  /**
   * Get PSD2 payment history
   */
  async psd2GetPaymentHistory(limit = 20): Promise<PsdHubResponse> {
    return this.request(`/api/psd2/history?limit=${limit}`);
  }

  // ============ WHATSAPP BUSINESS ============

  /**
   * Send WhatsApp message
   */
  async whatsappSendMessage(params: {
    phoneNumber: string;
    message: string;
  }): Promise<PsdHubResponse> {
    return this.request('/api/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Send WhatsApp template message
   */
  async whatsappSendTemplate(params: {
    phoneNumber: string;
    templateName: string;
    parameters: string[];
  }): Promise<PsdHubResponse> {
    return this.request('/api/whatsapp/template', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get WhatsApp message status
   */
  async whatsappGetMessageStatus(messageId: string): Promise<PsdHubResponse> {
    return this.request(`/api/whatsapp/status/${messageId}`);
  }

  // ============ SUNO AI ============

  /**
   * Generate music with Suno AI
   */
  async sunoGenerateMusic(params: {
    prompt: string;
    duration?: number;
  }): Promise<PsdHubResponse> {
    return this.request('/api/suno/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Edit Suno AI music
   */
  async sunoEditMusic(params: {
    id: string;
    prompt: string;
  }): Promise<PsdHubResponse> {
    return this.request('/api/suno/edit', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get Suno AI generation status
   */
  async sunoGetStatus(generationId: string): Promise<PsdHubResponse> {
    return this.request(`/api/suno/status/${generationId}`);
  }

  // ============ GOOGLE CALENDAR ============

  /**
   * Create Google Calendar event
   */
  async googleCalendarCreateEvent(params: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    attendees?: string[];
  }): Promise<PsdHubResponse> {
    return this.request('/api/google-calendar/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Update Google Calendar event
   */
  async googleCalendarUpdateEvent(
    eventId: string,
    updates: Record<string, any>
  ): Promise<PsdHubResponse> {
    return this.request(`/api/google-calendar/update/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * List Google Calendar events
   */
  async googleCalendarListEvents(limit = 20): Promise<PsdHubResponse> {
    return this.request(`/api/google-calendar/list?limit=${limit}`);
  }

  /**
   * Delete Google Calendar event
   */
  async googleCalendarDeleteEvent(eventId: string): Promise<PsdHubResponse> {
    return this.request(`/api/google-calendar/${eventId}`, {
      method: 'DELETE',
    });
  }

  // ============ GOOGLE MAPS ============

  /**
   * Geocode address
   */
  async googleMapsGeocode(address: string): Promise<PsdHubResponse> {
    const params = new URLSearchParams({ address });
    return this.request(`/api/google-maps/geocode?${params.toString()}`);
  }

  /**
   * Get directions
   */
  async googleMapsGetDirections(
    origin: string,
    destination: string,
    mode = 'driving'
  ): Promise<PsdHubResponse> {
    const params = new URLSearchParams({ origin, destination, mode });
    return this.request(`/api/google-maps/directions?${params.toString()}`);
  }

  /**
   * Search places
   */
  async googleMapsSearchPlaces(
    query: string,
    location?: { lat: number; lng: number }
  ): Promise<PsdHubResponse> {
    let url = `/api/google-maps/places?query=${encodeURIComponent(query)}`;
    if (location) {
      url += `&lat=${location.lat}&lng=${location.lng}`;
    }
    return this.request(url);
  }

  // ============ CACHE MANAGEMENT ============

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      entries: Array.from(this.cache.keys()) as string[],
    };
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(endpoint: string): void {
    const entriesToDelete: string[] = [];
    for (const [key] of this.cache.entries()) {
      if (key.startsWith(endpoint)) {
        entriesToDelete.push(key);
      }
    }
    entriesToDelete.forEach(key => this.cache.delete(key));
  }
}

// Singleton instance
export const psdHubService = new PsdHubService();

/**
 * Get PSD Hub Service instance
 */
export function getPsdHubService(): PsdHubService {
  return psdHubService;
}
