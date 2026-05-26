"use client";

import { NavDocuments } from "@/components/global/nav-documents";
import { NavMain } from "@/components/global/nav-main";
import { NavSecondary } from "@/components/global/nav-secondary";
import { NavUser } from "@/components/global/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Menu01Icon,
  ChartHistogramIcon,
  Folder01Icon,
  UserGroupIcon,
  Camera01Icon,
  File01Icon,
  Settings05Icon,
  HelpCircleIcon,
  SearchIcon,
  Database01Icon,
  Analytics01Icon,
  BookOpen02Icon,
} from "@hugeicons/core-free-icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />,
    },
    {
      title: "Analytics",
      url: "#",
      icon: <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} />,
    },
    {
      title: "Projects",
      url: "#",
      icon: <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />,
    },
    {
      title: "Users",
      url: "/users",
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
    },
    {
      title: "Search",
      url: "#",
      icon: <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <HugeiconsIcon icon={Database01Icon} strokeWidth={2} />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const res = useQuery(api.fx.users.currentUserWithProfile);

  const userData = {
    firstName: res?.profile?.firstName || "",
    lastName: res?.profile?.lastName || "",
    email: res?.user.email || "",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <HugeiconsIcon
                icon={BookOpen02Icon}
                strokeWidth={2}
                className="size-5!"
              />
              <span className="text-base font-semibold">ASys Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
