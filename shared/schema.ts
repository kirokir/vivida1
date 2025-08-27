import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const buttonStyleEnum = pgEnum('button_style', ['rounded-full', 'rounded-lg', 'square']);

// Site Theme (Singleton)
export const siteTheme = pgTable("site_theme", {
  id: integer("id").primaryKey().default(1),
  primaryColor: text("primary_color").notNull().default("#e11d48"),
  buttonStyle: buttonStyleEnum("button_style").notNull().default("rounded-lg"),
  fontHeadline: text("font_headline").notNull().default("Anton"),
  fontBody: text("font_body").notNull().default("Inter"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users (for authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"), // nullable for Firebase-only users
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team Members
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconSvgPath: text("icon_svg_path").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Journey Milestones (Blog)
export const journeyMilestones = pgTable("journey_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: text("year").notNull(),
  title: text("title").notNull(),
  caption: text("caption").notNull(),
  content: text("content").notNull(), // Rich text content for blog posts
  iconSvgPath: text("icon_svg_path").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Portfolio Projects
export const portfolioProjects = pgTable("portfolio_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull().default([]),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact Info (Singleton)
export const contactInfo = pgTable("contact_info", {
  id: integer("id").primaryKey().default(1),
  email: text("email").notNull().default("hello@vivida.tech"),
  phone: text("phone").notNull().default("+1 (234) 567-8900"),
  officeLocation: text("office_location").notNull().default("San Francisco, California"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firebaseUid: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJourneyMilestoneSchema = createInsertSchema(journeyMilestones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  isRead: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSiteThemeSchema = createInsertSchema(siteTheme).omit({
  id: true,
  updatedAt: true,
});

export const updateContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SiteTheme = typeof siteTheme.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type JourneyMilestone = typeof journeyMilestones.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertJourneyMilestone = z.infer<typeof insertJourneyMilestoneSchema>;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type UpdateSiteTheme = z.infer<typeof updateSiteThemeSchema>;
export type UpdateContactInfo = z.infer<typeof updateContactInfoSchema>;
