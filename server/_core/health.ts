/**
 * Health Check Endpoint
 * 
 * Endpoint simples para monitoramento de uptime e status do servidor.
 * Base para integração com ferramentas de monitoramento externo.
 */

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  version?: string;
}

export function getHealthStatus(): HealthCheckResponse {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  };
}
