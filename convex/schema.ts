import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  // Override default auth `users` to store app usernames (see convex/auth.ts profile).
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    username: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_username", ["username"]),

  logs: defineTable({
    tag: v.string(),
    author: v.id("users"),
    date: v.string(),
    time: v.string(),
    status: v.union(v.literal("SUCCESS"), v.literal("FAILED")),
    data: v.object({
      collectionIdentifier: v.string(),
    }),
  })
    .index("by_date", ["date"])
    .index("by_author_date", ["author", "date"]),

  profiles: defineTable({
    userId: v.id("users"),
    role: v.array(v.string()),
    telephone: v.optional(v.string()),
    lastName: v.optional(v.string()),
    firstName: v.optional(v.string()),
    classes: v.optional(v.array(v.string())),
    isShepherd: v.optional(v.boolean())
  }).index("by_userId", ["userId"]),
});
