import { relations } from "drizzle-orm";
import { users, subscription, brandEssence, contentGeneration, bioRadarDiagnosis } from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscription, {
    fields: [users.id],
    references: [subscription.userId],
  }),
  brandEssence: many(brandEssence),
  contentGeneration: many(contentGeneration),
  bioRadarDiagnosis: many(bioRadarDiagnosis),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(users, {
    fields: [subscription.userId],
    references: [users.id],
  }),
}));

export const brandEssenceRelations = relations(brandEssence, ({ one }) => ({
  user: one(users, {
    fields: [brandEssence.userId],
    references: [users.id],
  }),
}));

export const contentGenerationRelations = relations(contentGeneration, ({ one }) => ({
  user: one(users, {
    fields: [contentGeneration.userId],
    references: [users.id],
  }),
}));

export const bioRadarDiagnosisRelations = relations(bioRadarDiagnosis, ({ one }) => ({
  user: one(users, {
    fields: [bioRadarDiagnosis.userId],
    references: [users.id],
  }),
}));
