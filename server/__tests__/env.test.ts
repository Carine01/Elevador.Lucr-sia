import { describe, it, expect } from 'vitest';
import { ENV } from '../_core/env';

describe('Environment Configuration', () => {
  it('should have required environment variables', () => {
    expect(ENV).toBeDefined();
    expect(ENV.cookieSecret).toBeDefined();
    expect(ENV.databaseUrl).toBeDefined();
  });

  it('should set isProduction flag correctly', () => {
    expect(typeof ENV.isProduction).toBe('boolean');
  });

  it('should have OAuth configuration', () => {
    expect(ENV.oAuthServerUrl).toBeDefined();
    expect(ENV.ownerOpenId).toBeDefined();
  });

  it('should have Stripe configuration', () => {
    expect(ENV.STRIPE_SECRET_KEY).toBeDefined();
  });
});
