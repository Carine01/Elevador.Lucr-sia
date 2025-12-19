CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('instagram','facebook','google','tiktok','other') NOT NULL,
	`budget` int,
	`objective` varchar(100),
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`leads` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`revenue` int DEFAULT 0,
	`status` enum('active','paused','completed') NOT NULL DEFAULT 'active',
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadInteractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('call','whatsapp','email','meeting','note') NOT NULL,
	`notes` text,
	`outcome` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadInteractions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`service` varchar(100),
	`profile` enum('sobrevivente','acelerada','visionaria'),
	`region` enum('sudeste','sul','nordeste','centro-oeste','norte'),
	`status` enum('novo','em_contato','agendado','faturado','perdido') NOT NULL DEFAULT 'novo',
	`leadScore` int DEFAULT 0,
	`temperature` enum('quente','morno','frio'),
	`source` varchar(100),
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`diagnosisScore` int,
	`bioRadarDiagnosisId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastContactedAt` timestamp,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadInteractions` ADD CONSTRAINT `leadInteractions_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadInteractions` ADD CONSTRAINT `leadInteractions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_bioRadarDiagnosisId_bioRadarDiagnosis_id_fk` FOREIGN KEY (`bioRadarDiagnosisId`) REFERENCES `bioRadarDiagnosis`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `campaign_user_id_idx` ON `campaigns` (`userId`);--> statement-breakpoint
CREATE INDEX `campaign_status_idx` ON `campaigns` (`status`);--> statement-breakpoint
CREATE INDEX `campaign_platform_idx` ON `campaigns` (`platform`);--> statement-breakpoint
CREATE INDEX `interaction_lead_id_idx` ON `leadInteractions` (`leadId`);--> statement-breakpoint
CREATE INDEX `interaction_type_idx` ON `leadInteractions` (`type`);--> statement-breakpoint
CREATE INDEX `interaction_created_at_idx` ON `leadInteractions` (`createdAt`);--> statement-breakpoint
CREATE INDEX `lead_user_id_idx` ON `leads` (`userId`);--> statement-breakpoint
CREATE INDEX `lead_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `lead_score_idx` ON `leads` (`leadScore`);--> statement-breakpoint
CREATE INDEX `lead_region_idx` ON `leads` (`region`);--> statement-breakpoint
CREATE INDEX `lead_created_at_idx` ON `leads` (`createdAt`);--> statement-breakpoint
CREATE INDEX `lead_email_idx` ON `leads` (`email`);--> statement-breakpoint
CREATE INDEX `bioradar_user_id_idx` ON `bioRadarDiagnosis` (`userId`);--> statement-breakpoint
CREATE INDEX `bioradar_created_at_idx` ON `bioRadarDiagnosis` (`createdAt`);--> statement-breakpoint
CREATE INDEX `instagram_handle_idx` ON `bioRadarDiagnosis` (`instagramHandle`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `contentGeneration` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `contentGeneration` (`type`);--> statement-breakpoint
CREATE INDEX `user_type_idx` ON `contentGeneration` (`userId`,`type`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `contentGeneration` (`createdAt`);--> statement-breakpoint
CREATE INDEX `subscription_user_id_idx` ON `subscription` (`userId`);--> statement-breakpoint
CREATE INDEX `stripe_customer_idx` ON `subscription` (`stripeCustomerId`);--> statement-breakpoint
CREATE INDEX `stripe_subscription_idx` ON `subscription` (`stripeSubscriptionId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `subscription` (`status`);