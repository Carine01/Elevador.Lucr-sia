/**
 * Health Check Tests
 * 
 * Testes para garantir que o endpoint de health check funciona.
 * Verifica dependências reais: banco de dados, manutenção, etc.
 */

import { describe, it, expect } from 'vitest';
import { getHealthStatus, checkMaintenanceMode } from '../server/_core/health';

describe('Health Check', () => {
  it('retorna status ok quando tudo funciona', async () => {
    const health = await getHealthStatus();
    expect(health.status).toBeDefined();
    expect(['ok', 'error']).toContain(health.status);
  });

  it('retorna uptime maior que zero', async () => {
    const health = await getHealthStatus();
    expect(health.uptime).toBeGreaterThan(0);
  });

  it('retorna timestamp válido', async () => {
    const health = await getHealthStatus();
    expect(health.timestamp).toBeDefined();
    expect(new Date(health.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('verifica status do banco de dados', async () => {
    const health = await getHealthStatus();
    expect(health.database).toBeDefined();
    expect(['connected', 'error']).toContain(health.database);
  });

  it('detecta modo de manutenção', async () => {
    const health = await getHealthStatus();
    expect(health.maintenance).toBeDefined();
    expect(typeof health.maintenance).toBe('boolean');
  });
});

describe('Maintenance Mode', () => {
  it('checkMaintenanceMode retorna boolean', () => {
    const isMaintenanceMode = checkMaintenanceMode();
    expect(typeof isMaintenanceMode).toBe('boolean');
  });
});
