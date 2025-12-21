/**
 * Gerenciamento de Variáveis de Ambiente
 * BUG-002: Validação de credenciais obrigatórias
 */

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `❌ ERRO CRÍTICO: Variável de ambiente obrigatória '${key}' não está definida.\n` +
      `   Configure no arquivo .env antes de iniciar a aplicação.`
    );
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

// Validar ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

export const ENV = {
  // Obrigatórias em todos os ambientes
  appId: getRequiredEnv('VITE_APP_ID'),
  cookieSecret: getRequiredEnv('JWT_SECRET'),
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  oAuthServerUrl: getRequiredEnv('OAUTH_SERVER_URL'),
  ownerOpenId: getRequiredEnv('OWNER_OPEN_ID'),
  
  // Obrigatórias apenas em produção
  forgeApiUrl: isProduction 
    ? getRequiredEnv('BUILT_IN_FORGE_API_URL')
    : getOptionalEnv('BUILT_IN_FORGE_API_URL'),
  forgeApiKey: isProduction
    ? getRequiredEnv('BUILT_IN_FORGE_API_KEY')
    : getOptionalEnv('BUILT_IN_FORGE_API_KEY'),
  
  // Stripe - obrigatório em produção
  STRIPE_SECRET_KEY: isProduction
    ? getRequiredEnv('STRIPE_SECRET_KEY')
    : getOptionalEnv('STRIPE_SECRET_KEY'),
  STRIPE_ESSENCIAL_PRICE_ID: getOptionalEnv('STRIPE_ESSENCIAL_PRICE_ID'),
  STRIPE_PROFISSIONAL_PRICE_ID: getOptionalEnv('STRIPE_PROFISSIONAL_PRICE_ID'),
  STRIPE_WEBHOOK_SECRET: isProduction
    ? getRequiredEnv('STRIPE_WEBHOOK_SECRET')
    : getOptionalEnv('STRIPE_WEBHOOK_SECRET'),
  
  isProduction,
};

// Validações adicionais de segurança
if (ENV.cookieSecret.length < 32) {
  throw new Error(
    '❌ JWT_SECRET deve ter no mínimo 32 caracteres para segurança adequada'
  );
}

// Logger não pode ser importado aqui pois causa dependência circular
// Usar console.log apenas neste caso específico de inicialização
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Todas as variáveis de ambiente obrigatórias foram validadas');
}

export const env = ENV;
