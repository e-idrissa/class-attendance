import { NewUserForm } from "@/features/users/new-user-form";
import tableData from "../data.json";

import { UsersSectionCards } from "@/features/users/users-section-cards";
import { UsersTable } from "@/features/users/users-table";

const UsersPage = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <UsersSectionCards />
      <div className="flex flex-col lg:flex-row">
        <UsersTable data={tableData} />
        <NewUserForm />
      </div>
    </div>
  );
};

export default UsersPage;
