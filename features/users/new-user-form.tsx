"use client";

import z from "zod";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { logTags } from "@/lib/constants";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Envelope, User03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  email: z.email(),
  role: z.string().min(4, { message: "Role must be at least 4 characters" }),
});

export const NewUserForm = () => {
  const createUser = useMutation(api.fx.users.createUser);
  const logMutation = useMutation(api.fx.logs.createLog);
  const sendOnboardingEmail = useAction(api.onboarding.sendOnboardingEmail);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "STUDENT",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createUser({
        username: data.username,
        email: data.email,
        role: data.role
      });
      // await sendOnboardingEmail({ email: data.email });
      await sendOnboardingEmail({ email: "id.hemedy98@gmail.com" });
      await logMutation({
        tag: logTags.createUser,
        status: "SUCCESS",
        collectionIdentifier: "Users",
      });
      toast.success("User created successfully");
      form.reset();
    } catch (error) {
      await logMutation({
        tag: logTags.createUser,
        status: "FAILED",
        collectionIdentifier: "Users",
      });
      const message =
        error instanceof Error
          ? error.message
          : "Error creating user. Try again";
      toast.error(message);
    }
  };

  return (
    <Card className="w-120 h-fit mx-4 mt-0 lg:mt-16 lg:mx-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add a new user</CardTitle>
        <CardDescription>
          Quickly add a new user to the application
        </CardDescription>
      </CardHeader>
      <form
        id="new-user-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <CardContent>
          <FieldGroup>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-user-form-username">
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
                      id="new-user-form-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="jane-doe"
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
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-user-form-email">Email</FieldLabel>
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
                      id="new-user-form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="jane@email.com"
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
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <RadioGroup
                  value={field.value || "STUDENT"}
                  onValueChange={field.onChange}
                  className="max-w-sm"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="new-user-form-role-mentor">
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldTitle>Mentor</FieldTitle>
                        <FieldDescription>
                          An intercessor who ministers at Prayer School.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value="MENTOR"
                        id="new-user-form-role-mentor"
                      />
                    </Field>
                  </FieldLabel>

                  <FieldLabel htmlFor="new-user-form-role-student">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Student</FieldTitle>
                        <FieldDescription>
                          Church Christian on Prayer School program.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value="STUDENT"
                        id="new-user-form-role-student"
                      />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
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
              <span>Create User</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
