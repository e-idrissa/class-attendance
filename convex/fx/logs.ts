import { v } from "convex/values";
import { mutation, query, internalMutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../_generated/dataModel";

export async function logInternal(
  ctx: { db: any },
  args: {
    tag: string;
    status: "SUCCESS" | "FAILED";
    author: Id<"users">;
    collectionIdentifier?: string;
  },
) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  await ctx.db.insert("logs", {
    tag: args.tag,
    author: args.author,
    date: date,
    time: time,
    status: args.status,
    data: {
      collectionIdentifier: args.collectionIdentifier ?? "Auth",
    },
  });
}

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
      return;
    }

    await logInternal(ctx, {
      tag: args.tag,
      status: args.status,
      author,
      collectionIdentifier: args.collectionIdentifier,
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
      .take(7);
  },
});
