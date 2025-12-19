export interface AnalyticsEvent {
  event: string;
  userId?: number;
  data?: Record<string, any>;
  timestamp: Date;
}

// Lista de eventos rastreados
export const ANALYTICS_EVENTS = {
  // Autenticação
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_SIGNUP: 'user_signup',
  
  // Radar de Bio
  BIO_RADAR_ANALYZED: 'bio_radar_analyzed',
  BIO_RADAR_LEAD_CAPTURED: 'bio_radar_lead_captured',
  
  // Assinaturas
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_CANCELLED: 'checkout_cancelled',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Conteúdo
  EBOOK_GENERATED: 'ebook_generated',
  EBOOK_PDF_EXPORTED: 'ebook_pdf_exported',
  PROMPT_GENERATED: 'prompt_generated',
  AD_GENERATED: 'ad_generated',
  COVER_GENERATED: 'cover_generated',
  
  // Créditos
  CREDITS_CONSUMED: 'credits_consumed',
  CREDITS_INSUFFICIENT: 'credits_insufficient',
  CREDITS_RENEWED: 'credits_renewed',
} as const;

export function trackEvent(
  event: string,
  data?: Record<string, any>,
  userId?: number
): void {
  const analyticsEvent: AnalyticsEvent = {
    event,
    userId,
    data,
    timestamp: new Date(),
  };

  // Em desenvolvimento, apenas log
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', analyticsEvent);
    return;
  }

  // Em produção, enviar para serviço de analytics
  // Pode ser Google Analytics, Mixpanel, PostHog, etc.
  sendToAnalytics(analyticsEvent);
}

/**
 * Envia evento de analytics para o endpoint configurado em produção
 * 
 * Esta função é chamada internamente por trackEvent() apenas em produção.
 * Erros são capturados e logados sem interromper a aplicação, pois analytics
 * não deve afetar o fluxo principal do sistema.
 * 
 * @param event - Objeto do evento contendo tipo, dados, userId e timestamp
 * @returns Promise que resolve quando o evento é enviado (ou falha silenciosamente)
 */
async function sendToAnalytics(event: AnalyticsEvent): Promise<void> {
  try {
    // Exemplo: enviar para endpoint de analytics
    if (process.env.ANALYTICS_ENDPOINT) {
      await fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    }
  } catch (error) {
    // Não falhar a aplicação por erro de analytics
    console.error('[Analytics] Failed to send event:', error);
  }
}

// Helper para calcular taxa de conversão
export function calculateConversionRate(
  totalVisitors: number,
  conversions: number
): number {
  if (totalVisitors === 0) return 0;
  return (conversions / totalVisitors) * 100;
}
