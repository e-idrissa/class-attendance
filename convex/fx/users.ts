import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { normalizeUsername } from "../utils";
import { ConvexError, v } from "convex/values";
import { logInternal } from "./logs";
import { logTags } from "../../lib/constants";

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
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const authenticatedUserId = await getAuthUserId(ctx);
    if (authenticatedUserId === null) {
      throw new ConvexError("Not signed in");
    }

    const username = normalizeUsername(args.username);
    const email = args.email.trim().toLowerCase();

    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existingUsername !== null) {
      await logInternal(ctx, {
        tag: logTags.createUser,
        status: "FAILED",
        author: authenticatedUserId,
        collectionIdentifier: "Users",
      });
      throw new ConvexError("Username already taken");
    }

    const existingEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingEmail !== null) {
      await logInternal(ctx, {
        tag: logTags.createUser,
        status: "FAILED",
        author: authenticatedUserId,
        collectionIdentifier: "Users",
      });
      throw new ConvexError("Email already registered");
    }

    const userId = await ctx.db.insert("users", {
      username,
      email,
    });

    await ctx.db.insert("profiles", {
      userId,
      role: [args.role],
    });

    await logInternal(ctx, {
      tag: logTags.createUser,
      status: "SUCCESS",
      author: authenticatedUserId,
      collectionIdentifier: "Users",
    });

    // TODO: Send an email to the user after creation with the signinWithParams link (/sigin?strategy=create)

    return userId;
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const users = await ctx.db.query("users").collect();

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .unique();

        return {
          ...user,
          profile: profile
            ? {
                role: profile.role,
                firstName: profile.firstName,
                lastName: profile.lastName,
                telephone: profile.telephone,
                isShepherd: profile.isShepherd
              }
            : null,
        };
      }),
    );

    return usersWithProfiles;
  },
});

export const removeUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const authenticatedUserId = await getAuthUserId(ctx);
    if (authenticatedUserId === null) {
      throw new ConvexError("Not signed in");
    }

    // 1. Delete profiles
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // 2. Delete sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // 3. Delete accounts
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // 4. Delete user
    await ctx.db.delete(args.userId);

    await logInternal(ctx, {
      tag: logTags.deleteUser,
      status: "SUCCESS",
      author: authenticatedUserId,
      collectionIdentifier: "Users",
    });
  },
});
