import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Essência da marca do usuário (para geração de conteúdo personalizado)
 */
export const brandEssence = mysqlTable("brandEssence", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  brandName: varchar("brandName", { length: 255 }).notNull(),
  brandDescription: text("brandDescription"),
  targetAudience: text("targetAudience"),
  brandValues: text("brandValues"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandEssence = typeof brandEssence.$inferSelect;
export type InsertBrandEssence = typeof brandEssence.$inferInsert;

/**
 * Histórico de gerações de conteúdo (posts, e-books, etc.)
 */
export const contentGeneration = mysqlTable("contentGeneration", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // 'post', 'ebook', 'ad', 'prompt'
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  metadata: text("metadata"), // JSON
  creditsUsed: int("creditsUsed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  typeIdx: index("type_idx").on(table.type),
  userTypeIdx: index("user_type_idx").on(table.userId, table.type),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export type ContentGeneration = typeof contentGeneration.$inferSelect;
export type InsertContentGeneration = typeof contentGeneration.$inferInsert;

/**
 * Diagnóstico do Radar de Bio (Lead Magnet)
 */
export const bioRadarDiagnosis = mysqlTable("bioRadarDiagnosis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
  instagramHandle: varchar("instagramHandle", { length: 255 }).notNull(),
  bioAnalysis: text("bioAnalysis"), // JSON com análise
  recommendations: text("recommendations"), // JSON com recomendações
  score: int("score"), // 0-100
  leadEmail: varchar("leadEmail", { length: 320 }),
  leadPhone: varchar("leadPhone", { length: 20 }),
  leadWhatsapp: varchar("leadWhatsapp", { length: 20 }),
  convertedToUser: int("convertedToUser").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("bioradar_user_id_idx").on(table.userId),
  createdAtIdx: index("bioradar_created_at_idx").on(table.createdAt),
  instagramHandleIdx: index("instagram_handle_idx").on(table.instagramHandle),
}));

export type BioRadarDiagnosis = typeof bioRadarDiagnosis.$inferSelect & { convertedToUser: boolean };
export type InsertBioRadarDiagnosis = typeof bioRadarDiagnosis.$inferInsert & { convertedToUser?: boolean };

/**
 * Tabela de Leads - Sistema de Captura e Gestão
 * Integra com sistema de lead scoring e regionalização
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Dados do Lead
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  
  // Segmentação
  service: varchar("service", { length: 100 }),
  profile: mysqlEnum("profile", ["sobrevivente", "acelerada", "visionaria"]),
  region: mysqlEnum("region", ["sudeste", "sul", "nordeste", "centro-oeste", "norte"]),
  
  // Status e Scoring
  status: mysqlEnum("status", ["novo", "em_contato", "agendado", "faturado", "perdido"])
    .default("novo")
    .notNull(),
  leadScore: int("leadScore").default(0),
  temperature: mysqlEnum("temperature", ["quente", "morno", "frio"]),
  
  // Rastreamento
  source: varchar("source", { length: 100 }),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  
  // Integração com Radar de Bio
  diagnosisScore: int("diagnosisScore"),
  bioRadarDiagnosisId: int("bioRadarDiagnosisId").references(() => bioRadarDiagnosis.id),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastContactedAt: timestamp("lastContactedAt"),
}, (table) => ({
  userIdIdx: index("lead_user_id_idx").on(table.userId),
  statusIdx: index("lead_status_idx").on(table.status),
  scoreIdx: index("lead_score_idx").on(table.leadScore),
  regionIdx: index("lead_region_idx").on(table.region),
  createdAtIdx: index("lead_created_at_idx").on(table.createdAt),
  emailIdx: index("lead_email_idx").on(table.email),
}));

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Tabela de Interações com Leads
 */
export const leadInteractions = mysqlTable("leadInteractions", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull().references(() => leads.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  type: mysqlEnum("type", ["call", "whatsapp", "email", "meeting", "note"]).notNull(),
  notes: text("notes"),
  outcome: varchar("outcome", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("interaction_lead_id_idx").on(table.leadId),
  typeIdx: index("interaction_type_idx").on(table.type),
  createdAtIdx: index("interaction_created_at_idx").on(table.createdAt),
}));

export type LeadInteraction = typeof leadInteractions.$inferSelect;
export type InsertLeadInteraction = typeof leadInteractions.$inferInsert;

/**
 * Tabela de Campanhas
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  name: varchar("name", { length: 255 }).notNull(),
  platform: mysqlEnum("platform", ["instagram", "facebook", "google", "tiktok", "other"]).notNull(),
  budget: int("budget"),
  objective: varchar("objective", { length: 100 }),
  
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  leads: int("leads").default(0),
  conversions: int("conversions").default(0),
  revenue: int("revenue").default(0),
  
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
  
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("campaign_user_id_idx").on(table.userId),
  statusIdx: index("campaign_status_idx").on(table.status),
  platformIdx: index("campaign_platform_idx").on(table.platform),
}));

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Plano de assinatura do usuário
 */
export const subscription = mysqlTable("subscription", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: mysqlEnum("plan", ["free", "pro", "pro_plus"]).default("free").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "cancelled"]).default("active").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  creditsRemaining: int("creditsRemaining").default(100).notNull(),
  monthlyCreditsLimit: int("monthlyCreditsLimit").default(100).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  renewalDate: timestamp("renewalDate"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("subscription_user_id_idx").on(table.userId),
  stripeCustomerIdx: index("stripe_customer_idx").on(table.stripeCustomerId),
  stripeSubscriptionIdx: index("stripe_subscription_idx").on(table.stripeSubscriptionId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Subscription = typeof subscription.$inferSelect;
export type InsertSubscription = typeof subscription.$inferInsert;