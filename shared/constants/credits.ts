/**
 * Shared constants for credit system
 * Used by both frontend and backend to ensure consistency
 */

export const PLAN_CREDITS = {
  free: 1,
  pro: 10,
  pro_plus: 999999, // Unlimited
} as const;

export type PlanType = keyof typeof PLAN_CREDITS;
