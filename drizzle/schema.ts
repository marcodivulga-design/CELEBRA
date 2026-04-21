import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, text, timestamp, mysqlEnum, index, tinyint, boolean, date, decimal, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm"

export const analyticsEvents = mysqlTable("analytics_events", {
	id: int().autoincrement().notNull(),
	eventType: varchar({ length: 100 }).notNull(),
	eventName: varchar({ length: 255 }).notNull(),
	userId: int(),
	sessionId: varchar({ length: 255 }),
	source: varchar({ length: 100 }),
	referrer: text(),
	userAgent: text(),
	ipAddress: varchar({ length: 45 }),
	pageUrl: text(),
	pageTitle: varchar({ length: 255 }),
	metadata: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const audioGenerations = mysqlTable("audio_generations", {
	id: int().autoincrement().notNull(),
	songId: int().notNull(),
	churchId: int().notNull(),
	status: mysqlEnum(['pending','generating','separating','ready','error']).default('pending').notNull(),
	promptUsed: text(),
	style: varchar({ length: 100 }).default('liturgical'),
	fullAudioUrl: text(),
	fullAudioKey: varchar({ length: 500 }),
	creditsUsed: int().default(0),
	errorMessage: text(),
	requestedById: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const audioStems = mysqlTable("audio_stems", {
	id: int().autoincrement().notNull(),
	generationId: int().notNull(),
	stemType: varchar({ length: 50 }).notNull(),
	stemLabel: varchar({ length: 100 }).notNull(),
	audioUrl: text(),
	audioKey: varchar({ length: 500 }),
	durationSeconds: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const billingLogs = mysqlTable("billing_logs", {
	id: int().autoincrement().notNull(),
	churchId: int().notNull(),
	eventType: varchar({ length: 100 }).notNull(),
	payload: text(),
	status: mysqlEnum(['success','failed','pending']).default('pending').notNull(),
	errorMessage: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
	id: int().autoincrement().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 500 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	coverImageUrl: text(),
	category: varchar({ length: 100 }),
	tags: text(),
	authorName: varchar({ length: 255 }).default('Equipe Jubilus'),
	isPublished: tinyint().default(0).notNull(),
	publishedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("blog_posts_slug_unique").on(table.slug),
]);

export const choirParts = mysqlTable("choir_parts", {
	id: int().autoincrement().notNull(),
	songId: int().notNull(),
	voicePart: varchar({ length: 50 }).notNull(),
	audioUrl: text(),
	sheetMusicUrl: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const churches = mysqlTable("churches", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	patronSaint: varchar({ length: 255 }),
	diocese: varchar({ length: 255 }),
	city: varchar({ length: 255 }),
	state: varchar({ length: 2 }),
	logoUrl: text(),
	primaryColor: varchar({ length: 7 }).default('#7C3AED'),
	secondaryColor: varchar({ length: 7 }).default('#6D28D9'),
	plan: mysqlEnum(['free','basic','intermediate','premium']).default('free').notNull(),
	credits: int().default(10).notNull(),
	ownerId: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	stripeSubscriptionId: varchar({ length: 255 }),
});

export const contactSubmissions = mysqlTable("contact_submissions", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 20 }),
	churchName: varchar({ length: 255 }),
	subject: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	status: mysqlEnum(['new','read','responded','archived']).default('new').notNull(),
	respondedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const conversionFunnelSteps = mysqlTable("conversion_funnel_steps", {
	id: int().autoincrement().notNull(),
	stepName: varchar({ length: 100 }).notNull(),
	stepOrder: int().notNull(),
	sessionId: varchar({ length: 255 }).notNull(),
	userId: int(),
	completedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	metadata: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const creditTransactions = mysqlTable("credit_transactions", {
	id: int().autoincrement().notNull(),
	churchId: int().notNull(),
	amount: int().notNull(),
	description: varchar({ length: 255 }),
	transactionType: varchar({ length: 50 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const eventBlocks = mysqlTable("event_blocks", {
	id: int().autoincrement().notNull(),
	eventId: int().notNull(),
	blockName: varchar({ length: 100 }).notNull(),
	blockOrder: int().notNull(),
	songId: int(),
	transposeKey: varchar({ length: 10 }),
	notes: text(),
});

export const events = mysqlTable("events", {
	id: int().autoincrement().notNull(),
	churchId: int().notNull(),
	title: varchar({ length: 255 }),
	eventDate: timestamp({ mode: 'string' }).notNull(),
	eventType: varchar({ length: 50 }).default('missa'),
	liturgicalCycle: varchar({ length: 5 }),
	liturgicalTime: varchar({ length: 100 }),
	liturgicalColor: varchar({ length: 20 }),
	notes: text(),
	pdfUrl: text(),
	status: mysqlEnum(['draft','published','archived']).default('draft').notNull(),
	createdById: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const newsletterSubscriptions = mysqlTable("newsletter_subscriptions", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 320 }).notNull(),
	name: varchar({ length: 255 }),
	status: mysqlEnum(['subscribed','unsubscribed','bounced']).default('subscribed').notNull(),
	source: varchar({ length: 100 }).default('landing_page'),
	subscribedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	unsubscribedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("newsletter_subscriptions_email_unique").on(table.email),
]);

export const songs = mysqlTable("songs", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }),
	lyrics: text(),
	chords: text(),
	originalKey: varchar({ length: 10 }),
	bpm: int(),
	difficultyLevel: int().default(1),
	liturgicalTime: varchar({ length: 100 }),
	massMoment: varchar({ length: 100 }),
	theme: varchar({ length: 255 }),
	isPublic: tinyint().default(1).notNull(),
	churchId: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	audioUrl: varchar({ length: 500 }),
});

export const subscriptions = mysqlTable("subscriptions", {
	id: int().autoincrement().notNull(),
	churchId: int().notNull(),
	plan: mysqlEnum(['free','basic','intermediate','premium']).default('free').notNull(),
	status: mysqlEnum(['active','canceled','past_due','inactive']).default('inactive').notNull(),
	currentPeriodEnd: timestamp({ mode: 'string' }),
	psdCustomerId: varchar({ length: 255 }),
	psdSubscriptionId: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("subscriptions_churchId_unique").on(table.churchId),
]);

export const testimonials = mysqlTable("testimonials", {
	id: int().autoincrement().notNull(),
	churchName: varchar({ length: 255 }).notNull(),
	contactName: varchar({ length: 255 }).notNull(),
	contactEmail: varchar({ length: 320 }).notNull(),
	contactRole: varchar({ length: 255 }),
	testimonialText: text().notNull(),
	rating: int().default(5),
	churchLogoUrl: text(),
	isApproved: tinyint().default(0).notNull(),
	isPublished: tinyint().default(0).notNull(),
	publishedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	churchId: int(),
	voicePart: varchar({ length: 50 }),
	stripeCustomerId: varchar({ length: 255 }),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

// Celebrations and related tables
export const celebrations = mysqlTable("celebrations", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	date: timestamp({ mode: 'string' }).notNull(),
	type: mysqlEnum(['missa','palavra','batizado','casamento','funeral','vigilia','outro']).default('missa').notNull(),
	location: varchar({ length: 255 }),
	status: mysqlEnum(['draft','scheduled','completed','cancelled']).default('draft').notNull(),
	createdBy: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("celebrations_date_idx").on(table.date),
	index("celebrations_createdBy_idx").on(table.createdBy),
]);

export const celebrationSongs = mysqlTable("celebrationSongs", {
	id: int().autoincrement().notNull(),
	celebrationId: int().notNull(),
	songId: int().notNull(),
	order: int().notNull(),
	moment: varchar({ length: 100 }),
	transposition: int().default(0),
	title: varchar({ length: 255 }),
	artist: varchar({ length: 255 }),
	lyrics: text(),
	chords: text(),
},
(table) => [
	index("celebrationSongs_celebrationId_idx").on(table.celebrationId),
]);

export const readings = mysqlTable("readings", {
	id: int().autoincrement().notNull(),
	celebrationId: int().notNull(),
	book: varchar({ length: 100 }).notNull(),
	chapter: int().notNull(),
	verseStart: int().notNull(),
	verseEnd: int(),
	type: mysqlEnum(['primeira','segunda','evangelho','salmo','outro']).notNull(),
	text: text(),
	reader: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("readings_celebrationId_idx").on(table.celebrationId),
]);

export const teams = mysqlTable("teams", {
	id: int().autoincrement().notNull(),
	celebrationId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("teams_celebrationId_idx").on(table.celebrationId),
]);

export const teamMembers = mysqlTable("teamMembers", {
	id: int().autoincrement().notNull(),
	teamId: int().notNull(),
	userId: int().notNull(),
	role: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
});

export const organizations = mysqlTable("organizations", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	plan: mysqlEnum(['free','pro','enterprise']).default('free').notNull(),
	ownerId: int().notNull(),
	logo: varchar({ length: 255 }),
	website: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("organizations_slug_unique").on(table.slug),
]);

export const organizationUsers = mysqlTable("organizationUsers", {
	id: int().autoincrement().notNull(),
	organizationId: int().notNull(),
	userId: int().notNull(),
	role: mysqlEnum(['owner','admin','member']).default('member').notNull(),
	joinedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("organizationUsers_organizationId_idx").on(table.organizationId),
	index("organizationUsers_userId_idx").on(table.userId),
]);


// ===== CHURCH HIERARCHY TABLES =====

export const archdioceses = mysqlTable("archdioceses", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	archbishop: varchar({ length: 255 }),
	state: varchar({ length: 2 }),
	country: varchar({ length: 100 }).default('Brazil'),
	website: varchar({ length: 255 }),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	address: text(),
	latitude: decimal({ precision: 10, scale: 8 }),
	longitude: decimal({ precision: 11, scale: 8 }),
	photoUrl: varchar({ length: 500 }),
	foundedYear: int(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("archdioceses_state_idx").on(table.state),
	index("archdioceses_name_idx").on(table.name),
]);

export const dioceses = mysqlTable("dioceses", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	archdiocesesId: int(),
	bishop: varchar({ length: 255 }),
	state: varchar({ length: 2 }),
	website: varchar({ length: 255 }),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	address: text(),
	latitude: decimal({ precision: 10, scale: 8 }),
	longitude: decimal({ precision: 11, scale: 8 }),
	photoUrl: varchar({ length: 500 }),
	foundedYear: int(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("dioceses_archdiocesesId_idx").on(table.archdiocesesId),
	index("dioceses_state_idx").on(table.state),
	index("dioceses_name_idx").on(table.name),
]);

export const parishes = mysqlTable("parishes", {
	id: int().autoincrement().notNull().primaryKey(),
	organizationId: int().notNull(),
	dioceseId: int(),
	name: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 2 }),
	address: text(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	website: varchar({ length: 255 }),
	latitude: decimal({ precision: 10, scale: 8 }),
	longitude: decimal({ precision: 11, scale: 8 }),
	photoUrl: varchar({ length: 500 }),
	foundedYear: int(),
	patronSaint: varchar({ length: 255 }),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("parishes_organizationId_idx").on(table.organizationId),
	index("parishes_dioceseId_idx").on(table.dioceseId),
	index("parishes_city_idx").on(table.city),
	index("parishes_state_idx").on(table.state),
]);

export const churchesHierarchy = mysqlTable("churchesHierarchy", {
	id: int().autoincrement().notNull().primaryKey(),
	organizationId: int().notNull(),
	parishId: int(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['cathedral', 'church', 'chapel', 'sanctuary', 'basilica']).default('church'),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 2 }),
	address: text(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	latitude: decimal({ precision: 10, scale: 8 }),
	longitude: decimal({ precision: 11, scale: 8 }),
	photoUrl: varchar({ length: 500 }),
	foundedYear: int(),
	patronSaint: varchar({ length: 255 }),
	description: text(),
	capacity: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("churchesHierarchy_organizationId_idx").on(table.organizationId),
	index("churchesHierarchy_parishId_idx").on(table.parishId),
	index("churchesHierarchy_city_idx").on(table.city),
	index("churchesHierarchy_state_idx").on(table.state),
	index("churchesHierarchy_type_idx").on(table.type),
]);

export const priests = mysqlTable("priests", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 20 }),
	dioceseId: int(),
	parishId: int(),
	churchId: int(),
	role: mysqlEnum(['bishop', 'archbishop', 'priest', 'deacon', 'vicar', 'chaplain']).default('priest'),
	ordinationYear: int(),
	bio: text(),
	photoUrl: varchar({ length: 500 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("priests_dioceseId_idx").on(table.dioceseId),
	index("priests_parishId_idx").on(table.parishId),
	index("priests_churchId_idx").on(table.churchId),
	index("priests_role_idx").on(table.role),
]);

export const patrons = mysqlTable("patrons", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	feastDay: date({ mode: 'string' }),
	biography: text(),
	iconUrl: varchar({ length: 500 }),
	dioceseId: int(),
	parishId: int(),
	churchId: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("patrons_dioceseId_idx").on(table.dioceseId),
	index("patrons_parishId_idx").on(table.parishId),
	index("patrons_churchId_idx").on(table.churchId),
]);

export const churchPhotos = mysqlTable("churchPhotos", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	caption: varchar({ length: 500 }),
	isMain: boolean().default(false),
	uploadedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("churchPhotos_churchId_idx").on(table.churchId),
	index("churchPhotos_isMain_idx").on(table.isMain),
]);

export const churchContacts = mysqlTable("churchContacts", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	contactType: mysqlEnum(['pastor', 'vicar', 'secretary', 'music_director', 'maintenance']).default('secretary'),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("churchContacts_churchId_idx").on(table.churchId),
	index("churchContacts_contactType_idx").on(table.contactType),
]);

export const ministries = mysqlTable("ministries", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	organizationId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	type: mysqlEnum(['choir', 'music', 'liturgy', 'youth', 'pastoral', 'education', 'social', 'other']).default('other'),
	coordinatorName: varchar({ length: 255 }),
	coordinatorEmail: varchar({ length: 255 }),
	coordinatorPhone: varchar({ length: 20 }),
	photoUrl: varchar({ length: 500 }),
	memberCount: int().default(0),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("ministries_churchId_idx").on(table.churchId),
	index("ministries_organizationId_idx").on(table.organizationId),
	index("ministries_type_idx").on(table.type),
]);

export const ministryMembers = mysqlTable("ministryMembers", {
	id: int().autoincrement().notNull().primaryKey(),
	ministryId: int().notNull(),
	churchId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 20 }),
	role: varchar({ length: 100 }).notNull(),
	photoUrl: varchar({ length: 500 }),
	bio: text(),
	joinDate: date({ mode: 'string' }),
	isActive: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("ministryMembers_ministryId_idx").on(table.ministryId),
	index("ministryMembers_churchId_idx").on(table.churchId),
	index("ministryMembers_isActive_idx").on(table.isActive),
]);

export const rehearsals = mysqlTable("rehearsals", {
	id: int().autoincrement().notNull().primaryKey(),
	ministryId: int().notNull(),
	churchId: int().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	scheduledDate: datetime({ mode: 'string' }).notNull(),
	duration: int(), // em minutos
	location: varchar({ length: 255 }),
	status: mysqlEnum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("rehearsals_ministryId_idx").on(table.ministryId),
	index("rehearsals_churchId_idx").on(table.churchId),
	index("rehearsals_scheduledDate_idx").on(table.scheduledDate),
	index("rehearsals_status_idx").on(table.status),
]);

export const rehearsalAttendance = mysqlTable("rehearsalAttendance", {
	id: int().autoincrement().notNull().primaryKey(),
	rehearsalId: int().notNull(),
	memberId: int().notNull(),
	status: mysqlEnum(['present', 'absent', 'excused']).default('absent'),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("rehearsalAttendance_rehearsalId_idx").on(table.rehearsalId),
	index("rehearsalAttendance_memberId_idx").on(table.memberId),
	index("rehearsalAttendance_status_idx").on(table.status),
]);

export const rehearsalPlaylists = mysqlTable("rehearsalPlaylists", {
	id: int().autoincrement().notNull().primaryKey(),
	rehearsalId: int().notNull(),
	ministryId: int().notNull(),
	churchId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	duration: int(), // em minutos
	totalSongs: int().default(0),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("rehearsalPlaylists_rehearsalId_idx").on(table.rehearsalId),
	index("rehearsalPlaylists_ministryId_idx").on(table.ministryId),
	index("rehearsalPlaylists_churchId_idx").on(table.churchId),
]);

export const playlistSongs = mysqlTable("playlistSongs", {
	id: int().autoincrement().notNull().primaryKey(),
	playlistId: int().notNull(),
	songId: int(),
	title: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }),
	duration: int(), // em segundos
	key: varchar({ length: 10 }), // Tom musical (C, D, E, etc)
	tempo: int(), // BPM
	lyrics: text(),
	musicUrl: text(), // URL da música (YouTube, Spotify, etc)
	cifraUrl: text(), // URL da cifra
	notes: text(), // Notas do maestro
	order: int().default(0), // Ordem na playlist
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("playlistSongs_playlistId_idx").on(table.playlistId),
	index("playlistSongs_songId_idx").on(table.songId),
	index("playlistSongs_order_idx").on(table.order),
]);

export const catholicRepertoire = mysqlTable("catholicRepertoire", {
	id: int().autoincrement().notNull().primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	artist: varchar({ length: 255 }),
	composer: varchar({ length: 255 }),
	lyrics: text(),
	key: varchar({ length: 10 }), // Tom musical
	tempo: int(), // BPM
	duration: int(), // em segundos
	// Classificação Litúrgica
	liturgicalSeason: mysqlEnum(['advent', 'christmas', 'lent', 'easter', 'pentecost', 'ordinary']),
	massPart: mysqlEnum(['entrance', 'gloria', 'alleluia', 'offertory', 'sanctus', 'agnus', 'communion', 'recessional']),
	// Fonte e Acervo
	source: mysqlEnum(['cnbb', 'vozdoaltar', 'hinariodigital', 'canticosliturgicos', 'other']).default('cnbb'),
	sourceUrl: text(), // URL da fonte original
	cnbbCode: varchar({ length: 50 }), // Código CNBB se disponível
	// Metadados
	theme: varchar({ length: 255 }), // Ex: Esperança, Amor, Conversão
	difficulty: mysqlEnum(['easy', 'medium', 'hard']).default('medium'),
	voiceType: mysqlEnum(['soprano', 'alto', 'tenor', 'bass', 'mixed']).default('mixed'),
	minVoices: int().default(1),
	maxVoices: int().default(4),
	// Links
	musicUrl: text(), // Spotify, YouTube, etc
	cifraUrl: text(), // URL da cifra
	lyricsUrl: text(), // URL da letra completa
	// Metadata
	isOfficial: boolean().default(true),
	isActive: boolean().default(true),
	popularity: int().default(0), // Ranking de popularidade
	usageCount: int().default(0), // Quantas vezes foi usada
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("catholicRepertoire_title_idx").on(table.title),
	index("catholicRepertoire_liturgicalSeason_idx").on(table.liturgicalSeason),
	index("catholicRepertoire_massPart_idx").on(table.massPart),
	index("catholicRepertoire_source_idx").on(table.source),
	index("catholicRepertoire_theme_idx").on(table.theme),
	index("catholicRepertoire_isActive_idx").on(table.isActive),
]);

export const repertoireHistory = mysqlTable("repertoireHistory", {
	id: int().autoincrement().notNull().primaryKey(),
	repertoireId: int().notNull(),
	action: mysqlEnum(['added', 'updated', 'removed', 'synced']).notNull(),
	details: text(),
	syncSource: varchar({ length: 100 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("repertoireHistory_repertoireId_idx").on(table.repertoireId),
	index("repertoireHistory_action_idx").on(table.action),
]);


// ===== BUSCA AVANÇADA =====
export const searchHistory = mysqlTable("searchHistory", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	query: varchar({ length: 255 }).notNull(),
	filters: text(), // JSON com filtros aplicados
	resultsCount: int().default(0),
	selectedSongId: int(), // Música selecionada após busca
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("searchHistory_userId_idx").on(table.userId),
	index("searchHistory_organizationId_idx").on(table.organizationId),
	index("searchHistory_createdAt_idx").on(table.createdAt),
]);

export const searchFilters = mysqlTable("searchFilters", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	name: varchar({ length: 100 }).notNull(), // Ex: "Quaresma Litúrgico"
	filterData: text().notNull(), // JSON com filtros salvos
	isDefault: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("searchFilters_userId_idx").on(table.userId),
	index("searchFilters_organizationId_idx").on(table.organizationId),
]);

// ===== HISTÓRICO DE REPRODUÇÃO =====
export const playbackHistory = mysqlTable("playbackHistory", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	songId: int().notNull(),
	playlistId: int(),
	playedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	durationSeconds: int(),
	completedPercentage: int().default(0), // 0-100
	deviceType: varchar({ length: 50 }), // 'web', 'mobile', 'desktop'
	source: varchar({ length: 50 }), // 'spotify', 'youtube', 'local'
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("playbackHistory_userId_idx").on(table.userId),
	index("playbackHistory_organizationId_idx").on(table.organizationId),
	index("playbackHistory_songId_idx").on(table.songId),
	index("playbackHistory_playedAt_idx").on(table.playedAt),
]);

export const favoriteSongs = mysqlTable("favoriteSongs", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	songId: int().notNull(),
	rating: int(), // 1-5 stars
	notes: text(),
	addedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("favoriteSongs_userId_idx").on(table.userId),
	index("favoriteSongs_organizationId_idx").on(table.organizationId),
	index("favoriteSongs_songId_idx").on(table.songId),
]);

export const songSuggestions = mysqlTable("songSuggestions", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	basedOnSongId: int().notNull(),
	suggestedSongId: int().notNull(),
	similarityScore: decimal({ precision: 3, scale: 2 }), // 0.00-1.00
	reason: varchar({ length: 255 }), // Ex: "Mesmo tema litúrgico"
	userFeedback: mysqlEnum(['accepted', 'rejected', 'neutral']).default('neutral'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("songSuggestions_userId_idx").on(table.userId),
	index("songSuggestions_organizationId_idx").on(table.organizationId),
	index("songSuggestions_basedOnSongId_idx").on(table.basedOnSongId),
]);

export const playbackStats = mysqlTable("playbackStats", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	totalPlays: int().default(0),
	totalMinutesListened: int().default(0),
	favoriteGenre: varchar({ length: 100 }),
	favoriteArtist: varchar({ length: 255 }),
	mostPlayedSongId: int(),
	lastUpdatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("playbackStats_userId_idx").on(table.userId),
	index("playbackStats_organizationId_idx").on(table.organizationId),
]);

// ===== SINCRONIZAÇÃO COM SPOTIFY =====
export const spotifyConnections = mysqlTable("spotifyConnections", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	spotifyUserId: varchar({ length: 255 }).notNull(),
	accessToken: text().notNull(),
	refreshToken: text(),
	expiresAt: timestamp({ mode: 'string' }),
	scope: text(), // Permissões concedidas
	connectedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	disconnectedAt: timestamp({ mode: 'string' }),
	isActive: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("spotifyConnections_userId_idx").on(table.userId),
	index("spotifyConnections_organizationId_idx").on(table.organizationId),
	index("spotifyConnections_spotifyUserId_idx").on(table.spotifyUserId),
]);

export const spotifyPlaylistSync = mysqlTable("spotifyPlaylistSync", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	playlistId: int().notNull(),
	spotifyPlaylistId: varchar({ length: 255 }).notNull(),
	spotifyPlaylistUrl: text(),
	isPublic: boolean().default(false),
	autoSyncEnabled: boolean().default(false),
	syncInterval: mysqlEnum(['hourly', 'daily', 'weekly']).default('daily'),
	lastSyncedAt: timestamp({ mode: 'string' }),
	tracksInSpotify: int().default(0),
	tracksInCelebra: int().default(0),
	isSynced: boolean().default(false),
	syncStatus: mysqlEnum(['pending', 'syncing', 'synced', 'error']).default('pending'),
	errorMessage: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("spotifyPlaylistSync_userId_idx").on(table.userId),
	index("spotifyPlaylistSync_organizationId_idx").on(table.organizationId),
	index("spotifyPlaylistSync_playlistId_idx").on(table.playlistId),
	index("spotifyPlaylistSync_spotifyPlaylistId_idx").on(table.spotifyPlaylistId),
]);

export const spotifySyncHistory = mysqlTable("spotifySyncHistory", {
	id: int().autoincrement().notNull().primaryKey(),
	syncId: int().notNull(),
	action: mysqlEnum(['added', 'updated', 'removed', 'synced']).notNull(),
	tracksAdded: int().default(0),
	tracksUpdated: int().default(0),
	tracksRemoved: int().default(0),
	details: text(), // JSON com detalhes da sincronização
	syncedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("spotifySyncHistory_syncId_idx").on(table.syncId),
	index("spotifySyncHistory_syncedAt_idx").on(table.syncedAt),
]);

export const spotifyRecommendations = mysqlTable("spotifyRecommendations", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	organizationId: int().notNull(),
	spotifyTrackId: varchar({ length: 255 }).notNull(),
	trackName: varchar({ length: 255 }).notNull(),
	artistName: varchar({ length: 255 }).notNull(),
	spotifyUri: varchar({ length: 255 }).notNull(),
	externalUrl: text(),
	popularity: int(), // 0-100
	previewUrl: text(),
	addedToPlaylistId: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("spotifyRecommendations_userId_idx").on(table.userId),
	index("spotifyRecommendations_organizationId_idx").on(table.organizationId),
	index("spotifyRecommendations_spotifyTrackId_idx").on(table.spotifyTrackId),
]);


// ===== AGREGAÇÃO DE MÚSICAS (Hinário Digital, Spotify, YouTube) =====
export const aggregatedSongs = mysqlTable("aggregatedSongs", {
	id: int().autoincrement().notNull().primaryKey(),
	title: varchar({ length: 500 }).notNull(),
	artist: varchar({ length: 255 }),
	composer: varchar({ length: 255 }),
	source: varchar({ length: 100 }).notNull(), // "hinario", "spotify", "youtube"
	sourceId: varchar({ length: 500 }), // ID na fonte original
	
	// Metadados
	duration: int(), // segundos
	genre: varchar({ length: 100 }),
	liturgicalTime: varchar({ length: 100 }), // "Páscoa", "Natal", "Quaresma"
	massFunction: varchar({ length: 100 }), // "Entrada", "Comunhão", "Saída"
	
	// Formatos disponíveis
	hasAudio: boolean().default(false),
	hasSheet: boolean().default(false),
	hasCifra: boolean().default(false),
	hasMuseScore: boolean().default(false),
	
	// URLs no S3 (não arquivos!)
	audioUrl: varchar({ length: 500 }),
	sheetUrl: varchar({ length: 500 }),
	cifraUrl: varchar({ length: 500 }),
	museScoreUrl: varchar({ length: 500 }),
	
	// Controle de uso
	downloadable: boolean().default(true),
	modifiable: boolean().default(true),
	commercialUse: boolean().default(false),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("aggregatedSongs_title_idx").on(table.title),
	index("aggregatedSongs_source_idx").on(table.source),
	index("aggregatedSongs_liturgicalTime_idx").on(table.liturgicalTime),
	index("aggregatedSongs_massFunction_idx").on(table.massFunction),
]);

// ===== DOWNLOADS LOCAIS =====
export const localMusicDownloads = mysqlTable("localMusicDownloads", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	songId: int().notNull(),
	
	// Referência ao arquivo no S3
	s3Key: varchar({ length: 500 }),
	s3Url: varchar({ length: 500 }),
	
	format: varchar({ length: 50 }), // "mp3", "pdf", "mxl"
	fileSize: int(), // bytes
	downloadedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	expiresAt: timestamp({ mode: 'string' }),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("localMusicDownloads_churchId_idx").on(table.churchId),
	index("localMusicDownloads_songId_idx").on(table.songId),
	index("localMusicDownloads_expiresAt_idx").on(table.expiresAt),
]);

// ===== ARRANJOS PERSONALIZADOS =====
export const musicArrangements = mysqlTable("musicArrangements", {
	id: int().autoincrement().notNull().primaryKey(),
	originalSongId: int().notNull(),
	churchId: int().notNull(),
	arrangedBy: int(), // userId
	
	// Modificações
	key: varchar({ length: 10 }), // Tom original
	newKey: varchar({ length: 10 }), // Tom modificado
	tempo: int(), // BPM
	style: varchar({ length: 100 }), // "Coral", "Instrumental", "Pop"
	voiceParts: varchar({ length: 500 }), // "Soprano,Alto,Tenor,Baixo"
	
	// Ferramentas usadas
	tool: varchar({ length: 100 }), // "Suno", "MuseScore", "GarageBand"
	toolProjectUrl: text(),
	
	// Resultado
	resultAudioUrl: text(),
	resultSheetUrl: text(),
	resultMuseScoreUrl: text(),
	
	status: mysqlEnum(['draft', 'processing', 'ready', 'error']).default('draft'),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("musicArrangements_originalSongId_idx").on(table.originalSongId),
	index("musicArrangements_churchId_idx").on(table.churchId),
	index("musicArrangements_status_idx").on(table.status),
]);

// ===== REFLEXÕES DIÁRIAS =====
export const dailyReflections = mysqlTable("dailyReflections", {
	id: int().autoincrement().notNull().primaryKey(),
	title: varchar({ length: 500 }).notNull(),
	content: text().notNull(),
	verse: varchar({ length: 255 }), // "Mateus 28:6"
	verseText: text(),
	prayer: text(),
	author: varchar({ length: 255 }),
	date: date({ mode: 'string' }).notNull(),
	imageUrl: varchar({ length: 500 }),
	isPublished: boolean().default(true),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("dailyReflections_date_idx").on(table.date),
	index("dailyReflections_isPublished_idx").on(table.isPublished),
]);

// ===== NOTÍCIAS CATÓLICAS =====
export const catholicNews = mysqlTable("catholicNews", {
	id: int().autoincrement().notNull().primaryKey(),
	title: varchar({ length: 500 }).notNull(),
	slug: varchar({ length: 500 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	imageUrl: varchar({ length: 500 }),
	category: varchar({ length: 100 }), // "Vaticano", "Dioceses", "Liturgia"
	source: varchar({ length: 255 }),
	sourceUrl: text(),
	author: varchar({ length: 255 }),
	isPublished: boolean().default(true),
	publishedAt: timestamp({ mode: 'string' }),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("catholicNews_slug_idx").on(table.slug),
	index("catholicNews_category_idx").on(table.category),
	index("catholicNews_isPublished_idx").on(table.isPublished),
	index("catholicNews_publishedAt_idx").on(table.publishedAt),
]);

// ===== FÓRUM DE DISCUSSÃO =====
export const forumTopics = mysqlTable("forumTopics", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	userId: int().notNull(),
	title: varchar({ length: 500 }).notNull(),
	description: text(),
	category: varchar({ length: 100 }), // "Liturgia", "Música", "Fé"
	isPinned: boolean().default(false),
	isLocked: boolean().default(false),
	viewCount: int().default(0),
	replyCount: int().default(0),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("forumTopics_churchId_idx").on(table.churchId),
	index("forumTopics_userId_idx").on(table.userId),
	index("forumTopics_category_idx").on(table.category),
	index("forumTopics_isPinned_idx").on(table.isPinned),
]);

export const forumPosts = mysqlTable("forumPosts", {
	id: int().autoincrement().notNull().primaryKey(),
	topicId: int().notNull(),
	userId: int().notNull(),
	content: text().notNull(),
	likeCount: int().default(0),
	isApproved: boolean().default(true),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("forumPosts_topicId_idx").on(table.topicId),
	index("forumPosts_userId_idx").on(table.userId),
	index("forumPosts_isApproved_idx").on(table.isApproved),
]);

// ===== GRUPOS DE ORAÇÃO =====
export const prayerGroups = mysqlTable("prayerGroups", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	coordinatorId: int(),
	maxMembers: int(),
	memberCount: int().default(0),
	isActive: boolean().default(true),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("prayerGroups_churchId_idx").on(table.churchId),
	index("prayerGroups_coordinatorId_idx").on(table.coordinatorId),
	index("prayerGroups_isActive_idx").on(table.isActive),
]);

export const prayerGroupMembers = mysqlTable("prayerGroupMembers", {
	id: int().autoincrement().notNull().primaryKey(),
	groupId: int().notNull(),
	userId: int().notNull(),
	joinedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("prayerGroupMembers_groupId_idx").on(table.groupId),
	index("prayerGroupMembers_userId_idx").on(table.userId),
]);

// ===== DESAFIOS ESPIRITUAIS =====
export const spiritualChallenges = mysqlTable("spiritualChallenges", {
	id: int().autoincrement().notNull().primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	duration: int().notNull(), // dias (7, 14, 30)
	content: text(),
	imageUrl: varchar({ length: 500 }),
	difficulty: mysqlEnum(['easy', 'medium', 'hard']).default('medium'),
	isActive: boolean().default(true),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("spiritualChallenges_duration_idx").on(table.duration),
	index("spiritualChallenges_isActive_idx").on(table.isActive),
]);

export const userChallengeProgress = mysqlTable("userChallengeProgress", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	challengeId: int().notNull(),
	startedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
	daysCompleted: int().default(0),
	status: mysqlEnum(['active', 'completed', 'abandoned']).default('active'),
},
(table) => [
	index("userChallengeProgress_userId_idx").on(table.userId),
	index("userChallengeProgress_challengeId_idx").on(table.challengeId),
	index("userChallengeProgress_status_idx").on(table.status),
]);

// ===== GAMIFICAÇÃO =====
export const userGamification = mysqlTable("userGamification", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	churchId: int().notNull(),
	points: int().default(0),
	level: int().default(1),
	badges: text(), // JSON array de badges
	lastActivityAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("userGamification_userId_idx").on(table.userId),
	index("userGamification_churchId_idx").on(table.churchId),
	index("userGamification_points_idx").on(table.points),
	index("userGamification_level_idx").on(table.level),
]);

// ===== ROSÁRIO DIGITAL =====
export const rosaryGuide = mysqlTable("rosaryGuide", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	date: date({ mode: 'string' }).notNull(),
	mystery: varchar({ length: 100 }), // "Joyful", "Sorrowful", "Glorious", "Luminous"
	beadCount: int().default(0),
	completedAt: timestamp({ mode: 'string' }),
	notes: text(),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("rosaryGuide_userId_idx").on(table.userId),
	index("rosaryGuide_date_idx").on(table.date),
]);

// ===== LITURGIA DAS HORAS =====
export const liturgyOfHours = mysqlTable("liturgyOfHours", {
	id: int().autoincrement().notNull().primaryKey(),
	date: date({ mode: 'string' }).notNull(),
	hour: varchar({ length: 100 }), // "Matins", "Lauds", "Prime", "Terce", "Sext", "None", "Vespers", "Compline"
	psalms: text(), // JSON array
	canticles: text(), // JSON array
	readings: text(), // JSON array
	responsory: text(),
	hymn: text(),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("liturgyOfHours_date_idx").on(table.date),
	index("liturgyOfHours_hour_idx").on(table.hour),
]);

// ===== CATECISMO INTERATIVO =====
export const catechismQuestions = mysqlTable("catechismQuestions", {
	id: int().autoincrement().notNull().primaryKey(),
	category: varchar({ length: 100 }), // "Fé", "Sacramentos", "Mandamentos"
	question: text().notNull(),
	answer: text().notNull(),
	reference: varchar({ length: 255 }), // "CIC 2347"
	difficulty: mysqlEnum(['easy', 'medium', 'hard']).default('medium'),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("catechismQuestions_category_idx").on(table.category),
	index("catechismQuestions_difficulty_idx").on(table.difficulty),
]);

export const userCatechismProgress = mysqlTable("userCatechismProgress", {
	id: int().autoincrement().notNull().primaryKey(),
	userId: int().notNull(),
	questionId: int().notNull(),
	answered: boolean().default(false),
	correct: boolean().default(false),
	answeredAt: timestamp({ mode: 'string' }),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("userCatechismProgress_userId_idx").on(table.userId),
	index("userCatechismProgress_questionId_idx").on(table.questionId),
]);

// ===== MENTORADO ESPIRITUAL =====
export const spiritualMentors = mysqlTable("spiritualMentors", {
	id: int().autoincrement().notNull().primaryKey(),
	mentorId: int().notNull(),
	churchId: int().notNull(),
	bio: text(),
	expertise: varchar({ length: 500 }), // "Liturgia", "Oração", "Formação"
	isAvailable: boolean().default(true),
	maxMentees: int().default(5),
	currentMentees: int().default(0),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("spiritualMentors_mentorId_idx").on(table.mentorId),
	index("spiritualMentors_churchId_idx").on(table.churchId),
	index("spiritualMentors_isAvailable_idx").on(table.isAvailable),
]);

export const mentoringPairs = mysqlTable("mentoringPairs", {
	id: int().autoincrement().notNull().primaryKey(),
	mentorId: int().notNull(),
	menteeId: int().notNull(),
	churchId: int().notNull(),
	startedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	endedAt: timestamp({ mode: 'string' }),
	status: mysqlEnum(['active', 'completed', 'paused']).default('active'),
	notes: text(),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("mentoringPairs_mentorId_idx").on(table.mentorId),
	index("mentoringPairs_menteeId_idx").on(table.menteeId),
	index("mentoringPairs_churchId_idx").on(table.churchId),
	index("mentoringPairs_status_idx").on(table.status),
]);

// ===== CHURCH IMAGES (GALERIA DE IGREJAS) =====
export const churchImages = mysqlTable("churchImages", {
	id: int().autoincrement().notNull().primaryKey(),
	churchId: int().notNull(),
	imageUrl: text().notNull(),
	imageKey: varchar({ length: 500 }).notNull(), // S3 key
	imageType: mysqlEnum(['facade', 'hero', 'interior', 'altar', 'gallery']).default('gallery').notNull(),
	caption: text(),
	uploadedBy: int(),
	uploadedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("churchImages_churchId_idx").on(table.churchId),
	index("churchImages_imageType_idx").on(table.imageType),
	index("churchImages_uploadedAt_idx").on(table.uploadedAt),
]);

