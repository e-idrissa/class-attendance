"use client";

import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { ActivityTable } from "@/features/profile/activity-table";
import { ClassCards } from "@/features/profile/class-cards";
import { Identity } from "@/features/profile/identity";
import { classesData } from "@/lib/constants";
import { useQuery } from "convex/react";

const ProfilePage = () => {
  const data = useQuery(api.fx.users.currentUserWithProfile);

  if (data === undefined || data === null) {
    return <Spinner />;
  }

  const { user, profile } = data;

  return (
    <div className="flex flex-col gap-4 lg:gap-6 lg:flex-row py-4 md:py-6 w-full justify-center mt-0 lg:mt-10">
      <div className="px-4 lg:px-6">
        <Identity
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          telephone={profile?.telephone}
          role={profile?.role[0]}
          email={user.email}
          isShepherd={!profile?.isShepherd}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <ClassCards classes={classesData}/>
        <ActivityTable />
      </div>
    </div>
  );
};

export default ProfilePage;
