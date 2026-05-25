"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";

import { api } from "@/convex/_generated/api";
import { isOnboardingComplete } from "@/lib/profile";
import tableData from "../data.json";

import { ChartAreaInteractive } from "@/features/dashboard/chart-area-interactive";
import { DataTable } from "@/features/dashboard/data-table";
import { SectionCards } from "@/features/dashboard/section-cards";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.fx.users.currentUserWithProfile,
    isAuthenticated ? {} : "skip",
  );

  useEffect(() => {
    if (
      data !== undefined &&
      data !== null &&
      !isOnboardingComplete(data.profile)
    ) {
      router.replace("/onboarding");
    }
  }, [data, router]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={tableData} />
    </div>
  );
}
