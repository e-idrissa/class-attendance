import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createLog = mutation({
  args: {
    tag: v.string(),
    status: v.union(v.literal("SUCCESS"), v.literal("FAILED")),
    userId: v.optional(v.id("users")),
    collectionIdentifier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authenticatedUserId = await getAuthUserId(ctx);
    const author = args.userId ?? authenticatedUserId;

    if (!author) {
      // We can't log without an author based on the current schema
      return;
    }

    const now = new Date();
    
    // Format date: YYYY-MM-DD
    const date = now.toISOString().split("T")[0];
    
    // Format time: HH:mm (e.g., 14:56)
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    await ctx.db.insert("logs", {
      tag: args.tag,
      author: author,
      date: date,
      time: time,
      status: args.status,
      data: {
        collectionIdentifier: args.collectionIdentifier ?? "auth",
      },
    });
  },
});

export const getLatestLogs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("logs")
      .withIndex("by_author_date", (q) => q.eq("author", userId))
      .order("desc")
      .take(5);
  },
});
