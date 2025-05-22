import { User, BaggageClaim,  LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/dashboard/user/profile",
    icon: User,
  },
  {
    title: "Orders",
    url: "/dashboard/user/orders",
    icon: BaggageClaim,
  },
  
];

export function UserSidebar() {
  return (
      <Sidebar  collapsible="icon" className='z-0 mt-16 '>
        <SidebarContent className='bg-white dark:bg-[#161b22] shadow-md'>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}
