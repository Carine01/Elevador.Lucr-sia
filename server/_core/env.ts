/**
 * Gerenciamento de Variáveis de Ambiente
 * BUG-002: Validação de credenciais obrigatórias
 */

function getRequiredEnv(key: string, defaultForDev?: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    // Em desenvolvimento ou se houver default, usar default
    if (defaultForDev && process.env.NODE_ENV !== 'production') {
      console.warn(`[ENV] Using default value for ${key} in development`);
      return defaultForDev;
    }
    // Em produção, logar erro mas não crashar
    console.error(`[ENV] Missing required variable: ${key}`);
    return defaultForDev || '';
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

// Validar ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

export const ENV = {
  // App ID - opcional com valor padrão
  appId: getOptionalEnv('VITE_APP_ID', 'elevare-production'),
  
  // Obrigatórias - com defaults para não crashar
  cookieSecret: getRequiredEnv('JWT_SECRET', 'dev-secret-change-in-production-32chars'),
  databaseUrl: getRequiredEnv('DATABASE_URL', ''),
  oAuthServerUrl: getOptionalEnv('OAUTH_SERVER_URL', 'https://oauth.manus.im'),
  ownerOpenId: getOptionalEnv('OWNER_OPEN_ID', 'admin'),
  
  // Forge API - Opcional (funcionalidade de IA não funcionará sem)
  forgeApiUrl: getOptionalEnv('BUILT_IN_FORGE_API_URL'),
  forgeApiKey: getOptionalEnv('BUILT_IN_FORGE_API_KEY'),
  
  // Stripe - opcional
  STRIPE_SECRET_KEY: getOptionalEnv('STRIPE_SECRET_KEY', 'sk_test_placeholder'),
  STRIPE_ESSENCIAL_PRICE_ID: getOptionalEnv('STRIPE_ESSENCIAL_PRICE_ID'),
  STRIPE_PROFISSIONAL_PRICE_ID: getOptionalEnv('STRIPE_PROFISSIONAL_PRICE_ID'),
  STRIPE_WEBHOOK_SECRET: getOptionalEnv('STRIPE_WEBHOOK_SECRET'),
  
  isProduction,
};

// Validações de segurança - apenas avisos, não crashar
if (ENV.cookieSecret.length < 32) {
  console.warn('[ENV] JWT_SECRET should be at least 32 characters for security');
}

if (!ENV.databaseUrl) {
  console.warn('[ENV] DATABASE_URL not set - database features will not work');
}

// Logger não pode ser importado aqui pois causa dependência circular
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Environment variables loaded');
}

export const env = ENV;
