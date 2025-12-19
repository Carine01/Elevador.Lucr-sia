/**
 * Meta Ads API Integration Utilities
 * Mapeamento de objetivos e configurações para a Meta Ads API
 */

// Objetivos disponíveis na Meta Ads API
export const META_OBJECTIVES = {
  OUTCOME_AWARENESS: "Reconhecimento de marca",
  OUTCOME_ENGAGEMENT: "Engajamento",
  OUTCOME_TRAFFIC: "Tráfego",
  OUTCOME_LEADS: "Geração de leads",
  OUTCOME_APP_PROMOTION: "Promoção de app",
  OUTCOME_SALES: "Vendas",
} as const;

export type MetaObjective = keyof typeof META_OBJECTIVES;

// Mapeamento de objetivos do sistema para Meta
export function mapObjectiveToMeta(userObjective: string): MetaObjective {
  const mapping: Record<string, MetaObjective> = {
    "trafego": "OUTCOME_TRAFFIC",
    "traffic": "OUTCOME_TRAFFIC",
    "leads": "OUTCOME_LEADS",
    "lead": "OUTCOME_LEADS",
    "vendas": "OUTCOME_SALES",
    "sales": "OUTCOME_SALES",
    "reconhecimento": "OUTCOME_AWARENESS",
    "awareness": "OUTCOME_AWARENESS",
    "engajamento": "OUTCOME_ENGAGEMENT",
    "engagement": "OUTCOME_ENGAGEMENT",
  };

  const normalized = userObjective.toLowerCase().trim();
  return mapping[normalized] || "OUTCOME_TRAFFIC";
}

// Tipos para Target Audience
export interface MetaTargetAudience {
  age_min?: number;
  age_max?: number;
  genders?: number[]; // 1 = male, 2 = female
  geo_locations?: {
    countries?: string[];
    cities?: Array<{
      key: string;
      radius?: number;
      distance_unit?: "mile" | "kilometer";
    }>;
  };
  interests?: Array<{
    id: string;
    name: string;
  }>;
}

// Interface para criação de campanha
export interface CreateMetaCampaignInput {
  campaign_name: string;
  objective: string;
  daily_budget: number; // em reais
  target_audience?: MetaTargetAudience;
}

// Interface para resposta da criação de campanha
export interface CreateMetaCampaignResponse {
  success: boolean;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  message: string;
  error?: string;
}

// Validar orçamento (mínimo R$ 10,00 por dia)
export function validateBudget(budget: number): boolean {
  return budget >= 10;
}

// Converter orçamento de reais para centavos (formato Meta API)
export function budgetToCents(budget: number): number {
  return Math.round(budget * 100);
}

// Interesses populares para clínicas de estética
export const POPULAR_INTERESTS = {
  BEAUTY: { id: "6003139266461", name: "Beauty" },
  SKIN_CARE: { id: "6003189043461", name: "Skin care" },
  COSMETICS: { id: "6003113684861", name: "Cosmetics" },
  HEALTH: { id: "6003397425279", name: "Health" },
  WELLNESS: { id: "6003020834693", name: "Wellness" },
} as const;
