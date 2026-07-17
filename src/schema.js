import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  unique,
  pgEnum,
  boolean,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// auth tables schema
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  username: text("username").notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));


// other tables schema

export const movies = pgTable("movies", {
  id: varchar("id", { length: 26 }).primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  bannerUrl: text("banner_url").notNull(),

  views: integer("views").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchedMovies = pgTable(
  "watched_movies",
  {
    id: varchar("id", { length: 26 }).primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    movieId: varchar("movie_id", { length: 26 })
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),

    watchedAt: timestamp("watched_at").defaultNow().notNull(),
  },
  (table) => ({
    userMovieUnique: unique("watched_movies_user_movie_unique").on(
      table.userId,
      table.movieId
    ),
    userIdx: index("watched_movies_user_idx").on(table.userId),
    movieIdx: index("watched_movies_movie_idx").on(table.movieId),
  })
);

export const movieFeedbacks = pgTable(
  "movie_feedbacks",
  {
    id: varchar("id", { length: 26 }).primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    movieId: varchar("movie_id", { length: 26 })
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),

    feedback: text("feedback").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userMovieUnique: unique("movie_feedbacks_user_movie_unique").on(
      table.userId,
      table.movieId
    ),
    userIdx: index("movie_feedbacks_user_idx").on(table.userId),
    movieIdx: index("movie_feedbacks_movie_idx").on(table.movieId),
  })
);