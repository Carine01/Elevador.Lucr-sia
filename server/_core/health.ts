/**
 * Health Check Endpoint
 * 
 * Endpoint para monitoramento de uptime e status do servidor.
 * Verifica conexão com banco de dados e dependências críticas.
 */

import { getDb } from '../db';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  version?: string;
  database?: 'connected' | 'error';
  maintenance?: boolean;
}

/**
 * Health check que verifica dependências reais
 * Não apenas "API viva" - verifica se dependências críticas funcionam
 */
export async function getHealthStatus(): Promise<HealthCheckResponse> {
  const response: HealthCheckResponse = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    maintenance: process.env.MAINTENANCE_MODE === 'true',
  };

  // Verificar conexão com banco de dados
  try {
    const db = await getDb();
    if (db) {
      // Teste simples de conexão
      await db.execute('SELECT 1');
      response.database = 'connected';
    } else {
      response.database = 'error';
      response.status = 'error';
    }
  } catch (error) {
    response.database = 'error';
    response.status = 'error';
  }

  return response;
}

/**
 * Kill-switch global - Freio de emergência
 * Quando Stripe cai, banco engasga ou deploy dá ruim, você puxa o freio
 */
export function checkMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === 'true';
}
