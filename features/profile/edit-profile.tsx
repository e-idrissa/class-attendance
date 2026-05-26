"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { Controller, useForm } from "react-hook-form";

import { Contact02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { api } from "@/convex/_generated/api";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { logTags, systemRoles } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface ProfileFormProps {
  firstname: string | undefined;
  lastName: string | undefined;
  telephone: string | undefined;
  role: string | undefined;
  isShepherd: boolean;
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(4, { message: "First Name must be a least 4 characters" }),
  lastName: z
    .string()
    .min(4, { message: "Last Name must be a least 4 characters" }),
  telephone: z
    .string()
    .min(9, { message: "Telephone must be at least 9 characters" })
    .max(9, { message: "Telephone must have 9 characters" }),
  role: z
    .string()
    .min(4, { message: "First Name must be a least 4 characters" }),
  isShepherd: z.boolean(),
});

export const EditProfile = ({
  firstname,
  lastName,
  telephone,
  role,
  isShepherd,
}: ProfileFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const updateProfile = useMutation(api.fx.profile.update);
  const logMutation = useMutation(api.fx.logs.createLog);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      firstName: firstname || "",
      lastName: lastName || "",
      telephone: telephone || "",
      role: role || "",
      isShepherd: isShepherd || false,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateProfile({ ...data });
      await logMutation({
        tag: logTags.updateProfile,
        status: "SUCCESS",
        collectionIdentifier: "Profile",
      });

      toast.success("Profile updated");
      setOpen(false);
      router.refresh();
    } catch (err) {
      await logMutation({
        tag: logTags.updateProfile,
        status: "FAILED",
        collectionIdentifier: "Profile",
      });
      const message =
        err instanceof Error
          ? err.message
          : "Error updating your profile. Try again";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="default" className="absolute bottom-0 right-0">
            <HugeiconsIcon
              icon={PencilEdit01Icon}
              size={20}
              strokeWidth={2}
              className="transition-colors"
            />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-form-role">Role</FieldLabel>
                  <Select
                    id="profile-form-role"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={role !== "ADMIN"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {systemRoles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.charAt(0) + r.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-form-firstName">
                    First Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="profile-form-firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Jane"
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
                  <FieldLabel htmlFor="profile-form-lastName">
                    Last Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="profile-form-lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Doe"
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
                  <FieldLabel htmlFor="profile-form-telephone">
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
                      id="profile-form-telephone"
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
          <DialogFooter className="pt-4">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <Spinner />
                  <span>Submitting...</span>
                </div>
              ) : (
                <span>Update</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
