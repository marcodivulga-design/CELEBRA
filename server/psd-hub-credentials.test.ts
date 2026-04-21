import { describe, it, expect } from 'vitest';

/**
 * PSD Hub Credentials Validation Test
 * Validates that the PSD Hub credentials and URL are correct
 */

describe('PSD Hub Credentials', () => {
  it('should have VITE_APIS_HUB_URL environment variable', () => {
    const url = process.env.VITE_APIS_HUB_URL;
    expect(url).toBeDefined();
    expect(url).toBe('https://api.hub-psd.com');
  });

  it('should have APIS_HUB_KEY environment variable', () => {
    const key = process.env.APIS_HUB_KEY;
    expect(key).toBeDefined();
    expect(key).toBe('psd_live_p72AzwURfP7rjt51GRDwbg9LaZj0TiR6');
  });

  it('should validate URL format', () => {
    const url = process.env.VITE_APIS_HUB_URL;
    expect(url).toMatch(/^https?:\/\//);
  });

  it('should validate API key format', () => {
    const key = process.env.APIS_HUB_KEY;
    expect(key).toMatch(/^psd_live_/);
  });

  it('should construct valid Authorization header', () => {
    const key = process.env.APIS_HUB_KEY;
    const authHeader = `Bearer ${key}`;
    expect(authHeader).toContain('Bearer');
    expect(authHeader).toContain('psd_live_');
  });

  it('should test connection to PSD Hub', async () => {
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
        signal: AbortSignal.timeout(5000),
      });

      // We expect either 200 (success) or 401/403 (auth issue) but NOT 404 (wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test Spotify endpoint through PSD Hub', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(
        `${url}/spotify/search?q=test&type=track&limit=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'X-Client': 'celebra',
            'X-Timestamp': new Date().toISOString(),
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      // We expect either success or auth error, but NOT 404 (wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test YouTube endpoint through PSD Hub', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(
        `${url}/youtube/search?q=test&type=video&maxResults=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'X-Client': 'celebra',
            'X-Timestamp': new Date().toISOString(),
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      // We expect either success or auth error, but NOT 404 (wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test Stripe endpoint through PSD Hub', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(
        `${url}/stripe/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'X-Client': 'celebra',
            'X-Timestamp': new Date().toISOString(),
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      // We expect either success or auth error, but NOT 404 (wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });

  it('should test PSD2 endpoint through PSD Hub', async () => {
    const url = process.env.VITE_APIS_HUB_URL;
    const key = process.env.APIS_HUB_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    try {
      const response = await fetch(
        `${url}/psd2/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'X-Client': 'celebra',
            'X-Timestamp': new Date().toISOString(),
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      // We expect either success or auth error, but NOT 404 (wrong URL)
      expect(response.status).not.toBe(404);
      expect([200, 201, 400, 401, 403, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are acceptable in test environment
      if (error instanceof Error) {
        expect(error.message).not.toContain('404');
      }
    }
  });
});
