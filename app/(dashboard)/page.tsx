"use client";

import { AppSidebar } from "@/features/dashboard/app-sidebar"
import { ChartAreaInteractive } from "@/features/dashboard/chart-area-interactive"
import { DataTable } from "@/features/dashboard/data-table"
import { SectionCards } from "@/features/dashboard/section-cards"
import { SiteHeader } from "@/features/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import tableData from "./data.json"
import { useRouter } from "next/navigation"
import { useConvexAuth, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { isOnboardingComplete } from "@/lib/profile"
import { useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.fx.users.currentUserWithProfile,
    isAuthenticated ? {} : "skip",
  );

  useEffect(() => {
    if (data !== undefined && data !== null && !isOnboardingComplete(data.profile)) {
      router.replace("/onboarding");
    }
  }, [data, router]);
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={tableData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
