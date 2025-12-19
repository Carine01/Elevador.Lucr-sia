/**
 * Feature Flags Tests
 * 
 * Testes para garantir que feature flags funcionam corretamente.
 */

import { describe, it, expect } from 'vitest';
import { FEATURES, requireFeature, isFeatureEnabled } from '../shared/featureFlags';

describe('Feature Flags', () => {
  it('LEADS_ENABLED está desabilitado por padrão', () => {
    expect(FEATURES.LEADS_ENABLED).toBe(false);
  });

  it('isFeatureEnabled retorna boolean correto', () => {
    expect(isFeatureEnabled('BIO_RADAR_ENABLED')).toBe(true);
    expect(isFeatureEnabled('LEADS_ENABLED')).toBe(false);
  });

  it('requireFeature lança erro quando feature está desabilitada', () => {
    expect(() => requireFeature('LEADS_ENABLED')).toThrow();
  });

  it('requireFeature não lança erro quando feature está habilitada', () => {
    expect(() => requireFeature('BIO_RADAR_ENABLED')).not.toThrow();
  });
});
