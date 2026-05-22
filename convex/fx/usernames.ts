import { query } from "../_generated/server";
import { v } from "convex/values";
import { isValidUsername, normalizeUsername } from "../utils";

/** Optional: call from the sign-up UI before submit to show "username taken". */
export const isUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const normalized = normalizeUsername(username);
    if (!isValidUsername(normalized)) {
      return { available: false as const, reason: "invalid" as const };
    }
    const existing = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", normalized))
      .first();
    return {
      available: existing === null,
      reason: existing === null ? undefined : ("taken" as const),
    };
  },
});
