CREATE TABLE `audio_generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`churchId` int NOT NULL,
	`status` enum('pending','generating','separating','ready','error') NOT NULL DEFAULT 'pending',
	`promptUsed` text,
	`style` varchar(100) DEFAULT 'liturgical',
	`fullAudioUrl` text,
	`fullAudioKey` varchar(500),
	`creditsUsed` int DEFAULT 0,
	`errorMessage` text,
	`requestedById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audio_generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audio_stems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`generationId` int NOT NULL,
	`stemType` varchar(50) NOT NULL,
	`stemLabel` varchar(100) NOT NULL,
	`audioUrl` text,
	`audioKey` varchar(500),
	`durationSeconds` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audio_stems_id` PRIMARY KEY(`id`)
);
