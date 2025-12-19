/**
 * Health Check Tests
 * 
 * Testes básicos para garantir que o endpoint de health check funciona.
 * Base para expansão de cobertura de testes.
 */

import { describe, it, expect } from 'vitest';
import { getHealthStatus } from '../server/_core/health';

describe('Health Check', () => {
  it('retorna status ok', () => {
    const health = getHealthStatus();
    expect(health.status).toBe('ok');
  });

  it('retorna uptime maior que zero', () => {
    const health = getHealthStatus();
    expect(health.uptime).toBeGreaterThan(0);
  });

  it('retorna timestamp válido', () => {
    const health = getHealthStatus();
    expect(health.timestamp).toBeDefined();
    expect(new Date(health.timestamp).toString()).not.toBe('Invalid Date');
  });
});
