/**
 * APIS-HUB Client
 * 
 * Cliente para conectar CELEBRA com o APIS-HUB centralizado
 * Fornece acesso a todas as 11 APIs através de uma interface unificada
 */

// Configuration from environment variables
const APIS_HUB_URL = import.meta.env.VITE_PSD_HUB_URL || 'https://psd-billing.manus.space';
const APIS_HUB_KEY = import.meta.env.VITE_PSD_HUB_KEY || 'ChavePsd';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

class ApisHubClient {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string = APIS_HUB_URL, apiKey: string = APIS_HUB_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

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
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client': 'celebra',
      'X-Timestamp': new Date().toISOString(),
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error: error.error || `HTTP ${response.status}`,
          timestamp: new Date().toISOString(),
        };
      }

      const data = await response.json();

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
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ============ SPOTIFY ============
  async spotify = {
    search: async (query: string, type: 'track' | 'artist' | 'album' = 'track', limit = 20) => {
      return this.request(`/api/spotify/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
    },

    getTrack: async (id: string) => {
      return this.request(`/api/spotify/tracks/${id}`);
    },

    getArtist: async (id: string) => {
      return this.request(`/api/spotify/artists/${id}`);
    },

    getPlaylist: async (id: string) => {
      return this.request(`/api/spotify/playlists/${id}`);
    },

    getRecommendations: async (seedTracks: string[]) => {
      return this.request(`/api/spotify/recommendations?seed_tracks=${seedTracks.join(',')}`);
    },
  };

  // ============ YOUTUBE ============
  async youtube = {
    search: async (query: string, maxResults = 20) => {
      return this.request(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    },

    getVideo: async (id: string) => {
      return this.request(`/api/youtube/videos/${id}`);
    },

    getChannel: async (id: string) => {
      return this.request(`/api/youtube/channels/${id}`);
    },

    getPlaylist: async (id: string) => {
      return this.request(`/api/youtube/playlists/${id}`);
    },
  };

  // ============ SUNO AI ============
  async sunoAi = {
    generate: async (prompt: string, duration = 30) => {
      return this.request('/api/suno/generate', {
        method: 'POST',
        body: { prompt, duration },
      });
    },

    edit: async (id: string, prompt: string) => {
      return this.request('/api/suno/edit', {
        method: 'POST',
        body: { id, prompt },
      });
    },

    getStatus: async (id: string) => {
      return this.request(`/api/suno/status/${id}`);
    },
  };

  // ============ STRIPE ============
  async stripe = {
    createCheckout: async (items: any[], successUrl: string, cancelUrl: string) => {
      return this.request('/api/stripe/checkout', {
        method: 'POST',
        body: { items, successUrl, cancelUrl },
      });
    },

    getPaymentHistory: async (limit = 20) => {
      return this.request(`/api/stripe/history?limit=${limit}`);
    },

    getSubscriptionStatus: async () => {
      return this.request('/api/stripe/subscription');
    },

    cancelSubscription: async () => {
      return this.request('/api/stripe/subscription', {
        method: 'DELETE',
      });
    },

    getInvoice: async (id: string) => {
      return this.request(`/api/stripe/invoices/${id}`);
    },
  };

  // ============ PSD2 (PORTUGAL) ============
  async psd2 = {
    createPayment: async (amount: number, description: string, currency = 'EUR') => {
      return this.request('/api/psd2/payment', {
        method: 'POST',
        body: { amount, description, currency },
      });
    },

    createRecurringDonation: async (
      amount: number,
      frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual',
      description: string
    ) => {
      return this.request('/api/psd2/recurring', {
        method: 'POST',
        body: { amount, frequency, description },
      });
    },

    getPaymentStatus: async (id: string) => {
      return this.request(`/api/psd2/status/${id}`);
    },

    getPaymentHistory: async (limit = 20) => {
      return this.request(`/api/psd2/history?limit=${limit}`);
    },
  };

  // ============ WHATSAPP BUSINESS ============
  async whatsapp = {
    sendMessage: async (phoneNumber: string, message: string) => {
      return this.request('/api/whatsapp/send', {
        method: 'POST',
        body: { phoneNumber, message },
      });
    },

    sendTemplate: async (phoneNumber: string, templateName: string, parameters: string[]) => {
      return this.request('/api/whatsapp/template', {
        method: 'POST',
        body: { phoneNumber, templateName, parameters },
      });
    },

    getMessageStatus: async (id: string) => {
      return this.request(`/api/whatsapp/status/${id}`);
    },
  };

  // ============ GOOGLE CALENDAR ============
  async googleCalendar = {
    createEvent: async (
      title: string,
      description: string,
      startTime: Date,
      endTime: Date,
      attendees?: string[]
    ) => {
      return this.request('/api/google-calendar/create', {
        method: 'POST',
        body: {
          title,
          description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendees,
        },
      });
    },

    updateEvent: async (id: string, updates: Record<string, any>) => {
      return this.request(`/api/google-calendar/update/${id}`, {
        method: 'PUT',
        body: updates,
      });
    },

    listEvents: async (limit = 20) => {
      return this.request(`/api/google-calendar/list?limit=${limit}`);
    },

    deleteEvent: async (id: string) => {
      return this.request(`/api/google-calendar/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // ============ GOOGLE MAPS ============
  async googleMaps = {
    geocode: async (address: string) => {
      return this.request(`/api/google-maps/geocode?address=${encodeURIComponent(address)}`);
    },

    getDirections: async (origin: string, destination: string, mode = 'driving') => {
      return this.request(
        `/api/google-maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`
      );
    },

    searchPlaces: async (query: string, location?: { lat: number; lng: number }) => {
      let url = `/api/google-maps/places?query=${encodeURIComponent(query)}`;
      if (location) {
        url += `&lat=${location.lat}&lng=${location.lng}`;
      }
      return this.request(url);
    },
  };

  // ============ HEALTH CHECK ============
  async health() {
    return this.request('/api/health');
  }

  /**
   * Get Hub Status
   */
  async getHubStatus() {
    return this.request('/api/status');
  }

  /**
   * Get all available APIs
   */
  async getAvailableApis() {
    return this.request('/api/apis/list');
  }

  /**
   * Get specific API status
   */
  async getApiStatus(apiName: string) {
    return this.request(`/api/apis/${apiName}/status`);
  }

  // ============ ADMIN ============
  async admin = {
    getApiUsage: async () => {
      return this.request('/admin/usage');
    },

    getApiStatus: async () => {
      return this.request('/admin/status');
    },

    getCredentials: async () => {
      return this.request('/admin/credentials');
    },

    updateCredential: async (apiName: string, credential: Record<string, any>) => {
      return this.request('/admin/credentials', {
        method: 'PUT',
        body: { apiName, credential },
      });
    },
  };
}

// Singleton instance
export const apisHubClient = new ApisHubClient(APIS_HUB_URL, APIS_HUB_KEY);

// Export class for custom instances
export default ApisHubClient;

// React Hook for using APIS-HUB client
export function useApisHub() {
  return apisHubClient;
}
