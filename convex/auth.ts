import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";
import { isValidUsername, normalizeUsername } from "./utils";
import { PasswordReset } from "./passwordReset";

const UsernamePassword = Password<DataModel>({
  profile(params) {
    if (typeof params.email !== "string") {
      throw new ConvexError("Email is required");
    }

    const result: {
      email: string;
      username?: string;
    } = {
      email: params.email,
    };

    if (typeof params.username === "string") {
      const username = normalizeUsername(params.username);

      if (!isValidUsername(username)) {
        throw new ConvexError(
          "Username must be 3–20 characters",
        );
      }

      result.username = username;
    }

    return result;
  },

  reset: PasswordReset,
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [UsernamePassword],
});
