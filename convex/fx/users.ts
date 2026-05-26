import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { normalizeUsername } from "../utils";
import { ConvexError, v } from "convex/values";

/** Specified user's `users` document */
export const getUserEmailByUsername = query({
  args: {
    username: v.string(),
  },

  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    return user?.email ?? null;
  },
});

/** Authenticated user's `users` document, or null if signed out. */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/** `users` row plus linked `profiles` row (profile may be null before onboarding). */
export const currentUserWithProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (user === null) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return { user, profile };
  },
});

/** Retrieve user ID by email or username (internal helper for logging) */
export const getUserIdByIdentifier = query({
  args: {
    identifier: v.string(),
  },
  handler: async (ctx, args) => {
    const identifier = normalizeUsername(args.identifier);

    // Try username first
    const byUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", identifier))
      .unique();

    if (byUsername) return byUsername._id;

    // Then try email
    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identifier))
      .unique();

    return byEmail?._id ?? null;
  },
});

/** Create a new user with the username and the email */
export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);
    const email = args.email.trim().toLowerCase();

    // 1. Check if username is taken
    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existingUsername !== null) {
      throw new ConvexError("Username already taken");
    }

    // 2. Check if email is taken
    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingEmail !== null) {
      throw new ConvexError("Email already registered");
    }

    // 3. Insert the user record
    const userId = await ctx.db.insert("users", {
      username,
      email,
    });

    // 4. Create an associated profile with default student role
    await ctx.db.insert("profiles", {
      userId,
      role: ["STUDENT"],
    });

    return userId;
  },
});
