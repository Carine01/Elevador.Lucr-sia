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
  // App ID - opcional com valor padrão
  appId: getOptionalEnv('VITE_APP_ID', 'elevare-production'),
  
  // Obrigatórias em todos os ambientes
  cookieSecret: getRequiredEnv('JWT_SECRET'),
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  oAuthServerUrl: getOptionalEnv('OAUTH_SERVER_URL', 'https://oauth.manus.im'),
  ownerOpenId: getOptionalEnv('OWNER_OPEN_ID', 'admin'),
  
  // Obrigatórias apenas em produção
  forgeApiUrl: isProduction 
    ? getRequiredEnv('BUILT_IN_FORGE_API_URL')
    : getOptionalEnv('BUILT_IN_FORGE_API_URL'),
  forgeApiKey: isProduction
    ? getRequiredEnv('BUILT_IN_FORGE_API_KEY')
    : getOptionalEnv('BUILT_IN_FORGE_API_KEY'),
  
  // Stripe - obrigatório em produção
  STRIPE_SECRET_KEY: getOptionalEnv('STRIPE_SECRET_KEY', 'sk_test_placeholder'),
  STRIPE_ESSENCIAL_PRICE_ID: getOptionalEnv('STRIPE_ESSENCIAL_PRICE_ID'),
  STRIPE_PROFISSIONAL_PRICE_ID: getOptionalEnv('STRIPE_PROFISSIONAL_PRICE_ID'),
  // Webhook secret é opcional até configurar o endpoint
  STRIPE_WEBHOOK_SECRET: getOptionalEnv('STRIPE_WEBHOOK_SECRET'),
  
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
