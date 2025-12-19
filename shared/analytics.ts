/**
 * Analytics tracking utilities
 * Simple event tracking system that can be extended with real analytics services
 */

export const ANALYTICS_EVENTS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  WELCOME_TOUR_STARTED: 'welcome_tour_started',
  WELCOME_TOUR_COMPLETED: 'welcome_tour_completed',
  BIO_RADAR_TUTORIAL_COMPLETED: 'bio_radar_tutorial_completed',
  FIRST_EBOOK_GENERATED: 'first_ebook_generated',
  FIRST_PROMPT_GENERATED: 'first_prompt_generated',
  PROFILE_COMPLETED: 'profile_completed',
} as const;

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

export function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, any> = {},
  userId?: number
): void {
  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, { userId, ...properties });
    return;
  }

  // In production, integrate with analytics service
  // Examples: Google Analytics, Mixpanel, Segment, etc.
  try {
    // TODO: Add real analytics integration
    // Example:
    // analytics.track(event, { userId, ...properties });
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}
