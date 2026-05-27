import {
  Award05Icon,
  Key01Icon,
  Shield01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EditProfile } from "@/features/profile/edit-profile";

interface Props {
  firstName: string | undefined;
  lastName: string | undefined;
  telephone: string | undefined;
  role: string | undefined;
  email: string | undefined;
  isShepherd: boolean;
}

export const Identity = ({
  firstName,
  lastName,
  telephone,
  role,
  email,
  isShepherd,
}: Props) => {
  console.log(firstName, lastName, telephone, role, email, isShepherd);
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-full">
              <div className="p-8 flex items-center justify-center rounded-full bg-gray-100">
                <HugeiconsIcon icon={User03Icon} size={64} strokeWidth={1.5} />
              </div>
              <EditProfile
                firstName={firstName}
                lastName={lastName}
                telephone={telephone}
                role={role}
                isShepherd={isShepherd}
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
            {isShepherd && (
              <Badge variant={"gold"}>
                <HugeiconsIcon
                  icon={Award05Icon}
                  size={20}
                  strokeWidth={2}
                  className="transition-colors"
                />
                <span className="lowercase">Shepherd</span>
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold">{`${firstName} ${lastName}`}</h3>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-muted-foreground">+243 {telephone}</p>
          </div>
        </div>
        <div className="max-w-96 rounded-md border p-4 space-y-2">
          <div className="rounded-md bg-gray-100 p-2 flex items-center gap-2">
            <span className="font-semibold text-gray-700">SECURITY</span>
          </div>
          <p className="text-muted-foreground text-sm text-justify">
            Your password is securely hashed and encrypted. If you want change
            it, logout and the click on the forget password link.
          </p>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={Key01Icon} strokeWidth={1.5} />
            </InputGroupAddon>
            <InputGroupInput
              type="password"
              disabled
              value={"••••••••••••••••"}
            />
          </InputGroup>
        </div>
      </CardContent>
    </Card>
  );
};
