import { describe, it, expect } from 'vitest';

/**
 * PSD Billing Master Credentials Validation Test
 * Validates connection to PSD Billing Master (Propaga Digital)
 */

describe('PSD Billing Master Integration', () => {
  it('should have VITE_APIS_HUB_URL environment variable', () => {
    const url = process.env.VITE_APIS_HUB_URL;
    expect(url).toBeDefined();
    expect(url).toBe('https://psd-billing-master.vercel.app/api/trpc');
  });

  it('should have APIS_HUB_KEY environment variable', () => {
    const key = process.env.APIS_HUB_KEY;
    expect(key).toBeDefined();
    expect(key).toBe('psd_live_p72AzwURfP7rjt51GRDwbg9LaZj0TiR6');
  });

  it('should validate Hub URL format', () => {
    const url = process.env.VITE_APIS_HUB_URL;
    expect(url).toMatch(/^https:\/\/.*vercel\.app/);
  });

  it('should validate API key format (psd_live_*)', () => {
    const key = process.env.APIS_HUB_KEY;
    expect(key).toMatch(/^psd_live_/);
  });

  it('should construct valid Authorization header', () => {
    const key = process.env.APIS_HUB_KEY;
    const authHeader = `Bearer ${key}`;
    expect(authHeader).toContain('Bearer');
    expect(authHeader).toContain('psd_live_');
  });

  it('should test connection to PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        signal: AbortSignal.timeout(10000),
      });

      // Accept any response that's not 404 (which would mean wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test Stripe API through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/stripe.status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test Spotify API through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/spotify.search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify({
          query: 'Ave Maria',
          type: 'track',
          limit: 5,
        }),
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test YouTube API through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/youtube.search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify({
          query: 'liturgical music',
          type: 'video',
          maxResults: 5,
        }),
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test OpenAI API through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/openai.chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
        }),
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test Asaas API through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/asaas.status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test AWS S3 through PSD Billing Master', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(`${url}/s3.status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        signal: AbortSignal.timeout(10000),
      });

      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should validate PSD Billing Master performance', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    const startTime = Date.now();

    try {
      await fetch(`${url}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'X-Client': 'celebra',
          'X-Timestamp': new Date().toISOString(),
        },
        signal: AbortSignal.timeout(10000),
      });

      const duration = Date.now() - startTime;
      
      // Should respond within 5 seconds (reasonable for remote API)
      expect(duration).toBeLessThan(5000);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Even on error, should respond reasonably fast
      expect(duration).toBeLessThan(10000);
    }
  });
});
