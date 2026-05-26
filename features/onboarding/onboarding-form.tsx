"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { logTags, systemRoles } from "@/lib/constants";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Contact02Icon,
  Shield01Icon,
  User03Icon,
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
import { Badge } from "@/components/ui/badge";

interface Props {
  role: string;
}

const formSchema = z.object({
  lastName: z
    .string()
    .min(4, { message: "Last Name must be at least 4 characters" }),
  firstName: z
    .string()
    .min(4, { message: "First Name must be at least 4 characters" }),
  telephone: z
    .string()
    .min(9, { message: "Telephone must be at least 9 characters" })
    .max(9, { message: "Telephone must have 9 characters" }),
});

export const OnboardingForm = ({ role }: Props) => {
  const router = useRouter();
  const createProfile = useMutation(api.fx.profile.create);
  const updateProfile = useMutation(api.fx.profile.update);
  const logMutation = useMutation(api.fx.logs.createLog);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      telephone: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      try {
        await createProfile({ role: [systemRoles[3]] });
        await logMutation({
          tag: logTags.createProfile,
          status: "SUCCESS",
          collectionIdentifier: "Profile",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (!message.includes("Profile already exists")) {
          throw error;
        }
      }

      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        telephone: data.telephone,
      });

      await logMutation({
        tag: logTags.updateProfile,
        status: "SUCCESS",
        collectionIdentifier: "Profile",
      });
      toast.success("Profile saved");
      router.replace("/");
    } catch (error) {
      await logMutation({
        tag: logTags.updateProfile,
        status: "FAILED",
        collectionIdentifier: "Profile",
      });
      const message =
        error instanceof Error
          ? error.message
          : "Error updating your profile. Try again";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full sm:max-w-96">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Update your profile informations</CardDescription>
      </CardHeader>
      <form
        id="oboarding-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <CardContent className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-4 rounded-lg">
            <div className="hidden lg:flex items-center justify-center bg-gray-100 p-4 rounded-xl">
              <HugeiconsIcon
                icon={User03Icon}
                size={96}
                strokeWidth={1}
                className="transition-colors"
              />
            </div>
            <div className="flex lg:hidden items-center justify-center bg-gray-100 p-4 rounded-xl">
              <HugeiconsIcon
                icon={User03Icon}
                size={48}
                strokeWidth={1.2}
                className="transition-colors"
              />
            </div>
            <Badge variant={"role"}>
              <HugeiconsIcon
                icon={Shield01Icon}
                size={20}
                strokeWidth={2}
                className="transition-colors"
              />
              <span className="lowercase">{role}</span>
            </Badge>
          </div>
          <FieldGroup>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="onboarding-form-firstName">
                    First Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="onboarding-form-firstName"
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
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="onboarding-form-lastName">
                    Last Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="onboarding-form-lastName"
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
              name="telephone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="onboarding-form-telephone">
                    Telephone
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <HugeiconsIcon
                        icon={Contact02Icon}
                        size={24}
                        strokeWidth={2}
                        className="transition-colors"
                      />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="onboarding-form-firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="999888777"
                      autoComplete="off"
                      type="tel"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
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
              <span>Update</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
