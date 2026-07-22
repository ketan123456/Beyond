// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  name: text("name").notNull(), phone: text("phone").notNull(), district: text("district").notNull(),
  category: text("category").notNull(), details: text("details").notNull().default(""),
  status: text("status").notNull().default("submitted"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const documents = sqliteTable("documents", { id: integer("id").primaryKey({autoIncrement:true}), applicationId: integer("application_id").notNull(), type:text("type").notNull(), storageKey:text("storage_key").notNull(), filename:text("filename").notNull(), reviewStatus:text("review_status").notNull().default("pending") });
export const payments = sqliteTable("payments", { id:integer("id").primaryKey({autoIncrement:true}), razorpayOrderId:text("razorpay_order_id").notNull().unique(), amount:integer("amount").notNull(), currency:text("currency").notNull().default("INR"), status:text("status").notNull().default("created"), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const translations = sqliteTable("translations", { id:integer("id").primaryKey({autoIncrement:true}), locale:text("locale").notNull(), key:text("key").notNull(), value:text("value").notNull(), updatedAt:text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const partnerLeads = sqliteTable("partner_leads", {id:integer("id").primaryKey({autoIncrement:true}), company:text("company").notNull(), contactName:text("contact_name").notNull(), email:text("email").notNull(), message:text("message").notNull().default(""), status:text("status").notNull().default("new")});
