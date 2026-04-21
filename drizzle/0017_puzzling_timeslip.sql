CREATE TABLE `book_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`purchaseDate` timestamp NOT NULL DEFAULT (now()),
	`downloadCount` int DEFAULT 0,
	`lastDownloadDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `book_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brazilian_celebrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`celebrationType` enum('nacional','regional','padroeira','santos','outro') NOT NULL,
	`date` varchar(10) NOT NULL,
	`states` varchar(255),
	`imageUrl` text,
	`playlistId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brazilian_celebrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `digital_books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`description` text,
	`bookType` enum('formacao','poesia','filosofia','desenvolvimento','reflexao','outro') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`fileUrl` text NOT NULL,
	`coverUrl` text,
	`pages` int,
	`language` varchar(10) DEFAULT 'pt-BR',
	`publishedDate` timestamp,
	`isPublished` boolean DEFAULT true,
	`downloads` int DEFAULT 0,
	`rating` decimal(3,1) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `digital_books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patron_saints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`state` varchar(2) NOT NULL,
	`saintName` varchar(255) NOT NULL,
	`feastDay` varchar(10) NOT NULL,
	`description` text,
	`imageUrl` text,
	`playlistId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `patron_saints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priest_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`churchId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`ordainedDate` varchar(10),
	`biography` text,
	`photoUrl` text,
	`specialization` varchar(255),
	`mission` text,
	`socialLinks` text,
	`isPublished` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `priest_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priest_stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`priestId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`storyType` enum('vocacao','missao','testemunho','conquista','outro') NOT NULL,
	`photoUrl` text,
	`publishedDate` timestamp DEFAULT (now()),
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`isPublished` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `priest_stories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `story_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storyId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `story_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `word_of_the_day` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`bibleVerse` varchar(255),
	`meditation` text,
	`prayer` text,
	`author` varchar(255),
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `word_of_the_day_id` PRIMARY KEY(`id`),
	CONSTRAINT `word_of_the_day_date_unique` UNIQUE(`date`)
);
