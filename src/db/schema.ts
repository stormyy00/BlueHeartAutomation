import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  unique,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  organizationId: text("organization_id"),
  image: text("image"),
  role: jsonb("role").default({ user: true }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = createTable(
  "account",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    accountId: varchar("accountId", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      mode: "date",
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      mode: "date",
      withTimezone: true,
    }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("idToken"),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (account) => ({
    userIdIdx: index("account_user_id_idx").on(account.userId),
    // providerAccountUnique: unique("provider_account_unique").on(
    //   account.providerId,
    //   account.accountId
    // ),
  }),
);

export const sessions = createTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),

    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    activeOrganizationId: varchar("activeOrganizationId", {
      length: 255,
    }).references(() => organizations.id),

    token: varchar("token", { length: 255 }).notNull(),
    ipAddress: varchar("ipAddress", { length: 255 }),

    userAgent: varchar("userAgent", { length: 255 }),
    expiresAt: timestamp("expiresAt", {
      mode: "date",
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
    activeOrgIdx: index("session_active_org_idx").on(
      session.activeOrganizationId,
    ),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  activeOrganization: one(organizations, {
    fields: [sessions.activeOrganizationId],
    references: [organizations.id],
  }),
}));

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const jwks = createTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("publicKey").notNull(),
  privateKey: text("privateKey").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const jwksRelations = relations(jwks, ({ one }) => ({
  user: one(users, { fields: [jwks.id], references: [users.id] }),
}));

// old Organizations schema
// export const organizations = createTable("organization", {
//   id: text("id").primaryKey(),
//   name: text("name").notNull(),
//   description: text("description"),
//   ownerId: text("owner_id")
//     .notNull()
//     .references(() => users.id),
//   icon: text("icon"),
//   media: jsonb("media").$type<string[]>().default([]),
//   documents: jsonb("documents").$type<string[]>().default([]),
//   themes: jsonb("themes").$type<string[]>().default([]),
//   notes: jsonb("notes").$type<string[]>().default([]),
//   users: jsonb("users").$type<string[]>().default([]),
//   donors: jsonb("donors").$type<string[]>().default([]),
//   links: jsonb("links")
//     .$type<Array<{ name: string; url: string }>>()
//     .default([]),
//   region: text("region").default("US"),
//   groups: jsonb("groups")
//     .$type<Array<{ name: string; emails: string[] }>>()
//     .default([]),
//   calendarId: text("calendar_id"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at")
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date()),
// });

// new schema
export const organizations = createTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  description: text("description"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),

  logo: text("logo"),

  documents: jsonb("documents").$type<string[]>().default([]),
  users: jsonb("users").$type<string[]>().default([]),
  region: text("region").default("US"),
  calendarId: text("calendar_id"),

  metadata: jsonb("metadata")
    .$type<{
      media?: string[];
      themes?: string[];
      notes?: string[];
      donors?: string[];
      links?: Array<{ name: string; url: string }>;
      groups?: Array<{ name: string; emails: string[] }>;
    }>()
    .default({}),

  keepCurrentActiveOrganization: boolean(
    "keep_current_active_organization",
  ).default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Organization members (many-to-many relationship)
export const organizationMembers = createTable(
  "organization_member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role", { enum: ["owner", "admin", "member"] })
      .notNull()
      .default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueMember: unique("unique_organization_member").on(
      table.organizationId,
      table.userId,
    ),
  }),
);

export const invitations = createTable("invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "member"] }).notNull(),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
    members: many(organizationMembers),
  }),
);

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMembers.userId],
      references: [users.id],
    }),
  }),
);

export const documents = createTable("document", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  htmlContent: text("html_content"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  campaignId: text("campaign_id").references(() => campaigns.id),
  status: text("status").notNull().default("draft"), // "draft" | "published" | "archived"
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  archivedAt: timestamp("archived_at"),
  tags: jsonb("tags").$type<string[]>().default([]),
  recipients: jsonb("recipients").$type<string[]>().default([]),
  template: text("template").default("default"),
  metadata: jsonb("metadata")
    .$type<Record<string, OrientationType>>()
    .default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  author: one(users, { fields: [documents.authorId], references: [users.id] }),
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
}));

export const campaigns = createTable("campaign", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // "draft" | "active" | "completed"
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type UserType = typeof users.$inferSelect;
export type AccountType = typeof accounts.$inferSelect;
export type SessionType = typeof sessions.$inferSelect;
export type VerificationType = typeof verification.$inferSelect;
export type JwkType = typeof jwks.$inferSelect;
export type OrganizationType = typeof organizations.$inferSelect;
export type OrganizationMemberType = typeof organizationMembers.$inferSelect;
export type InvitationType = typeof invitations.$inferSelect;
export type DocumentType = typeof documents.$inferSelect;
export type CampaignType = typeof campaigns.$inferSelect;
