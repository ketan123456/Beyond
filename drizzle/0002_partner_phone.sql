ALTER TABLE `partner_leads` ADD `phone` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `partner_leads` ADD `created_at` text;
--> statement-breakpoint
UPDATE `partner_leads`
SET `phone` = TRIM(SUBSTR(`message`, 1, INSTR(`message`, CHAR(10)) - 1)),
    `message` = LTRIM(SUBSTR(`message`, INSTR(`message`, CHAR(10)) + 1), CHAR(10) || CHAR(13) || ' ')
WHERE `phone` = '' AND INSTR(`message`, CHAR(10)) > 1;
