import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index, date, json } from "drizzle-orm/mysql-core";

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

/**
 * Métricas diárias de uso
 */
export const dailyMetrics = mysqlTable("dailyMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  
  // Uso de créditos
  creditsUsed: int("creditsUsed").default(0),
  creditsByFeature: json("creditsByFeature").$type<Record<string, number>>(),
  
  // Eventos
  bioRadarAnalyses: int("bioRadarAnalyses").default(0),
  leadsCaptured: int("leadsCaptured").default(0),
  ebooksGenerated: int("ebooksGenerated").default(0),
  promptsGenerated: int("promptsGenerated").default(0),
  adsGenerated: int("adsGenerated").default(0),
  
  // Conversão
  checkoutsStarted: int("checkoutsStarted").default(0),
  checkoutsCompleted: int("checkoutsCompleted").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdDateIdx: index("metrics_user_date_idx").on(table.userId, table.date),
  dateIdx: index("metrics_date_idx").on(table.date),
}));

export type DailyMetrics = typeof dailyMetrics.$inferSelect;
export type InsertDailyMetrics = typeof dailyMetrics.$inferInsert;