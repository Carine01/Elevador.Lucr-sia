/**
 * Sistema de Logging Centralizado
 * BUG-005: Substituir console.log em produção
 */

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  info(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta || '');
    }
  }

  error(message: string, error?: any) {
    const errorInfo = {
      message: error?.message || String(error),
      stack: this.isDevelopment ? error?.stack : undefined,
      timestamp: new Date().toISOString(),
    };

    console.error(`[ERROR] ${message}`, errorInfo);

    // Em produção, aqui você poderia enviar para Sentry, LogRocket, etc
    // if (!this.isDevelopment) {
    //   Sentry.captureException(error, { extra: { message } });
    // }
  }

  warn(message: string, meta?: LogMeta) {
    console.warn(`[WARN] ${message}`, meta || '');
  }

  debug(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
}

export const logger = new Logger();
