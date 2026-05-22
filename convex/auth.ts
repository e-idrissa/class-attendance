import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";
import { isValidUsername, normalizeUsername } from "./utils";

const UsernamePassword = Password<DataModel>({
  profile(params) {
    const raw = params.username;
    if (typeof raw !== "string") {
      throw new ConvexError("Username is required");
    }

    const username = normalizeUsername(raw);
    if (!isValidUsername(username)) {
      throw new ConvexError(
        "Username must be 3–20 characters: lowercase letters, numbers, or underscores",
      );
    }

    // `email` is the login id stored on authAccounts (providerAccountId).
    // We use the normalized username as that id; `username` is stored on users.
    return { email: username, username };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [UsernamePassword],
});
