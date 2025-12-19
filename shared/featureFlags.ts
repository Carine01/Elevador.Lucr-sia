/**
 * Feature Flags - Controle de funcionalidades em produção
 * 
 * Este arquivo controla quais funcionalidades estão ativas.
 * Flags desabilitadas indicam recursos em desenvolvimento ou não prontos para produção.
 */

export const FEATURES = {
  /**
   * Sistema de Lead Management
   * 
   * Inclui:
   * - Tabela `leads` - Gestão de leads com scoring
   * - Tabela `leadInteractions` - Histórico de interações
   * - Tabela `campaigns` - Métricas de campanhas
   * 
   * Status: Schema pronto, implementação backend/frontend em desenvolvimento (PR #2)
   * 
   * @default false - Desabilitado até implementação completa
   */
  LEADS_ENABLED: process.env.FEATURE_LEADS === 'true',

  /**
   * Bio Radar - Lead Magnet
   * @default true - Funcionalidade ativa
   */
  BIO_RADAR_ENABLED: true,

  /**
   * Sistema de Monetização (Stripe)
   * @default true - Funcionalidade ativa
   */
  MONETIZATION_ENABLED: true,

  /**
   * Gerador de Conteúdo (E-books, Prompts, Anúncios)
   * @default true - Funcionalidade ativa
   */
  CONTENT_GENERATION_ENABLED: true,
} as const;

/**
 * Verifica se uma feature está habilitada
 * @throws Error se a feature estiver desabilitada
 */
export function requireFeature(featureName: keyof typeof FEATURES, customMessage?: string): void {
  if (!FEATURES[featureName]) {
    throw new Error(
      customMessage || 
      `Funcionalidade "${featureName}" ainda não está disponível em produção. Em desenvolvimento.`
    );
  }
}

/**
 * Verifica se uma feature está habilitada (retorna boolean)
 */
export function isFeatureEnabled(featureName: keyof typeof FEATURES): boolean {
  return FEATURES[featureName];
}
