import { PlusCircleIcon, UserSearch, Plus, Box, LayoutDashboard, ClipboardList } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "All Orders",
    url: "/dashboard/admin/all-orders",
    icon: ClipboardList,
  },
  {
    title: "Create Product",
    url: "/dashboard/admin/create-product",
    icon: Plus,
  },
  {
    title: "Create Category",
    url: "/dashboard/admin/create-category",
    icon: PlusCircleIcon,
  },
  {
    title: " Products",
    url: "/dashboard/admin/products",
    icon: Box,
  },
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: UserSearch,
  },
  
]

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className='h-screen mt-16 z-1'>
      <SidebarContent className="bg-[#fffffa] ">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
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
  )
}
