"use client";

import { NewUserForm } from "@/features/users/new-user-form";

import { UsersSectionCards } from "@/features/users/users-section-cards";
import { UsersTable } from "@/features/users/users-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

const UsersPage = () => {
  const data = useQuery(api.fx.users.getAllUsers);

  if (data === undefined) {
    return <Spinner />;
  }

  const tableData = data?.map((d, idx) => ({
    id: idx,
    userId: d._id,
    email: d.email,
    username: d.username,
    onboarded: d.profile?.firstName !== undefined,
    role: d.profile?.role[0],
    firstName: d.profile?.firstName,
    lastName: d.profile?.lastName,
    telephone: d.profile?.telephone,
    isShepherd: d.profile?.isShepherd,
  }));

  const stats = {
    total: tableData?.length,
    mentors: tableData?.filter(
      (d) => d.role === "MENTOR" || d.role === "LEADER" || d.role === "ADMIN",
    )?.length,
    students: tableData?.filter((d) => d.role === "STUDENT")?.length,
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <UsersSectionCards
        total={stats.total}
        mentors={stats.mentors}
        students={stats.students}
      />
      <div className="flex flex-col lg:flex-row">
        <UsersTable data={tableData!} />
        <NewUserForm />
      </div>
    </div>
  );
};

export default UsersPage;
