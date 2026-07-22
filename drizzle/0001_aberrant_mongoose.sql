CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`native_name` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `languages_locale_unique` ON `languages` (`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `translations_locale_key_unique` ON `translations` (`locale`,`key`);