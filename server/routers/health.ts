/**
 * Health Check Router
 * Endpoint público para monitoramento de sistema
 */

import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { readFileSync } from 'fs';
import { join } from 'path';

// Read version from package.json
let appVersion = '1.0.0';
try {
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
  );
  appVersion = packageJson.version || '1.0.0';
} catch (error) {
  console.warn('Could not read version from package.json, using default');
}

export const healthRouter = router({
  check: publicProcedure.query(async () => {
    const timestamp = new Date().toISOString();
    
    // Verificar conexão com banco de dados
    let dbStatus = 'unknown';
    try {
      const db = await getDb();
      if (db) {
        // Fazer uma query simples para testar conexão
        await db.execute('SELECT 1');
        dbStatus = 'connected';
      } else {
        dbStatus = 'disconnected';
      }
    } catch (error) {
      dbStatus = 'error';
      console.error('Database health check failed:', error);
    }

    return {
      status: 'healthy',
      timestamp,
      version: appVersion,
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
  }),
});
