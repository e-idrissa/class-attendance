import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/** Normalize usernames so sign-up and sign-in use the same account id. */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

/** Get the public URL for a file stored in Convex storage. */
export async function getFileUrl(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  storageId: Id<"_storage">,
) {
  return await ctx.storage.getUrl(storageId);
}
