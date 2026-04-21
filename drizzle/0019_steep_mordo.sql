CREATE TABLE `custom_songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`uploadedById` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist` varchar(255),
	`lyrics` text,
	`chords` text,
	`originalKey` varchar(10),
	`bpm` int,
	`difficultyLevel` int DEFAULT 1,
	`liturgicalTime` varchar(100),
	`massMoment` varchar(100),
	`theme` varchar(255),
	`audioUrl` text,
	`audioKey` varchar(255),
	`audioDuration` int,
	`isApproved` boolean NOT NULL DEFAULT false,
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('suggestion_weekly','new_song','event_reminder','community_post','ministry_update') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`relatedId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
