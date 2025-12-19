CREATE TABLE `dailyMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` date NOT NULL,
	`creditsUsed` int DEFAULT 0,
	`creditsByFeature` json,
	`bioRadarAnalyses` int DEFAULT 0,
	`leadsCaptured` int DEFAULT 0,
	`ebooksGenerated` int DEFAULT 0,
	`promptsGenerated` int DEFAULT 0,
	`adsGenerated` int DEFAULT 0,
	`checkoutsStarted` int DEFAULT 0,
	`checkoutsCompleted` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyMetrics_id` PRIMARY KEY(`id`)
);

ALTER TABLE `dailyMetrics` ADD CONSTRAINT `dailyMetrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;

CREATE INDEX `metrics_user_date_idx` ON `dailyMetrics` (`userId`,`date`);
CREATE INDEX `metrics_date_idx` ON `dailyMetrics` (`date`);
