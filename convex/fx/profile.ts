import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { normalizeUsername } from "../utils";
import { logInternal } from "./logs";
import { logTags } from "../../lib/constants";

const DEFAULT_ROLE = "STUDENT" as const;

/** Create the signed-in user's profile (onboarding). Fails if one already exists. */
export const create = mutation({
  args: {
    role: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not signed in");
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing !== null) {
      await logInternal(ctx, {
        tag: logTags.createProfile,
        status: "FAILED",
        author: userId,
        collectionIdentifier: "Profiles",
      });
      throw new ConvexError("Profile already exists");
    }

    await ctx.db.insert("profiles", {
      userId,
      role: args.role ?? [DEFAULT_ROLE],
      isShepherd: false
    });

    await logInternal(ctx, {
      tag: logTags.createProfile,
      status: "SUCCESS",
      author: userId,
      collectionIdentifier: "Profiles",
    });
  },
});

/** Update the signed-in user's profile. Only provided fields are changed. */
export const update = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    telephone: v.optional(v.string()),
    role: v.optional(v.string()),
    isShepherd: v.optional(v.boolean()),
    classes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not signed in");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (profile === null) {
      await logInternal(ctx, {
        tag: logTags.updateProfile,
        status: "FAILED",
        author: userId,
        collectionIdentifier: "Profiles",
      });
      throw new ConvexError("Profile not found");
    }

    const patch: {
      firstName?: string;
      lastName?: string;
      telephone?: string;
      role?: string[];
      isShepherd?: boolean;
      classes?: string[];
    } = {};

    if (args.firstName !== undefined) patch.firstName = args.firstName;
    if (args.lastName !== undefined) patch.lastName = args.lastName;
    if (args.telephone !== undefined) patch.telephone = args.telephone;
    if (args.role !== undefined) patch.role = [args.role];
    if (args.isShepherd !== undefined) patch.isShepherd = args.isShepherd;
    if (args.classes !== undefined) patch.classes = args.classes;

    if (Object.keys(patch).length === 0) {
      return profile._id;
    }

    await ctx.db.patch(profile._id, patch);

    await logInternal(ctx, {
      tag: logTags.updateProfile,
      status: "SUCCESS",
      author: userId,
      collectionIdentifier: "Profiles",
    });

    return profile._id;
  },
});

/** Get user Profile by ID */
export const getUserProfile = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.id))
      .first();

    return profile;
  },
});

export const makeLeader = mutation({
  args: {
    username: v.string()
  },
  handler: async (ctx, args) => {
    const authenticatedUserId = await getAuthUserId(ctx);
    if (authenticatedUserId === null) {
      throw new ConvexError("Not signed in");
    }

    const username = normalizeUsername(args.username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (user === null) {
      await logInternal(ctx, {
        tag: logTags.updateUser,
        status: "FAILED",
        author: authenticatedUserId,
        collectionIdentifier: "Users",
      });
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (profile === null) {
      await logInternal(ctx, {
        tag: logTags.updateProfile,
        status: "FAILED",
        author: authenticatedUserId,
        collectionIdentifier: "Profiles",
      });
      return null;
    }

    await ctx.db.patch(profile._id, { role: ["LEADER"] });

    await logInternal(ctx, {
      tag: logTags.updateProfile,
      status: "SUCCESS",
      author: authenticatedUserId,
      collectionIdentifier: "Profiles",
    });

    return { success: true };
  }
});