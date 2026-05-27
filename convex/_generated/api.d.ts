/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as fx_logs from "../fx/logs.js";
import type * as fx_profile from "../fx/profile.js";
import type * as fx_usernames from "../fx/usernames.js";
import type * as fx_users from "../fx/users.js";
import type * as http from "../http.js";
import type * as onboarding from "../onboarding.js";
import type * as passwordReset from "../passwordReset.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "fx/logs": typeof fx_logs;
  "fx/profile": typeof fx_profile;
  "fx/usernames": typeof fx_usernames;
  "fx/users": typeof fx_users;
  http: typeof http;
  onboarding: typeof onboarding;
  passwordReset: typeof passwordReset;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
