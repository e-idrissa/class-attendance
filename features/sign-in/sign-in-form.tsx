"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Envelope,
  Key01Icon,
  User03Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const usernameSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase())
  .pipe(
    z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" })
      .regex(/^[a-z0-9_]+$/, {
        message: "Use only lowercase letters, numbers, and underscores",
      }),
  );

const formSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email or Username must be at least 3 characters" })
    .optional(),
  username: usernameSchema.optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  code: z
    .string()
    .min(6, { message: "Code must be at least 6 characters" })
    .optional(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
});

type AuthFlow = "signIn" | "signUp" | "forgotPassword" | "resetVerification";

export const SignInForm = () => {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const convex = useConvex();

  const [flow, setFlow] = useState<AuthFlow>("signIn");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: undefined,
      username: undefined,
      password: undefined,
      code: undefined,
      newPassword: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);

    try {
      // Forgot password
      if (flow === "forgotPassword") {
        await signIn("password", {
          email: data.email!,
          flow: "reset",
        });

        setFlow("resetVerification");
        toast.success("Reset code sent to your email");

        return;
      }

      // Reset verification
      if (flow === "resetVerification") {
        await signIn("password", {
          email: data.email!,
          code: data.code!,
          newPassword: data.newPassword!,
          flow: "reset-verification",
        });

        toast.success("Password reset successfully. You can now sign in.");

        setFlow("signIn");

        return;
      }

      const username = data.username;
      let email = "";

      // Username login support
      if (flow === "signIn" && username !== undefined) {
        const foundEmail = await convex.query(
          api.fx.users.getUserEmailByUsername,
          {
            username: username,
          },
        );

        if (!foundEmail) {
          throw new Error("Invalid username or password");
        }

        email = foundEmail;
      }

      const params: Record<string, string> = {
        email,
        flow,
      };

      if (data.username) {
        params.username = data.username;
      }

      if (data.password) {
        params.password = data.password;
      }

      await signIn("password", params);

      router.replace("/onboarding");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Try again.";

      setError(message);
      toast.error(message);
    }
  };

  const getTitle = () => {
    switch (flow) {
      case "signIn":
        return "Welcome back";
      case "signUp":
        return "Create an account";
      case "forgotPassword":
        return "Reset password";
      case "resetVerification":
        return "Check your email";
    }
  };

  const getDescription = () => {
    switch (flow) {
      case "signIn":
        return "Sign in with your email and password";
      case "signUp":
        return "Join us by creating a new account";
      case "forgotPassword":
        return "Enter your email to receive a reset code";
      case "resetVerification":
        return "Enter the code sent to your email and your new password";
    }
  };

  return (
    <Card className="w-full sm:max-w-96">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-xl font-semibold">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <form
        id="sign-in-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <CardContent>
          <FieldGroup>
            {(flow === "signIn" || flow === "signUp") && (
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-form-username">
                      Username
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <HugeiconsIcon
                          icon={User03Icon}
                          size={24}
                          strokeWidth={2}
                          className="transition-colors"
                        />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        value={field.value ?? ""}
                        id="sign-in-form-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="jane_doe"
                        autoComplete="username"
                        type="text"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {(flow === "resetVerification" || flow === "signUp" || flow === "forgotPassword") && (
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-form-email">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <HugeiconsIcon
                          icon={Envelope}
                          size={24}
                          strokeWidth={2}
                          className="transition-colors"
                        />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        value={field.value ?? ""}
                        id="sign-in-form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="jane@example.com"
                        autoComplete="email"
                        type="email"
                        disabled={flow === "resetVerification"}
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}

            {(flow === "signIn" || flow === "signUp") && (
              <>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="sign-in-form-password">
                        Password
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <HugeiconsIcon
                            icon={Key01Icon}
                            size={24}
                            strokeWidth={2}
                            className="transition-colors"
                          />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          value={field.value ?? ""}
                          id="sign-in-form-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                          type="password"
                          autoComplete={
                            flow === "signIn"
                              ? "current-password"
                              : "new-password"
                          }
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button
                  type="button"
                  variant={"link"}
                  className="underline underline-offset-2 -mt-6 w-fit ml-auto"
                  onClick={() => setFlow("forgotPassword")}
                >
                  Forgot password?
                </Button>
              </>
            )}

            {flow === "resetVerification" && (
              <>
                <Controller
                  name="code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="sign-in-form-code">
                        Reset Code
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <HugeiconsIcon
                            icon={Tick01Icon}
                            size={24}
                            strokeWidth={2}
                            className="transition-colors"
                          />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          value={field.value ?? ""}
                          id="sign-in-form-code"
                          aria-invalid={fieldState.invalid}
                          placeholder="123456"
                          autoComplete="one-time-code"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="sign-in-form-new-password">
                        New Password
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <HugeiconsIcon
                            icon={Key01Icon}
                            size={24}
                            strokeWidth={2}
                            className="transition-colors"
                          />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          value={field.value ?? ""}
                          id="sign-in-form-new-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1">
                <Spinner />
                <span>Submitting...</span>
              </div>
            ) : (
              <span>
                {flow === "signIn"
                  ? "Sign in"
                  : flow === "signUp"
                    ? "Sign up"
                    : flow === "forgotPassword"
                      ? "Send reset code"
                      : "Reset password"}
              </span>
            )}
          </Button>

          <div className="flex flex-col gap-2 w-full text-center text-sm text-muted-foreground">
            {(flow === "signIn" || flow === "signUp") && (
              <p>
                {flow === "signIn"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="font-medium underline underline-offset-2 text-primary"
                  onClick={() =>
                    setFlow((current) =>
                      current === "signIn" ? "signUp" : "signIn",
                    )
                  }
                >
                  {flow === "signIn" ? "Sign up" : "Sign in"}
                </button>
              </p>
            )}

            {(flow === "forgotPassword" || flow === "resetVerification") && (
              <button
                type="button"
                className="font-medium underline underline-offset-2 text-primary"
                onClick={() => setFlow("signIn")}
              >
                Back to sign in
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
