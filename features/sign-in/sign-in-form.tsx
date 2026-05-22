"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { HugeiconsIcon } from "@hugeicons/react";
import { Envelope, Key01Icon, User03Icon } from "@hugeicons/core-free-icons";
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
  email: z.email().optional(),
  username: usernameSchema,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SignInForm = () => {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: undefined,
      username: "",
      password: "",
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
      await signIn("password", { ...data, flow });
      router.replace("/onboarding");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Card className="w-full sm:max-w-96">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign {flow === "signIn" ? "in" : "up"} with your username and password
        </CardDescription>
      </CardHeader>
      <form
        id="sign-in-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <CardContent>
          <FieldGroup>
            {flow === "signUp" && (
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
                        id="sign-in-form-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="jane@example.com"
                        autoComplete="off"
                        type="email"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
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
                      id="sign-in-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="jane_doe"
                      autoComplete="off"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
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
                      id="sign-in-form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="•••••••"
                      type="password"
                      autoComplete="off"
                    />
                  </InputGroup>
                </Field>
              )}
            />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1">
                <Spinner />
                <span>Submitting...</span>
              </div>
            ) : (
              <span>{flow === "signIn" ? "Sign in" : "Sign up"}</span>
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-2"
              onClick={() =>
                setFlow((current) =>
                  current === "signIn" ? "signUp" : "signIn",
                )
              }
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
