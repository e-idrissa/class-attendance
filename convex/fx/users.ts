import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { normalizeUsername } from "../utils";
import { v } from "convex/values";

/** Specified user's `users` document */
export const getUserEmailByUsername = query({
  args: {
    username: v.string(),
  },

  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) =>
        q.eq("username", username)
      )
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
