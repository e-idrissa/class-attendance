import { Doc } from "@/convex/_generated/dataModel";

export function isOnboardingComplete(
  profile: Doc<"profiles"> | null | undefined,
): boolean {
  if (!profile) return false;
  return Boolean(
    profile.firstName?.trim() &&
      profile.lastName?.trim() &&
      profile.telephone?.trim(),
  );
}
